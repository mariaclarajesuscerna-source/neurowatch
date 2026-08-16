# Brief de wireframe — Neurowatch

> Documento de entrada, **agnóstico de plataforma** (Penpot, Figma o similar).
> Pegá o adjuntá esto junto con `design-system.md` y `../docs/spec-pantallas.md` al iniciar el diseño.

## Qué diseñar

Formato **mobile-first 390 × 844**, expandible a desktop. Es una **aplicación web responsive** que corre en el navegador (Next.js — ver ADR-0003).

Primera pasada = **ruta crítica de alerta**, pantallas **2, 3, 4 y 5** de `../docs/spec-pantallas.md`:
1. **Dashboard en vivo** (pantalla 2)
2. **Anomalía / cuenta regresiva** (pantalla 3)
3. **Alerta enviada** (pantalla 4)
4. **Desconectado** (pantalla 5)

## Cómo debe verse

- Seguir `design-system.md`: **glassmorphism claro**, tema claro, marca índigo, tarjetas de vidrio esmerilado.
- Estados de salud SIEMPRE con color semántico + texto: `● Estable` (verde), `● Atención` (ámbar), `● Alerta` (rojo).
- Cada pantalla lleva al pie el disclaimer asistivo (ver spec).

## Archivos de esta entrega

| Archivo | Rol |
|---------|-----|
| `README.md` (este) | Brief e instrucciones de diseño |
| `design-system.md` | Tokens de color, glass, tipografía, componentes |
| `untitled.pen` | Prototipo visual (archivo Penpot, fuente de verdad del diseño) |
| `../docs/spec-pantallas.md` | Qué pantallas construir y su contenido |
| `../docs/glosario.md` | Términos exactos para los textos de UI |
| `../docs/adr/` | Decisiones de arquitectura para contexto de implementación |
