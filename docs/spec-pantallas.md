# Spec de pantallas — Neurowatch (v1 prototipo)

> ⚠️ **SALIDA ESPERADA: WIREFRAME / MOCKUP visual y luego implementación web.** Este documento define qué pantallas construir y su contenido.
>
> Documento agnóstico de plataforma. Arquitectura de información para wireframes y desarrollo.
> Deriva de [ADR-0001](adr/0001-alerta-temprana-vs-prevencion.md), [ADR-0002](adr/0002-arquitectura-ingesta-y-alerta.md) y [ADR-0003](adr/0003-plataforma-web.md). Términos según [glosario](glosario.md).

## Principio rector de la UI

Separar **tres planos** que el wireframe original mezclaba:
1. **AHORA** (estado en vivo + alerta) — lo urgente.
2. **RUTINA** (chequeo facial diario) — la tarea recurrente.
3. **HISTORIA** (tendencias, bitácora) — el contexto / sabor preventivo.

Cada pantalla lleva, al pie, el **disclaimer**: *"Neurowatch es una herramienta asistiva. No reemplaza atención médica ni constituye diagnóstico. Ante una emergencia, llame a servicios de urgencia."*

## Navegación

- **Tab bar inferior fija** con 5 secciones: `Inicio` (dashboard) · `Chequeo` (foto facial) · `Historial` · `Contactos` · `Ajustes`. En desktop la navegación puede mostrarse como sidebar.
- El **logo de Neurowatch** va en el header de cada pantalla.
- Los accesos rápidos tipo tile dentro del dashboard se eliminan — la navegación vive en la tab bar.
- La **alerta de anomalía NO es una pantalla de la navegación principal**: es un **modal/bottom-sheet** que se superpone sobre cualquier pantalla (ver pantalla 3).

## Vocabulario de estado cualitativo (confirmado)
`Estable` (verde) · `Atención` (ámbar) · `Alerta` (rojo). Deriva de la desviación del pulso vs baseline. Es lo que ve primero el familiar. El wireframe (.pen) usaba "Medianamente estable" — actualizar a "Atención".

---

## Pantallas

### 1. Onboarding / Calibración  *(crítica — sin esto nada funciona)*
Propósito: crear el baseline y habilitar las alertas. Es un **flujo de varios pasos (wizard)**, previo al dashboard principal — no vive en la navegación fija.
- **Paso 1 — Datos del paciente**: nombre, edad, FC en reposo habitual.
- **Paso 2 — Foto base**: captura del rostro simétrico de referencia (baseline facial). Reutiliza el flujo de captura del Chequeo facial (pantalla 6).
- **Paso 3 — Contactos de emergencia**: alta + vínculo de Telegram de al menos uno. Reutiliza el formulario de Contactos (pantalla 8).
- **Paso 4 — Emparejamiento del reloj** (BLE) y prueba de conexión.
- **Pantalla final**: "Listo para monitorear" — checklist (baseline ✓ / contacto vinculado ✓ / reloj emparejado ✓) y botón para entrar al dashboard. Solo se llega acá si se completaron los 4 pasos.

> **Decisión de diseño:** el paso 3 requiere al menos un contacto vinculado para habilitar el botón "Continuar". Sin contacto no hay alerta, y sin alerta el producto no cumple su propósito. No se incluye skip "Ahora no".

### 2. Dashboard EN VIVO  *(pantalla principal — reemplaza al wireframe actual)*
Plano AHORA. Lo mínimo, jerarquizado:
- **Estado cualitativo grande** (`Estable`/`Atención`/`Alerta`) — el elemento dominante. Derivado del promedio del pulso reciente vs baseline; no de barras individuales del chart.
  - `Estable`: verde, mensaje tranquilizador.
  - `Atención`: ámbar, advertencia sin cuenta regresiva. Aparece cuando el pulso muestra desviación sostenida.
  - `Alerta`: rojo, dispara el modal de cuenta regresiva.
- Pulso en vivo (BPM actual + gráfico corto). Dos referencias: **pulso real** (barras) vs **rango esperado** (banda baseline ± tolerancia).
- Estado del **dispositivo**: `Conectado`/`Desconectado` + batería.
- La navegación a chequeo/historial/contactos/ajustes vive en la **tab bar inferior** (no tiles en el cuerpo).

### 3. ANOMALÍA / Cuenta regresiva  *(modal, no pantalla)*
Se presenta como **modal/bottom-sheet de emergencia** superpuesto sobre la pantalla activa (con fondo oscurecido detrás). Puede dispararse desde cualquier sección.
- Mensaje claro: "Detectamos un pulso anómalo".
- **Cuenta regresiva 30–60s** bien visible (anillo de progreso).
- Botón grande **"Estoy bien / Cancelar"** — dominante; no se puede cerrar tocando afuera ni por accidente.
- Si no se cancela → transición a "Alerta enviada" (pantalla completa).

### 4. Alerta ENVIADA
- Confirmación de que se avisó a los contactos por Telegram (a quién, cuándo).
- Instrucciones de emergencia + botón de llamada a urgencias.

### 5. Estado DESCONECTADO
- Aviso claro cuando el reloj se cae del BLE por tiempo prolongado.
- Guía: revisar reloj / batería / cercanía del teléfono.

### 6. Chequeo facial diario  *(reemplaza al panel de cámara permanente)*
Plano RUTINA. Flujo enfocado, no panel fijo:
- Captura guiada (encuadre del rostro).
- Comparación contra baseline → resultado: **Simétrico** / **Posible asimetría — consultá**.
- Se guarda en la bitácora. Recordatorio diario.
- **Fase 2:** la comparación facial actual (básica) se reemplazará por un modelo de IA entrenado con datasets de plataformas como Roboflow, HuggingFace o Kaggle para mejorar la precisión de detección de asimetría.

### 7. Historial / Tendencias
Plano HISTORIA (el "sabor" preventivo):
- Tendencia de pulso (día/semana/mes).
- **Bitácora de fotos** (timeline/galería con fecha + marca de simetría) para observar el cambio del rostro a lo largo del tiempo.
- Registro de eventos/alertas pasadas.

> Nota futura (no wireframe): el gráfico de pulso en vivo del dashboard se mantendrá y se animará en la implementación.

### 8. Contactos
- Gestión de contactos de emergencia + su vínculo Telegram.
- Lista de contactos con estado de vinculación.

### 9. Ajustes
- Tolerancia (±BPM alrededor del baseline, default 15).
- Duración de la cuenta regresiva (30-60s).
- Re-emparejar dispositivo BLE.
- Re-tomar foto base.

---

## Fuera de alcance en v1 (documentado, no construido)
- Auto-aprendizaje del baseline (fase 2).
- Canales SMS / llamada automática (fase 2).
- Multi-paciente para personal de salud.
- Cualquier predicción de eventos a futuro (excluido por diseño — ADR-0001).
