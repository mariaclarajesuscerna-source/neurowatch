# ADR-0003 — Plataforma: aplicación web (Next.js)

- **Estado:** 🟢 DECIDIDO
- **Fecha:** 2026-07-06
- **Relacionado:** [ADR-0001](0001-alerta-temprana-vs-prevencion.md), [ADR-0002](0002-arquitectura-ingesta-y-alerta.md)

## Contexto

Neurowatch necesita recibir datos del reloj ESP32 por BLE y mostrar una interfaz de monitoreo. Se evalúa: ¿web o app nativa?

### Argumentos a favor de la web

1. **Web Bluetooth API en Chrome Android cubre el caso de uso principal.** El paciente usa un teléfono Android, que ejecuta Chrome con soporte para Web Bluetooth. La web recibe datos del ESP32 sin app nativa.
2. **Desarrollo e iteración instantáneos.** Sin compilación, sin device builds, sin esperar a EAS. Hot reload en el navegador.
3. **Un solo código para todos los entornos.** La misma app funciona en escritorio (familiar/cuidador revisando historial) y en el teléfono del paciente.
4. **Sin fricción de distribución.** No hay que publicar en stores ni manejar versiones de SDK. Un deploy y todos los usuarios ven la última versión.
5. **La cámara funciona vía `getUserMedia()`** para el chequeo facial.

### Limitación aceptada

- **iOS/Safari no soporta Web Bluetooth API.** Los usuarios de iPhone no pueden usar el reloj directamente. Documentado como restricción conocida. Fase 2: bridge nativo para iOS o app complementaria.

### Camino del dato (actualizado)

`ESP32 --BLE (Web Bluetooth)--> navegador (Next.js)` → detección on-device → si anomalía: cuenta regresiva → si no cancela: `fetch()` a Telegram Bot API.

## Consecuencias

- Se elimina la dependencia de React Native, Expo, EAS Build, y cualquier toolchain mobile.
- El diseño visual (wireframes en 390×844) se adapta a responsive web (mobile-first, se expande a desktop).
- La navegación cambia de tab bar nativa a rutas Next.js (App Router) con navegación inferior fija en mobile.
- La detección y el baseline siguen siendo on-device (JavaScript en el navegador).
- Los datos se persisten en `localStorage` / IndexedDB (sin SQLite, sin backend).
