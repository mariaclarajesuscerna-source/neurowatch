# ADR-0001 — ¿Neurowatch es alerta temprana o prevención?

- **Estado:** 🟢 DECIDIDO
- **Fecha:** 2026-07-06
- **Decisión de:** usuario (grilling)

## Contexto

El usuario pregunta explícitamente si Neurowatch es un *sistema de alerta temprana* (detección de un evento en curso) o un *sistema de prevención* (reducción de riesgo futuro). La respuesta define TODA la arquitectura de la web: qué datos guarda, qué muestra, qué promete y a quién.

Dos problemáticas objetivo, con dinámicas clínicas opuestas:

| | Paro cardíaco | ACV / derrame |
|---|---|---|
| Dinámica | Súbito, segundos | Súbito el evento, pero con factores de riesgo acumulables |
| Señal disponible | Ritmo/variabilidad vía PPG (reloj) | Asimetría facial vía foto (FAST-F) |
| Ventana de acción | Segundos-minutos → **detección** | Minutos (evento) o meses (riesgo) |

### Realidad técnica que acota el diseño (no negociable)
1. El sensor es **PPG, no ECG**: sirve para detectar arritmias/anomalías de ritmo, NO para diagnóstico eléctrico.
2. Una **foto solo puede evaluar la "F" de FAST** (asimetría facial), que es signo de un ACV **en curso**, comparándola contra un baseline. Una foto **no predice** un ACV a días vista — no hay base clínica para eso.
3. Por lo tanto la "foto diaria para detectar propensión" se sostiene mejor como **detección de asimetría aguda vs baseline**, no como predicción.

## Opciones

- **A. Solo alerta temprana (detección):** anomalía de pulso en curso + asimetría facial vs baseline → aviso a contactos. Honesto, acotado, técnicamente defendible.
- **B. Solo prevención (riesgo/tendencias):** dashboards de tendencias, factores de riesgo, educación. Sin promesas de detección en tiempo real.
- **C. Híbrido en dos capas:** detección en tiempo real (capa reactiva) + seguimiento de tendencias/riesgo (capa proactiva), claramente separadas en la UI y en las promesas.

## Decisión

**Opción C — Híbrido en dos capas**, con encuadre de **herramienta asistiva/educativa** (no dispositivo médico).

- **Capa 1 — Detección/alerta en tiempo real (el corazón del producto):** anomalía de pulso vs baseline personal + asimetría facial (FAST-F) vs baseline → aviso a contactos de emergencia.
- **Capa 2 — Seguimiento/tendencias (el "sabor" preventivo):** historial de pulso, bitácora de fotos, tendencias. Educa y da contexto, sin prometer predicción.
- **Foto:** reencuadrada como *chequeo de asimetría facial vs baseline*, NO predicción de propensión.
- **Usuario:** paciente en riesgo + familiar/cuidador (doble rol).
- **Encuadre legal:** herramienta asistiva. Toda pantalla con disclaimer: *no reemplaza atención médica, no es diagnóstico, ante emergencia llamar a servicios de urgencia*.

## Consecuencias

- La UI debe separar visualmente "estado en vivo / alerta" de "historial / tendencias" — no mezclarlas.
- Requiere un mecanismo de **baseline/calibración** por persona (sin baseline no hay anomalía). → nuevo ADR pendiente.
- Requiere resolver **cómo llega la alerta** al contacto (la web abierta no alcanza). → ADR-0002.
- Todo copy de la web se redacta en tono asistivo con disclaimers; prohibido lenguaje de "predice/diagnostica/previene el evento".
- Habilita construir la web en pencil.dev / claude.design sobre una IA de información clara (ver spec de pantallas, pendiente).
