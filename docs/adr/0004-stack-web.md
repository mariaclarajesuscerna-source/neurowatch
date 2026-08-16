# ADR-0004 — Stack web: Next.js 15 + Tailwind CSS v4 + Motion

- **Estado:** 🟢 DECIDIDO
- **Fecha:** 2026-07-06
- **Relacionado:** [ADR-0003](0003-plataforma-web.md)

## Contexto

Decidida la plataforma web (ADR-0003), toca elegir el stack concreto. La app tiene UI rica (glassmorphism, animaciones, gráficos de pulso, cuenta regresiva con anillo SVG), necesita rutas para las pantallas del spec, y debe ser rápida de desarrollar.

## Decisión

| Necesidad | Herramienta |
|---|---|
| Framework | **Next.js 15** (App Router) |
| UI | **React 19** + **Tailwind CSS v4** |
| Tipografía | **Inter** (next/font/google) |
| Gráficos | **SVG inline** (sin librería externa) |
| Persistencia | **localStorage** (demo/mvp), IndexedDB (fase 2) |
| BLE | **Web Bluetooth API** (navegador, sin dependencia) |
| Alertas Telegram | `fetch()` directo a Bot API |
| Cámara | `getUserMedia()` (navegador, sin dependencia) |
| Animaciones | **CSS animations/transitions** + **Motion** (antes Framer Motion) |
| Despliegue | **Vercel** (gratuito, integración nativa con Next.js) |

### Por qué Next.js y no Vite/SPA

1. **App Router** da estructura de rutas limpia: `/dashboard`, `/chequeo`, `/historial`, `/contactos`, `/onboarding`. Coincide naturalmente con las pantallas del spec.
2. **Server Components** para las partes estáticas (documento HTML inicial), **Client Components** para las interactivas (dashboard en vivo, cámara, BLE).
3. **`next/font`** optimiza la carga de Inter sin layout shift.
4. **Vercel** despliega con un comando, SSL incluido, ideal para demo con el cliente.
5. El usuario quiere aprender Next.js.

### Por qué Tailwind y no CSS Modules o styled-components

1. El design system del proyecto ya define tokens (colores, espaciados, tipografía) que mapean 1:1 al `tailwind.config.ts`.
2. Configuración mínima: extender el tema de Tailwind con los tokens del `design-system.md`.
3. Glassmorphism se logra con utilidades nativas: `bg-white/55 backdrop-blur-xl border border-white/70 shadow-lg rounded-[20px]`.

## Consecuencias

- Sin dependencias nativas. Sin React Native, sin Expo, sin BLE libraries. Solo npm + navegador.
- El token de Telegram sigue embebido en el código (mismo trade-off que el prototipo mobile anterior).
- Desarrollo 100% en el navegador, iteración instantánea con hot reload.
- Desktop y mobile desde el mismo código responsive.
- iOS sin BLE documentado como limitación de fase 2.
