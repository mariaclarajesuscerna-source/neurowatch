# Neurowatch

Sistema de detección de anomalías de salud en tiempo real. Un reloj ESP32 con sensor PPG envía datos de pulso por BLE a una aplicación web Next.js, que detecta desviaciones respecto a un baseline personal y alerta a contactos de emergencia por Telegram.

> Herramienta asistiva. No es un dispositivo médico. No diagnostica, no predice, no reemplaza atención médica.

## Características

- **Monitoreo de pulso en vivo** — recepción BLE del sensor PPG, chart de barras en tiempo real
- **Detección de anomalías** — comparación aritmética pulso vs baseline ± tolerancia
- **Chequeo facial diario** — cámara frontal, índice de simetría con heurística de píxeles, racha de días
- **Alerta por Telegram** — cuenta regresiva cancelable; si expira, avisa a contactos de emergencia
- **Historial** — tendencia semanal de pulso, bitácora de chequeos faciales
- **Onboarding** — wizard de 4 pasos (datos, foto base, contactos, emparejamiento BLE)

## Arquitectura

```
ESP32 + MAX30102 ──BLE notify──→ Navegador (Chrome/Edge)
                                    │
                        Web Bluetooth API + Canvas API
                                    │
                        Next.js (React 19, TypeScript)
                                    │
                        Detección on-device (sin backend)
                                    │
                        Telegram Bot API (alerta saliente)
```

**Sin backend**: toda la lógica corre en el navegador. Persistencia en `localStorage`, alertas por `fetch()` directo a Telegram.

## Estructura del proyecto

```
neuronal_mobile/
├── firmware/                      # Código del reloj ESP32
│   └── esp32/neurowatch_ble/
│       ├── neurowatch_ble.ino     # Firmware (Arduino IDE)
│       ├── neurowatch_web.html    # Página de prueba BLE standalone
│       └── README.md              # Instrucciones de hardware
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (app)/                 # App principal (dashboard, chequeo, historial, etc.)
│   │   └── onboarding/            # Wizard de configuración inicial
│   ├── components/
│   │   ├── NeurowatchProvider.tsx  # Contexto global (estado, detección, alertas)
│   │   ├── alert/                 # Modal de alerta + countdown ring
│   │   ├── dashboard/             # HeroStatus, PulseCard, DeviceCard
│   │   └── ui/                    # GlassCard, StatusChip, TabBar, iconos SVG
│   ├── hooks/
│   │   ├── useBLE.ts              # Web Bluetooth API (conexión, notificaciones, mock)
│   │   └── useCountdown.ts        # Timer de cuenta regresiva
│   ├── lib/
│   │   ├── detection.ts           # Motor de detección (BPM + simetría facial)
│   │   ├── storage.ts             # Persistencia en localStorage
│   │   └── telegram.ts            # Integración con Telegram Bot API
│   └── types/                     # Declaraciones TypeScript (Web Bluetooth)
├── docs/
│   ├── adr/                       # Architecture Decision Records
│   ├── glosario.md                # Lenguaje ubicuo del dominio
│   └── spec-pantallas.md          # Especificación de pantallas
├── wireframes/                    # Diseño visual (Penpot) + design system
├── server.mjs                     # Servidor HTTPS para desarrollo en celular
├── certificates/                  # Certificados autofirmados (gitignored)
└── package.json
```

## Instalación

### Requisitos

- **Node.js** ≥ 18
- **Navegador**: Chrome o Edge (escritorio o Android). Web Bluetooth no funciona en Safari/Firefox.
- **Para desarrollo en celular**: mismo WiFi que la computadora

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd neuronal_mobile
npm install
```

### 2. Variables de entorno

Crear `.env.local`:

```env
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=TU_TOKEN_DEL_BOT
```

El token se obtiene creando un bot con [@BotFather](https://t.me/BotFather) en Telegram.

### 3. Desarrollo en escritorio

```bash
npm run dev
```

Abre `http://localhost:3000`. Agregá `?mockBLE` a la URL para simular datos del reloj sin hardware:

```
http://localhost:3000/?mockBLE
```

### 4. Desarrollo en celular (con cámara y BLE)

```bash
npm run dev:https
```

Abre en el celular: `https://192.168.0.222:3000` (reemplazá la IP por la de tu máquina).

La primera vez el navegador mostrará advertencia de certificado → **Avanzado** → **Continuar al sitio**.

> **¿Por qué HTTPS?** La Web Bluetooth API y `getUserMedia` (cámara) requieren contexto seguro. `localhost` en escritorio ya lo es; en celular vía IP necesitás HTTPS.

### 5. Firmware del reloj

Ver [`firmware/esp32/neurowatch_ble/README.md`](firmware/esp32/neurowatch_ble/README.md) para instrucciones de hardware, cableado, Arduino IDE y librerías.

Resumen rápido:
- Board: ESP32C3 Dev Module
- Librería: SparkFun MAX3010x
- Pines: MAX30102 SDA→GPIO6, SCL→GPIO7, motor→GPIO0
- El dispositivo se anuncia como "Neurowatch Band"

## Flujo de uso

1. **Onboarding** (primer uso): datos del paciente → foto base → contactos Telegram → emparejar reloj BLE
2. **Dashboard**: pulso en vivo, estado cualitativo (Estable / Atención / Alerta)
3. **Chequeo facial**: abrir cámara → capturar → índice de simetría (0-100) + racha diaria
4. **Alerta**: si el reloj detecta pulso > 100 BPM → modal de cuenta regresiva → cancelar o alertar por Telegram
5. **Historial**: tendencia semanal de pulso, bitácora de chequeos

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Animaciones | Motion |
| Lenguaje | TypeScript (strict) |
| BLE | Web Bluetooth API (navegador) |
| Cámara | `getUserMedia` + Canvas API |
| Persistencia | `localStorage` |
| Alertas | Telegram Bot API (`fetch`) |
| Firmware | Arduino (ESP32-C3 + MAX30102) |
| Deployment | Vercel |

## Documentación

- [`CONTEXT.md`](CONTEXT.md) — lenguaje ubicuo y términos del dominio
- [`docs/glosario.md`](docs/glosario.md) — glosario extendido
- [`docs/adr/`](docs/adr/) — decisiones de arquitectura (5 ADRs)
- [`docs/spec-pantallas.md`](docs/spec-pantallas.md) — especificación de pantallas
- [`firmware/esp32/neurowatch_ble/README.md`](firmware/esp32/neurowatch_ble/README.md) — hardware y firmware

## Licencia

MIT
