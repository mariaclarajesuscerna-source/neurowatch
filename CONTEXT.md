# Neurowatch

Sistema de detección de anomalías de salud en tiempo real. Un reloj con sensor PPG envía datos de pulso por BLE a una aplicación web, que detecta desviaciones respecto a un baseline personal y alerta a contactos de emergencia por Telegram.

## Language

### Arquitectura del sistema

**Neurowatch**:
Sistema compuesto por un reloj ESP32 con sensor PPG y una aplicación web Next.js. La web recibe datos del reloj vía Web Bluetooth API, procesa on-device y envía alertas por Telegram.
_Avoid_: "plataforma con backend", "app móvil", "sistema nativo"

**Web Bluetooth**:
API del navegador que permite a la aplicación web recibir datos del reloj por BLE sin app nativa. Disponible en Chrome/Edge Android y escritorio.
_Avoid_: "react-native-ble-plx", "app puente"

### Detección

**Baseline**:
Estado de referencia personal usado como patrón de comparación. Se compone de FC en reposo habitual (BPM) y foto base del rostro simétrico. Se ingresa durante el onboarding.
_Avoid_: "normal", "promedio", "umbral clínico"

**Datos del paciente**:
Metadatos identificatorios: nombre, edad. Informativos, no se usan en la detección.
_Avoid_: confundir con "baseline"

**Anomalía**:
Desviación significativa respecto al baseline detectada on-device. Dispara la cuenta regresiva.
_Avoid_: "alarma", "alerta", "evento"

**Detección de anomalías**:
Comparación aritmética en el navegador: pulso actual vs baseline, y asimetría facial vs foto base. En v1 es lógica simple.
_Avoid_: "diagnóstico", "predicción"

**Tolerancia**:
Margen en BPM alrededor de la FC en reposo que define el rango esperado. Default: ±15 BPM. Configurable en Ajustes.
_Avoid_: "margen de error", "desviación aceptable"

### Estados cualitativos

**Estable** (verde):
Pulso dentro del rango esperado. El HeroStatus muestra mensaje tranquilizador.

**Atención** (ámbar):
Desviación leve o intermitente del baseline. Se muestra en el dashboard como advertencia. No dispara cuenta regresiva.

**Alerta** (rojo):
Anomalía franca detectada. Dispara el modal de cuenta regresiva con anillo de progreso.

### Eventos clínicos

**Evento clínico**:
Ocurrencia médica real: paro cardíaco o ACV. El sistema NO diagnostica eventos clínicos; detecta anomalías que podrían estar correlacionadas.
_Avoid_: "emergencia", "siniestro", "ataque"

**PPG (fotopletismografía)**:
Técnica óptica del sensor de pulso. Mide cambios de volumen sanguíneo con luz.
_Avoid_: "ECG", "electrocardiograma"

**FAST**:
Protocolo clínico de reconocimiento de ACV: Face, Arms, Speech, Time. La web solo evalúa la "F" (asimetría facial).
_Avoid_: "test de ACV completo", "diagnóstico de derrame"

**Asimetría facial**:
Caída o desviación de un lado de la cara respecto al baseline. Signo de ACV en curso (la "F" de FAST).
_Avoid_: "predicción de ACV", "propensión a derrame"

**Índice de simetría**:
Valor numérico (0-100) que mide la similitud entre la mitad izquierda y derecha del rostro, y contra la foto base si existe. Se calcula on-device mediante heurística de píxeles (v1). >85: simétrico, 70-85: leve asimetría, <70: asimetría marcada.
_Avoid_: "puntuación de normalidad", "score clínico", "diagnóstico facial"

### Métricas

**Pulso real**:
Lectura actual del sensor PPG en BPM. Se muestra en el dashboard y se grafica en el chart de barras.
_Avoid_: "ritmo cardíaco actual", "heart rate"

**Rango esperado**:
Banda alrededor del baseline: FC en reposo ± tolerancia. Define dónde se espera el pulso sin ser anomalía.
_Avoid_: "zona segura", "umbral normal"

### Alertas

**Alerta**:
Mensaje saliente por bot de Telegram al contacto de emergencia. Se dispara si: (1) se detectó anomalía, (2) la cuenta regresiva llegó a cero, y (3) hay al menos un contacto vinculado.
_Avoid_: "notificación push", "aviso en pantalla"

**Cuenta regresiva**:
Ventana de 30-60s tras detectar una anomalía. El usuario puede cancelar antes de que se dispare la alerta. Mecanismo anti falso-positivo.
_Avoid_: "timer", "confirmación"

**Contacto de emergencia**:
Persona a notificar cuando se dispara una alerta. Se vincula por chat_id de Telegram durante el onboarding. Sin al menos uno, las alertas no se envían.
_Avoid_: "familiar", "cuidador"

### Usuario y dispositivo

**Usuario**:
La persona monitoreada. Instala la app, empareja su reloj y registra contactos. Los contactos solo reciben alertas por Telegram.
_Avoid_: "cliente", "account", "cuidador"

**Desconectado**:
Estado en que el reloj no transmite datos por BLE. Se detecta por ausencia de señal sostenida. La desconexión prolongada es en sí misma una condición a comunicar.
_Avoid_: "offline", "sin conexión"

### Flujo inicial

**Onboarding**:
Wizard de 4 pasos para configurar el sistema: datos del paciente, foto base, contactos de emergencia, emparejamiento BLE. Sin completarlo no hay detección ni alertas. Requiere al menos un contacto vinculado para finalizar.
_Avoid_: "setup", "configuración inicial"
