# Firmware Neurowatch — ESP32-C3 Supermini + MAX30102

## Hardware

| Componente | Pin |
|-----------|-----|
| MAX30102 SDA | GPIO6 |
| MAX30102 SCL | GPIO7 |
| LED integrado | GPIO8 (LOW = encendido, lógica inversa) |
| Motor vibrador | GPIO0 |

## Configuración en Arduino IDE

### 1. Instalar ESP32 Arduino Core v3.x

File → Preferences → Additional Boards Manager URLs:
```
https://espressif.github.io/arduino-esp32/package_esp32_index.json
```

Tools → Board → Boards Manager → buscar `esp32` → instalar **v3.x** (by Espressif)

### 2. Seleccionar board

Tools → Board → ESP32 → **ESP32C3 Dev Module**

Ajustes recomendados:
- USB CDC On Boot: `Enabled`
- CPU Frequency: `160 MHz`
- Flash Size: `4 MB`

### 3. Librerías (Library Manager)

- **SparkFun MAX3010x Pulse and Proximity Sensor Library**

La librería BLE (`BLEDevice.h`) viene incluida en el ESP32 Arduino Core v3.x. NO instalar NimBLE-Arduino aparte.

## Flujo

```
MAX30102 ──I2C──→ ESP32-C3 ──BLE notify──→ Navegador Chrome/Edge
```

Cada 500ms se envía por BLE:
```json
{"bpm":72,"motor":0,"ir":85000}
```

## Servicio BLE

- Service UUID: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- Characteristic UUID: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- READ + WRITE + NOTIFY

Comando `"cancel"` por WRITE detiene el motor.
