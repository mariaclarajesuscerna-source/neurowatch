# Design System — Neurowatch

> Documento agnóstico de plataforma. Tokens de diseño para implementar en código (HTML/CSS/Tailwind).
> Estilo: **glassmorphism claro**. Tema base: **claro**. Deriva de [spec-pantallas](../docs/spec-pantallas.md).

## 1. Concepto visual

Interfaz de **vidrio esmerilado sobre fondo claro con gradiente suave**. Sensación limpia, médica-confiable pero moderna. Las tarjetas "flotan" (blur + translucidez + borde sutil + sombra difusa). El dato de salud siempre legible; el cristal decora, nunca compite con la información.

Regla de oro: **el color de marca (índigo) es decorativo/navegación; los colores semánticos (verde/ámbar/rojo) son SOLO para estado de salud.** Nunca usar rojo de marca — el rojo siempre significa Alerta.

## 2. Paleta de color (tokens)

### Marca — "neural"
| Token | Hex | Uso |
|-------|-----|-----|
| `--brand-600` | `#4F46E5` | Acción primaria, links, línea de pulso real |
| `--brand-500` | `#6366F1` | Hover, acentos |
| `--brand-300` | `#A5B4FC` | Banda de baseline esperado (gráfico) |
| `--brand-100` | `#E0E7FF` | Fondos suaves, chips |

### Fondo (gradiente de página)
| Token | Hex | Uso |
|-------|-----|-----|
| `--bg-from` | `#EEF2FF` | Inicio del gradiente (lavanda) |
| `--bg-to` | `#ECFEFF` | Fin del gradiente (cian muy claro) |
| Gradiente | `linear-gradient(135deg, #EEF2FF 0%, #ECFEFF 100%)` | `body` |

### Semánticos — estado de salud (NO tocar para decoración)
| Estado | Token | Hex | Uso |
|--------|-------|-----|-----|
| Estable | `--ok` | `#10B981` | Estado normal |
| Atención | `--warn` | `#F59E0B` | Desviación leve vs baseline |
| Alerta | `--alert` | `#EF4444` | Anomalía / cuenta regresiva / emergencia |
| Desconectado | `--muted` | `#94A3B8` | Sin señal del reloj |

### Neutros / texto
| Token | Hex | Uso |
|-------|-----|-----|
| `--ink-900` | `#0F172A` | Texto principal |
| `--ink-600` | `#475569` | Texto secundario |
| `--ink-400` | `#94A3B8` | Texto terciario / placeholders |
| `--line` | `rgba(15,23,42,0.08)` | Bordes sutiles |

## 3. El material "glass"

Tarjeta de vidrio (aplicar a los frames-tarjeta):
- **Relleno:** blanco al 55% de opacidad (hex `#FFFFFF8C`).
- **Desenfoque de fondo (backdrop blur):** blur(20px).
- **Borde:** blanco al ~70% de opacidad (hex `#FFFFFFB3`), grosor 1px.
- **Sombra:** suave, hacia abajo (offset-y: 8px, blur: 32px, color: `#1F29370A`).
- **Radio de esquina:** 20px.

Variante alerta (misma tarjeta, tinte rojo): relleno rojo al 10% (`#EF44441A`), borde rojo al 35% (`#EF444459`).

Notas: el texto siempre debe tener contraste suficiente contra el fondo translúcido. No apilar más de 2 capas de desenfoque (legibilidad).

### Glass en Tailwind CSS
```html
<!-- Tarjeta glass estándar -->
<div class="bg-white/55 backdrop-blur-xl border border-white/70 rounded-[20px] shadow-lg p-6">
<!-- Tarjeta glass alerta -->
<div class="bg-red-500/10 backdrop-blur-xl border border-red-500/35 rounded-[20px] shadow-lg p-6">
```

## 4. Tipografía

- Familia: **Inter** (o system-ui como fallback). Sans, neutra, alta legibilidad — apta para adultos mayores.
- Escala:
  | Rol | Tamaño / peso |
  |-----|---------------|
  | Dato hero (BPM, cuenta regresiva) | 56–72px / 700 |
  | Título de pantalla | 24px / 600 |
  | Etiqueta de estado | 20px / 600 |
  | Cuerpo | 16px / 400 |
  | Secundario / disclaimer | 13px / 400, `--ink-600` |
- Números de métricas: usar `font-variant-numeric: tabular-nums` para que no "salten".

## 5. Forma y espaciado

- Radio: tarjetas `20px`, botones `12px`, chips `full`.
- Espaciado base: escala de 4 → `4, 8, 12, 16, 24, 32, 48`.
- Toque mínimo: `44px` (accesibilidad, adultos mayores).

## 6. Componentes clave (estilo)

- **Botón primario**: relleno `--brand-600`, texto blanco, radio 12, sombra suave.
- **Botón de seguridad ("Estoy bien / Cancelar")**: grande, alto contraste, en pantalla de alerta domina visualmente.
- **Chip de estado**: pastilla con punto de color semántico + texto (`● Estable`).
- **Indicador de conexión**: punto `--ok` (Conectado) / `--muted` (Desconectado) + texto.
- **Gráfico de pulso**: línea `--brand-600` (real) sobre banda `--brand-300` translúcida (rango baseline esperado). Fuera de banda = se tiñe hacia `--warn`/`--alert`.

## 7. Tono y accesibilidad

- Copy claro, sin jerga médica. Frases cortas.
- Todo texto cumple contraste AA sobre el vidrio.
- Cada pantalla incluye el disclaimer asistivo (ver spec-pantallas).
- Estado nunca comunicado solo por color: siempre color + texto/ícono (daltonismo).
