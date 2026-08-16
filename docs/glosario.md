# Glosario — Neurowatch

> Lenguaje ubicuo del dominio. Todo el equipo (hardware, web, docs) usa estos términos con este significado exacto.

## Arquitectura del sistema

**Neurowatch**:
Sistema compuesto: reloj (ESP32 + sensor PPG) + aplicación web (Next.js). La web recibe datos del reloj vía Web Bluetooth API, procesa on-device y envía alertas por Telegram.
_Evitar_: "plataforma con backend", "app móvil", "sistema nativo"

**Web Bluetooth**:
API del navegador que permite a la aplicación web recibir datos del reloj ESP32 por BLE sin necesidad de app nativa. Disponible en Chrome/Edge Android y escritorio. No disponible en iOS/Safari (limitación conocida documentada).
_Evitar_: "react-native-ble-plx", "app puente"

## Detección

**Baseline (línea base)**:
Estado "normal" de referencia de una persona, usado como patrón de comparación. Se compone de: FC en reposo habitual (BPM) + foto base del rostro simétrico. Se ingresa durante el onboarding. Sin baseline no hay detección de anomalías.
_Evitar_: "normal", "promedio", "umbral clínico"

**Datos del paciente**:
Metadatos identificatorios de la persona monitoreada: nombre, edad. No se usan en la detección; son informativos y para presentación en la UI.
_Evitar_: confundir con "baseline"

**Anomalía**:
Desviación significativa respecto al baseline personal detectada por el sistema. Es lo que el motor de detección on-device identifica (ej. pulso fuera de rango, asimetría facial vs foto base). Dispara la cuenta regresiva.
_Evitar_: "alarma", "alerta", "evento"

**Detección de anomalías**:
Comparación aritmética en el navegador: pulso actual vs baseline (FC reposo ± tolerancia), y asimetría facial vs foto base. En v1 es lógica simple; en fase 2 se incorporará un modelo de IA para la detección facial (usando datasets de plataformas como Roboflow, HuggingFace o Kaggle).
_Evitar_: "diagnóstico", "predicción"

## Eventos clínicos

**Evento clínico**:
Ocurrencia médica real: paro cardíaco o ACV/derrame. El sistema NO diagnostica eventos clínicos; detecta anomalías que podrían estar correlacionadas con un evento en curso.
_Evitar_: "emergencia", "siniestro", "ataque"

**PPG (fotopletismografía)**:
Técnica óptica del sensor de pulso: mide cambios de volumen sanguíneo con luz. Detecta ritmo y variabilidad, no actividad eléctrica.
_Evitar_: "ECG", "electrocardiograma"

**FAST**:
Protocolo clínico de reconocimiento de ACV agudo: **F**ace, **A**rms, **S**peech, **T**ime. La web solo evalúa la "F" (asimetría facial) mediante comparación de foto vs baseline.
_Evitar_: "test de ACV completo", "diagnóstico de derrame"

**Asimetría facial**:
Caída o desviación de un lado de la cara respecto al baseline. Signo de ACV en curso (la "F" de FAST).
_Evitar_: "predicción de ACV", "propensión a derrame"

**Índice de simetría**:
Valor numérico (0-100) que mide la similitud entre la mitad izquierda y derecha del rostro, y contra la foto base si existe. Se calcula on-device mediante heurística de píxeles (v1). >85: simétrico, 70-85: leve asimetría, <70: asimetría marcada.
_Evitar_: "puntuación de normalidad", "score clínico", "diagnóstico facial"

## Alertas

**Alerta**:
Mensaje saliente por bot de Telegram al contacto de emergencia. Se dispara solo si: (1) se detectó una anomalía, (2) la cuenta regresiva llegó a cero sin cancelación, y (3) hay al menos un contacto con Telegram vinculado.
_Evitar_: "notificación push", "aviso en pantalla"

**Cuenta regresiva**:
Ventana de 30–60s tras detectar una anomalía en la que el paciente puede cancelar antes de que se dispare la alerta a Telegram. Mecanismo anti falso-positivo. Se muestra como modal con anillo de progreso y botón "Estoy bien".
_Evitar_: "timer", "confirmación"

**Contacto de emergencia**:
Persona a notificar cuando se dispara una alerta. Se vincula por su chat_id de Telegram durante el onboarding. Sin al menos un contacto vinculado, las alertas no pueden enviarse.
_Evitar_: "familiar", "cuidador" (son roles, no el concepto técnico)

**Usuario**:
La persona monitoreada. Instala la app en su teléfono, empareja su reloj y registra a sus contactos de emergencia. Los contactos reciben alertas por Telegram pero no usan la app directamente.
_Evitar_: "cliente", "account", "familiar/cuidador" (son contactos, no usuarios)

## Estados y UI

**Estado cualitativo**:
Etiqueta legible del estado actual, derivada del promedio de pulso en la ventana reciente vs baseline. Se muestra en el HeroStatus del dashboard. No depende de barras individuales del chart.
- `Estable` (verde): pulso dentro del rango esperado.
- `Atención` (ámbar): desviación leve o intermitente. Se muestra en el dashboard como advertencia, sin disparar cuenta regresiva.
- `Alerta` (rojo): anomalía franca detectada. Dispara el modal de cuenta regresiva.
_Evitar_: "Normal", "Warning", "Crítico"

**Calibración / Onboarding**:
Flujo wizard de configuración inicial (4 pasos): datos del paciente, foto base, contactos de emergencia, emparejamiento BLE. Sin completarlo, el sistema no puede detectar anomalías ni alertar.

**Pulso real**:
Lectura actual del sensor PPG en BPM. Es el valor que se muestra en grande en el dashboard y se grafica en el chart de barras en vivo.
_Evitar_: "ritmo cardíaco actual", "heart rate"

**Rango esperado**:
Banda alrededor del baseline que define dónde se espera que esté el pulso sin considerarse anomalía. Se calcula como FC en reposo ± tolerancia. Se muestra como banda sombreada en los gráficos.
_Evitar_: "zona segura", "umbral normal"

**Tolerancia**:
Margen en BPM alrededor de la FC en reposo que define el rango esperado. Valor default: ±15 BPM. Configurable en Ajustes.
_Evitar_: "margen de error", "desviación aceptable"

**Desconectado**:
Estado en que el reloj no transmite datos por BLE. Se detecta por ausencia de señal sostenida y se muestra en la UI con indicador visual y guía de reconexión. La desconexión prolongada es en sí misma una condición a comunicar.
_Evitar_: "offline", "sin conexión"

## Limitaciones conocidas (v1)

- **Web Bluetooth solo en Chrome/Edge**: iOS/Safari no soporta Web Bluetooth API. Para usuarios iOS se requerirá un bridge nativo (fase 2).
- **Falsos positivos nocturnos**: la FC baja naturalmente durante el sueño. El baseline no distingue estado despierto/dormido en v1.
- **Token de Telegram embebido**: aceptado para demo/entrega puntual. Antes de distribución amplia, migrar a función serverless.
- **Sin modelo de IA facial (v1)**: la comparación facial en v1 es básica. La integración de un modelo de IA se planifica para fase 2.
