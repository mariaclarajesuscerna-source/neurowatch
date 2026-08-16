# Product

## Register

product

## Users

Persona mayor o persona en riesgo que usa un reloj ESP32 con sensor PPG. Contexto: en su casa, con el teléfono cerca (sobre una mesa o montado). Alfabetización tecnológica mixta: el paciente puede tener baja familiaridad con apps, pero un familiar joven también puede estar del otro lado ayudando en la configuración.

Los contactos de emergencia (familiares, cuidadores, médicos) no son usuarios directos de la app: solo reciben alertas por Telegram.

## Product Purpose

Neurowatch detecta anomalías de salud en tiempo real comparando el pulso del paciente (vía sensor PPG en un reloj ESP32) contra un baseline personal. Si detecta una desviación significativa, inicia una cuenta regresiva; si el paciente no la cancela, envía una alerta por Telegram a sus contactos de emergencia.

También ofrece chequeo facial diario (asimetría vs foto base, la "F" de FAST) y un historial de tendencias con bitácora.

Es una herramienta asistiva, no un dispositivo médico. No diagnostica, no predice, no reemplaza atención médica.

## Brand Personality

**Calm, reliable, modern.** Tres palabras que guían cada decisión de UI:

- **Calm**: la interfaz no alarma innecesariamente. El estado "Estable" es tranquilo y tranquilizador. El vidrio esmerilado y el gradiente lavanda-cian producen calma visual.
- **Reliable**: tipografía Inter nítida, métricas grandes y legibles, sin ambigüedad. El color semántico siempre va acompañado de texto e ícono.
- **Modern**: glassmorphism sutil, animaciones con Motion, SVG limpio. Sin aspecto institucional ni clínico.

## Anti-references

- **UI clínica/hospitalaria**: fría, intimidante, institucional. Nada de grises planos, tipografía monoespaciada, o layouts de ficha médica.
- **App de fitness**: sin anillos de actividad, streaks, gamificación, o lenguaje motivacional de ejercicio.
- **Sobrecarga de animaciones**: el motion es intencional y al servicio del dato, no decorativo.

## Design Principles

1. **El dato de salud primero.** El pulso y el estado cualitativo son el elemento dominante de cada pantalla. El vidrio decora, nunca compite con la información.
2. **Una app, un rol.** El paciente es el usuario. Los contactos solo reciben Telegram. No hay cambio de perspectiva ni doble sesión.
3. **Color semántico disciplinado.** Verde/ámbar/rojo solo para estado de salud. Nunca rojo decorativo — el rojo siempre significa Alerta.
4. **Toque accesible.** Targets mínimos de 44px, contraste AA, texto + ícono para todo estado (nunca solo color). Copy sin jerga médica.
5. **Sin backend.** Toda la lógica corre on-device en el navegador: detección, persistencia en localStorage, y envío de alertas vía fetch() a Telegram Bot API.

## Accessibility & Inclusion

- WCAG AA en todo contraste de texto
- Estados cualitativos comunicados por color + texto + ícono (daltonismo seguro)
- Touch targets ≥44px (apto para adultos mayores y destreza reducida)
- `prefers-reduced-motion` respetado en todas las animaciones
- Tipografía Inter: sans, neutra, alta legibilidad
