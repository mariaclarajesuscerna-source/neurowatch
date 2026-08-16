# Índice de simetría: heurística de píxeles para v1

El chequeo facial (componente F del protocolo FAST) requiere una métrica de simetría on-device. En v1 no hay modelo de IA disponible. Decidimos usar una heurística de píxeles sobre Canvas API en vez de un valor fijo o aleatorio.

**Decisión**: Comparar mitades izquierda y derecha de la foto mediante histogramas de luminancia. Si existe foto base (baseline), comparar también el diferencial left-right actual contra el diferencial de la foto base. El resultado se normaliza a una escala 0-100 (índice de simetría).

**Considered options**:
- *Valor fijo (95)* — honesto pero inútil. El usuario no obtiene feedback real.
- *Valor aleatorio (70-98)* — simula variabilidad pero es engañoso. Si un día da 72 y al siguiente 95, el usuario podría alarmarse sin motivo.
- *Heurística de píxeles* — computa algo real. No es médicamente preciso, pero es determinista y basado en la imagen capturada. Da al usuario una experiencia completa del flujo FAST sin pretender exactitud clínica.

**Consecuencia**: La heurística será reemplazada por un modelo de IA en fase 2. El código debe encapsularse en una función `evaluateFacialSymmetry()` que acepte una imagen y retorne un número 0-100, para que el swap sea trivial.
