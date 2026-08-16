/*
 * Neurowatch BLE Firmware — ESP32-C3 Supermini + MAX30102
 *
 * Librerías (Arduino IDE Library Manager):
 *   - SparkFun MAX3010x Pulse and Proximity Sensor Library
 *   - ESP32 BLE Arduino (incluida con el board package de ESP32)
 *
 * Pines:
 *   MAX30102 SDA     -> GPIO6
 *   MAX30102 SCL     -> GPIO7
 *   LED integrado    -> GPIO8 (LOW = encendido en la mayoria de Supermini)
 *   Motor vibrador   -> GPIO0
 *
 * Comportamiento:
 *   - Lectura y notificacion BLE cada 1000 ms (1 vez por segundo)
 *   - Sin dedo (IR < FINGER_THRESHOLD_IR) -> bpm = 0
 *   - LED integrado SOLO enciende si hay un cliente BLE conectado
 *   - Motor vibra SOLO si el BPM promedio supera BPM_ALERT_HIGH (pulso alto)
 */

#include <Wire.h>
#include <MAX30105.h>
#include <heartRate.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SDA_PIN   6
#define SCL_PIN   7
#define LED_PIN   8
#define MOTOR_PIN 0

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Solo alerta por pulso ALTO/peligroso (no por pulso bajo).
// 100 es el umbral tipico de taquicardia en reposo; ajustalo si quieres.
const uint8_t  BPM_ALERT_HIGH       = 100;

// Filtro de lecturas validas del sensor (evita valores absurdos por ruido)
const uint8_t  BPM_MIN_VALID        = 30;
const uint8_t  BPM_MAX_VALID        = 200;

const uint8_t  RATE_SIZE            = 6;
const uint32_t NOTIFY_MS            = 1000;   // 1 segundo

// Umbral de deteccion de dedo, calibrado con datos reales del sensor:
//   - Sin dedo / sobre superficie: ~29,000 - 49,000
//   - Con dedo real puesto:        ~190,000+
// Se deja un margen amplio a mitad de camino.
const long     FINGER_THRESHOLD_IR  = 90000;

// Si no se detecta un latido VALIDO en este tiempo, se fuerza bpm=0
// aunque el IR siga por encima del umbral (evita lecturas "pegadas" por ruido).
const uint32_t STALE_MS             = 3000;

// Debounce: la presencia/ausencia del dedo debe sostenerse este tiempo
// antes de confirmarse, para evitar parpadeos por lecturas momentaneas.
const uint32_t FINGER_DEBOUNCE_MS   = 800;

// Suavizado del valor que se muestra/envia (media movil exponencial).
// Mientras mas bajo, mas lento y estable se ve el numero (menos volatil).
const float    SMOOTHING_ALPHA      = 0.25;

MAX30105 particleSensor;
BLEServer*         pServer         = nullptr;
BLECharacteristic* pCharacteristic = nullptr;
bool bleConnected = false;

long  irValue         = 0;
byte  rates[RATE_SIZE] = {0};
byte  rateSpot        = 0;
byte  validCount      = 0; // cuantos latidos reales llevamos acumulados (hasta RATE_SIZE)
long  lastBeat         = 0;
float beatsPerMinute   = 0;
int   beatAvg          = 0;
bool  motorOn          = false;

uint32_t lastNotifyMs = 0;
char payload[96];

// Estado confirmado (con debounce) de si hay dedo presente
bool     fingerConfirmed     = false;
uint32_t fingerChangeStartMs = 0;

// Valor suavizado que realmente se envia/muestra
float displayBpm = 0;

// ── BLE Callbacks ─────────────────────────────────────
class ServerCB : public BLEServerCallbacks {
  void onConnect(BLEServer*) {
    bleConnected = true;
    digitalWrite(LED_PIN, LOW);   // LED solo enciende conectado a la web
  }
  void onDisconnect(BLEServer*) {
    bleConnected = false;
    digitalWrite(LED_PIN, HIGH);  // apagado
    BLEDevice::startAdvertising();
  }
};

// (No hay comandos de escritura por ahora; se deja la característica
//  como READ/NOTIFY solamente para simplificar la conexión desde la web)

// ── Funciones auxiliares ──────────────────────────────
void resetLectura() {
  beatAvg      = 0;
  lastBeat     = 0;
  rateSpot     = 0;
  validCount   = 0;
  for (byte i = 0; i < RATE_SIZE; i++) rates[i] = 0;
  if (motorOn) {
    motorOn = false;
    digitalWrite(MOTOR_PIN, LOW);
  }
}

void actualizarMotor(int bpmParaDecidir) {
  // Sin lectura valida -> motor siempre apagado
  if (bpmParaDecidir <= 0) {
    if (motorOn) {
      motorOn = false;
      digitalWrite(MOTOR_PIN, LOW);
    }
    return;
  }

  bool pulsoElevado = (bpmParaDecidir > BPM_ALERT_HIGH);

  if (pulsoElevado && !motorOn) {
    motorOn = true;
    digitalWrite(MOTOR_PIN, HIGH);
  } else if (!pulsoElevado && motorOn) {
    motorOn = false;
    digitalWrite(MOTOR_PIN, LOW);
  }
}

// ── Setup ─────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);   // apagado hasta que haya conexion BLE
  pinMode(MOTOR_PIN, OUTPUT);
  digitalWrite(MOTOR_PIN, LOW);

  // MAX30102
  Wire.begin(SDA_PIN, SCL_PIN);
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 no encontrado. Revisa el cableado I2C.");
    while (1) {
      delay(1000); // no usamos el LED aqui: solo indica conexion BLE
    }
  }
  particleSensor.setup(0x3C, 1, 2, 100, 411, 4096);
  particleSensor.clearFIFO();
  Serial.println("MAX30102 OK");

  // BLE
  BLEDevice::init("Neurowatch Band");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCB());

  BLEService* pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_NOTIFY
  );
  pCharacteristic->addDescriptor(new BLE2902());
  pCharacteristic->setValue("{\"bpm\":0,\"motor\":0,\"ir\":0}");
  pService->start();

  BLEAdvertising* adv = BLEDevice::getAdvertising();
  adv->addServiceUUID(SERVICE_UUID);
  adv->start();
  Serial.println("BLE OK - esperando conexion...");
}

// ── Loop ──────────────────────────────────────────────
void loop() {
  irValue = particleSensor.getIR();

  bool fingerRaw = (irValue > FINGER_THRESHOLD_IR);

  // Debounce: solo confirmamos el cambio de estado si se sostiene
  // durante FINGER_DEBOUNCE_MS (evita parpadeos por lecturas puntuales)
  if (fingerRaw != fingerConfirmed) {
    if (fingerChangeStartMs == 0) fingerChangeStartMs = millis();
    if (millis() - fingerChangeStartMs >= FINGER_DEBOUNCE_MS) {
      fingerConfirmed = fingerRaw;
      fingerChangeStartMs = 0;
    }
  } else {
    fingerChangeStartMs = 0;
  }

  bool dedoDetectado = fingerConfirmed;

  if (dedoDetectado) {
    // IMPORTANTE: checkForBeat() debe llamarse en CADA vuelta del loop,
    // sin saltarse muestras, porque mantiene su propio filtro interno
    // de la señal para detectar el pico del latido.
    if (checkForBeat(irValue)) {
      uint32_t now = millis();
      long delta = now - lastBeat;
      lastBeat = now;

      beatsPerMinute = 60.0 / (delta / 1000.0);

      if (beatsPerMinute >= BPM_MIN_VALID && beatsPerMinute <= BPM_MAX_VALID) {
        rates[rateSpot++] = (byte)beatsPerMinute;
        rateSpot %= RATE_SIZE;
        if (validCount < RATE_SIZE) validCount++;

        uint16_t total = 0;
        for (byte i = 0; i < validCount; i++) total += rates[i];
        beatAvg = total / validCount;
      }
    }
  } else {
    // Sin dedo detectado -> 0 pulsaciones y limpiar historial
    resetLectura();
  }

  // Watchdog: si el IR sigue alto (ej. superficie reflejando luz) pero
  // hace rato que no se detecta un latido valido, no confiamos en el bpm.
  if (beatAvg != 0 && lastBeat != 0 && (millis() - lastBeat) > STALE_MS) {
    resetLectura();
  }

  // Notificar por BLE una vez por segundo
  if (millis() - lastNotifyMs >= NOTIFY_MS) {
    lastNotifyMs = millis();

    // Suavizado: el valor mostrado se mueve gradualmente hacia el promedio
    // real, en vez de saltar de golpe. Tambien hace que el 0 tarde un poco
    // en aparecer cuando se pierde la señal, en vez de cortar de un tajo.
    displayBpm += SMOOTHING_ALPHA * ((float)beatAvg - displayBpm);
    if (displayBpm < 0.5) displayBpm = 0; // evita que quede flotando en 0.3, 0.1...

    int bpmToSend = (int)(displayBpm + 0.5);

    actualizarMotor(bpmToSend);

    snprintf(payload, sizeof(payload),
             "{\"bpm\":%d,\"motor\":%d,\"ir\":%ld}",
             bpmToSend, motorOn ? 1 : 0, irValue);

    if (bleConnected) {
      pCharacteristic->setValue(payload);
      pCharacteristic->notify();
    }
    Serial.println(payload);
  }
}
