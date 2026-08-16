# ADR-0002 — Arquitectura de ingesta de datos y canal de alerta

- **Estado:** 🟢 DECIDIDO (v1 / prototipo)
- **Fecha:** 2026-07-06
- **Relacionado:** [ADR-0001](0001-alerta-temprana-vs-prevencion.md)
- **Actualizado por:** [ADR-0003](0003-plataforma-web.md) (plataforma), [ADR-0004](0004-stack-web.md) (stack)

## Contexto

Neurowatch es un sistema de detección/alerta en tiempo real (ADR-0001). Una alerta solo sirve si (a) el dato llega desde el reloj a la aplicación, y (b) el aviso sale hacia una persona que pueda reaccionar. Hay que fijar ambos caminos para el prototipo, sin sobre-ingeniería. (La plataforma es una aplicación web — ver [ADR-0003](0003-plataforma-web.md).)

## Decisión

### Camino del dato (ingesta)
`ESP32 (reloj) --BLE--> navegador (Web Bluetooth API)`

- El reloj emite pulso por **Bluetooth Low Energy**.
- El navegador (Chrome/Edge Android, Chrome escritorio) recibe el pulso directamente vía Web Bluetooth API.
- La detección de anomalías y persistencia corren on-device en el navegador (JavaScript).
- **Estado de conexión** es de primera clase en la UI: `Conectado` / `Desconectado`. Desconexión prolongada es en sí misma una condición a avisar (el reloj puede haberse soltado/apagado).
- Limitación documentada: Safari/iOS no soporta Web Bluetooth API. Para usuarios iOS se requerirá un bridge en fase 2.

### Canal de alerta (v1)
**Mensaje por bot de Telegram** al contacto de emergencia.

- Gratis, sin gateway de SMS, sin app propia que instalar; el backend usa la Bot API.
- Cada contacto se vincula por su `chat_id`/usuario de Telegram en onboarding.
- Upgrade futuro documentado (fase 2): SMS (Twilio) y/o llamada automática para redundancia.

### Baseline (v1)
**Ingresado en onboarding** (opción 2): al registrar al paciente se cargan edad, FC en reposo habitual y **foto base** (rostro simétrico de referencia).

- Razón: da detección funcionando desde el día 1 — apto para prototipo/demo.
- Fase 2 documentada: auto-aprendizaje del baseline sobre los primeros N días de datos reales.

### Política ante anomalía
**Cuenta regresiva con cancelación** (anti falso-positivo):
`detección → aviso al paciente + cuenta regresiva (30–60s) → si NO cancela → alerta Telegram a contactos`.

- Excepción a definir: señales críticas inequívocas (ej. pulso ausente sostenido) podrían acortar/omitir la cuenta. → pendiente de reglas clínicas.

## Consecuencias

- No se requiere backend: ingesta, persistencia, motor de detección y bot de Telegram corren en el navegador. Ver [ADR-0004](0004-stack-web.md).
- El navegador cumple doble función: **puente BLE** (en el dispositivo del paciente) y **panel de monitoreo** (para paciente y familiar).
- Onboarding se vuelve una pantalla crítica: sin baseline + contactos Telegram vinculados, el sistema no puede alertar.
- Hay que diseñar explícitamente los estados: `Desconectado`, `Anomalía / cuenta regresiva`, `Alerta enviada`. No alcanza con la pantalla feliz.
- Pendiente: reglas de excepción para señales críticas que omiten la cuenta regresiva.

---

## Vigencia post migración a web (ADR-0003)

Estas decisiones de ADR-0002 **siguen vigentes**:
- **Canal de alerta v1**: Telegram Bot API (llamada directa desde el navegador vía `fetch()`)
- **Baseline ingresado en onboarding** (no auto-aprendizaje en v1)
- **Cuenta regresiva con cancelación** como mecanismo anti falso-positivo
- **Token de Telegram embebido**: trade-off aceptado para demo. En producción, mover a función serverless
