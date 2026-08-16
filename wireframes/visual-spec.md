# Visual Spec — Neurowatch

## Design Tokens

```
$brand-600 = #4F46E5      $brand-500 = #6366F1      $brand-300 = #A5B4FC
$brand-100 = #E0E7FF      $bg-from   = #EEF2FF      $bg-to     = #ECFEFF
$ok        = #10B981      $warn      = #F59E0B      $alert     = #EF4444
$muted     = #94A3B8      $ink-900   = #0F172A      $ink-600   = #475569
$ink-400   = #94A3B8      $glass-fill= #FFFFFF8C    $glass-border = #FFFFFFB3
$alert-fill= #EF44441A    $alert-border = #EF444459 $ok-fill   = #10B9811A
$font-body = Inter
```

---

## Shared Components

### Logo (reusable ref: J8RcD)
- 34×34, bg: $brand-600, r:11
- shadow: (0,4,12,#4F46E540)
- Icon: activity (lucide), 20×20, fill: #FFFFFF
- vert layout, centered

### Tab Bar (reusable ref: v4PMkp)
- 390×84, bg: $glass-fill
- stroke: $glass-border, top:1 only
- effect: background_blur(20)
- effect: shadow (0,-4,24,#1F293714)
- pad: [12,24,26,24], justifyContent: space_between

#### Tab: Inicio
- width: fill, vertical, gap:5, items:center
- Icon: house (lucide) 24×24 $brand-600
- Label "Inicio" 11/600 $brand-600

#### Tab: Chequeo
- width: fill, vertical, gap:5, items:center
- Icon: scan-face (lucide) 24×24 $ink-400
- Label "Chequeo" 11/500 $ink-400

#### Tab: Historial
- width: fill, vertical, gap:5, items:center
- Icon: trending-up (lucide) 24×24 $ink-400
- Label "Historial" 11/500 $ink-400

#### Tab: Contactos
- width: fill, vertical, gap:5, items:center
- Icon: users (lucide) 24×24 $ink-400
- Label "Contactos" 11/500 $ink-400

---

## Screen 2 · Dashboard EN VIVO (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- layout: vertical, gap:14, pad:[14,20,100,20]

### StatusBar (fill_container)
- pad:[0,4], space_between, items:center
- Time "9:41" 15/600 $ink-900
- Sys: row gap:6 items:center
  - signal (lucide) 16×16 $ink-900
  - wifi (lucide) 16×16 $ink-900
  - battery-full (lucide) 16×16 $ink-900

### Header (fill_container)
- space_between, items:center

#### Brand Group
- row gap:10 items:center
- Logo (ref: J8RcD) 34×34 $brand-600 r:11 shadow:(0,4,12,#4F46E540)
- Title: vertical gap:2
  - "Neurowatch" 22/700 $ink-900
  - "Monitoreo en vivo" 13/400(normal) $ink-600

#### Conn Chip
- bg: $ok-fill, r:999, stroke: $glass-border 1px
- row gap:6 pad:[7,12] items:center
- Dot: ellipse 8×8 $ok
- "Conectado" 13/600 $ink-900

### Hero Status (fill_container)
- bg: $ok-fill, r:20, stroke: #10B98159 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:10 pad:24

#### row (fill_container)
- row gap:12 items:center
- big dot: ellipse 18×18 $ok
- "Estable" 40/700 $ink-900

#### desc (fill_container)
- "Todo en orden. El pulso de Rosa se mantiene dentro de su rango habitual."
- 15/400(normal) $ink-600, lineHeight:1.4, fixed-width

### Pulse Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:14 pad:20

#### prow (fill_container)
- space_between items:center
- pl: row gap:8 items:center
  - heart-pulse (lucide) 18×18 $brand-600
  - "Pulso en vivo" 15/600 $ink-900
- bpm: row gap:4 items:end
  - "72" 34/700 $ink-900
  - u: pad:[0,0,6,0]
    - "BPM" 13/600 $ink-600

#### Chart (fill_container×76)
- bg: #A5B4FC26, r:14, gap:3, pad:[8,10]
- space_between items:center
- 24 bars (all fill_container wide, r:999):
  - bar0: $brand-600 h:22
  - bar1: $brand-600 h:30
  - bar2: $brand-600 h:26
  - bar3: $brand-600 h:40
  - bar4: $brand-600 h:34
  - bar5: $brand-600 h:52
  - bar6: $brand-600 h:30
  - bar7: $brand-600 h:24
  - bar8: $warn h:58
  - bar9: $brand-600 h:36
  - bar10: $brand-600 h:28
  - bar11: $brand-600 h:44
  - bar12: $brand-600 h:50
  - bar13: $brand-600 h:32
  - bar14: $brand-600 h:26
  - bar15: $brand-600 h:38
  - bar16: $brand-600 h:30
  - bar17: $brand-600 h:46
  - bar18: $warn h:54
  - bar19: $brand-600 h:34
  - bar20: $brand-600 h:24
  - bar21: $brand-600 h:40
  - bar22: $brand-600 h:30
  - bar23: $brand-600 h:28

#### legend (fill_container)
- row gap:16 items:center
- lg: row gap:6 items:center
  - sw: rect 14×6 $brand-600 r:999
  - "Pulso real" 12/400(normal) $ink-600
- lg: row gap:6 items:center
  - sw: rect 14×6 $brand-300 r:999
  - "Rango esperado" 12/400(normal) $ink-600

### Device Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- row pad:16 space_between items:center

#### dl (left)
- row gap:10 items:center
- watch (lucide) 20×20 $ink-600
- dlt: vertical gap:1
  - "Reloj conectado" 14/600 $ink-900
  - "Señal estable" 12/400(normal) $ink-600

#### bat (right)
- row gap:6 items:center
- battery-medium (lucide) 20×20 $ok
- "68%" 14/600 $ink-900

### Spacer (fill_container×fill_container)
### Tab Bar (ref: v4PMkp) absolute x:0 y:760 w:390

---

## Screen 3 · Anomalía / Cuenta regresiva (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- layout: none

### Dashboard (background) (390×844 absolute 0,0)
- clip: true, bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:14 pad:[14,20,100,20]
- Contains same: StatusBar, Header (Neurowatch + Conn Chip), Hero Status (Estable), Pulse Card (72 BPM, 24 bars chart with legend), Device Card (Reloj conectado 68%), Spacer, Tab Bar

### Scrim (390×844 absolute 0,0)
- rect: fill #0F172A99

### Sheet Anchor (390×844 absolute 0,0)
- vertical, justifyContent: end, items: center

#### Emergency Sheet (390)
- bg: #FFFFFFF2, r: [26,26,0,0]
- stroke: $glass-border 1px
- effect: shadow (0,-8,32,#0F172A26)
- vertical gap:16 pad:[12,24,28,24] items:center

##### Drag Handle
- rect 40×5 r:2.5 fill #94A3B859

##### Alert Badge
- bg: $alert-fill, r:999, stroke: $alert-border 1px
- row gap:8 pad:[6,12] items:center
- Dot: ellipse 8×8 $alert
- "Alerta" 13/700 $alert

##### Heading
- "Detectamos un pulso anomalo" 24/700 $ink-900, textAlign: center, fixed-width

##### Subtext
- "Confirma que estas bien antes de que avisemos a tus contactos." 15/400(normal) $ink-600, textAlign: center, fixed-width

##### Ring Wrap (fill_container)
- row justifyContent:center items:center

###### Countdown Ring (224×224)
- layout: none
- Ring Track: ellipse 200×200 innerRadius:0.86 fill:#EF444426 absolute x:12 y:12
- Progress Arc: ellipse 200×200 innerRadius:0.86 startAngle:90 sweepAngle:-235 fill:$alert absolute x:12 y:12
- Ring Overlay (224×224 absolute 0,0): vertical center items:center
  - "47" 76/700 $alert lineHeight:1
  - "segundos" 15/600 $ink-600

##### Note Row (fill_container)
- bg: $alert-fill, r:14, stroke: $alert-border 1px
- row gap:10 pad:14 items:center
- send (lucide) 18×18 $alert
- "Si no cancelas, avisaremos a Maria Lopez y Dr. Ramirez por Telegram." 13/500 $ink-900 fixed-width

##### Primary Button (fill_container×64)
- bg: $brand-600, r:16
- effect: shadow (0,8,20,#4F46E540)
- row gap:10 center items:center
- check (lucide) 24×24 #FFFFFF
- "Estoy bien · Cancelar" 19/700 #FFFFFF

##### Caption
- "Esta alerta no se puede cerrar tocando fuera de la ventana." 12/400(normal) $ink-400, textAlign: center, fixed-width

---

## Screen 4 · Alerta ENVIADA (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:16 pad:[16,20,100,20] space_between items:center

### Content (fill_container)
- vertical gap:14

#### StatusBar (fill_container)
- pad:[0,4], space_between items:center
- Time "9:41" 15/600 $ink-900
- Sys: row gap:6
  - signal 16×16, wifi 16×16, battery-full 16×16 $ink-900

#### Header (fill_container)
- row gap:10 items:center
- Logo (ref: J8RcD)
- Title: vertical gap:2
  - "Neurowatch" 22/700 $ink-900
  - "Emergencia" 13/400(normal) $ink-600

#### Success Card (fill_container)
- bg: $ok-fill, r:22, stroke: $ok 1px
- effect: shadow (0,8,24,#0F172A1A)
- vertical gap:10 pad:20 items:center

##### Check Badge (56×56)
- bg: $ok, r:28, center items:center
- check (lucide) 30×30 #FFFFFF

##### Heading
- "Alerta enviada" 22/700 $ink-900

##### Subheading
- "Tus contactos de emergencia fueron notificados." 13/400(normal) $ink-600, textAlign: center, fixed-width

#### Contacts Card (fill_container)
- bg: $glass-fill, r:22, stroke: $glass-border 1px
- effect: shadow (0,8,24,#0F172A1A)
- vertical gap:12 pad:16

##### Section Title
- "CONTACTOS NOTIFICADOS" 13/600 $ink-600 letterSpacing:0.5

##### Contact Maria Lopez (fill_container)
- row gap:12 items:center
- Avatar: 40×40 bg:#6366F1 r:20 center items:center
  - "M" 16/700 #FFFFFF
- Info: vertical gap:2 fill_container
  - "Maria Lopez" 15/600 $ink-900
  - Telegram Row: row gap:5 items:center
    - send (lucide) 13×13 $brand-500
    - "Hija · Telegram" 12/400(normal) $ink-600
- Meta: vertical gap:4 items:end
  - Sent Chip: bg:$ok-fill r:10 gap:4 pad:[3,8] items:center
    - Dot: ellipse 7×7 $ok
    - "Enviado" 11/600 $ok
  - "hace 12s" 11/400(normal) $ink-400

##### Contact Dr. Ramirez (fill_container)
- row gap:12 items:center
- Avatar: 40×40 bg:#10B981 r:20 center items:center
  - "R" 16/700 #FFFFFF
- Info: vertical gap:2 fill_container
  - "Dr. Ramirez" 15/600 $ink-900
  - Telegram Row: row gap:5 items:center
    - send (lucide) 13×13 $brand-500
    - "Medico · Telegram" 12/400(normal) $ink-600
- Meta: vertical gap:4 items:end
  - Sent Chip: bg:$ok-fill r:10 gap:4 pad:[3,8] items:center
    - Dot: ellipse 7×7 $ok
    - "Enviado" 11/600 $ok
  - "hace 10s" 11/400(normal) $ink-400

#### Instructions Card (fill_container)
- bg: $glass-fill, r:22, stroke: $glass-border 1px
- effect: shadow (0,8,24,#0F172A1A)
- vertical gap:12 pad:16

##### Instr Header (fill_container)
- row gap:8 items:center
- heart-pulse (lucide) 18×18 $brand-600
- "Mientras tanto, mantén la calma" 15/600 $ink-900

##### Step 1 (fill_container)
- row gap:10
- Num: 22×22 bg:$brand-100 r:11 center items:center
  - "1" 12/700 $brand-600
- "Acompaña a la persona y háblale con calma." 13/400(normal) $ink-600 lineHeight:1.35 fixed-width

##### Step 2 (fill_container)
- row gap:10
- Num: 22×22 bg:$brand-100 r:11 center items:center
  - "2" 12/700 $brand-600
- "No la muevas bruscamente; afloja ropa ajustada." 13/400(normal) $ink-600 lineHeight:1.35 fixed-width

##### Step 3 (fill_container)
- row gap:10
- Num: 22×22 bg:$brand-100 r:11 center items:center
  - "3" 12/700 $brand-600
- "Mantén el teléfono cerca para recibir llamadas." 13/400(normal) $ink-600 lineHeight:1.35 fixed-width

#### Call Button (fill_container)
- bg: $alert, r:18
- effect: shadow (0,6,18,#EF444459)
- row gap:10 pad:18 center items:center
- phone (lucide) 22×22 #FFFFFF
- "Llamar a urgencias" 18/700 #FFFFFF

### Tab Bar (ref: v4PMkp) absolute x:0 y:760 w:390

---

## Screen 5 · Desconectado (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:16 pad:[16,20,100,20] space_between items:center

### Content (fill_container)
- vertical gap:14

#### StatusBar (fill_container)
- pad:[0,4], space_between items:center
- Time "9:41" 15/600 $ink-900
- Sys: row gap:6 signal 16×16, wifi 16×16, battery-full 16×16 $ink-900

#### Header (fill_container)
- row gap:10 items:center
- Logo (ref: J8RcD)
- Title: vertical gap:2
  - "Neurowatch" 22/700 $ink-900
  - "Estado del dispositivo" 13/400(normal) $ink-600

#### Offline Card (fill_container)
- bg: $glass-fill, r:22, stroke: $glass-border 1px
- effect: shadow (0,8,24,#0F172A1A)
- vertical gap:12 pad:24 items:center

##### Watch Badge (72×72)
- bg: #94A3B826, r:36, stroke: $muted 1px, center items:center
- watch (lucide) 34×34 $muted

##### Heading
- "Reloj desconectado" 22/700 $ink-900

##### Status Chip
- bg: #94A3B826, r:12, row gap:6 pad:[5,12] items:center
- Dot: ellipse 8×8 $muted
- "Desconectado" 13/600 $ink-600

##### Last Signal
- row gap:6 items:center
- timer (lucide) 14×14 $ink-400
- "Última señal hace 4 min 32 s" 13/400(normal) $ink-600

#### Troubleshoot Card (fill_container)
- bg: $glass-fill, r:22, stroke: $glass-border 1px
- effect: shadow (0,8,24,#0F172A1A)
- vertical gap:14 pad:16

##### Guide Header (fill_container)
- row gap:8 items:center
- wrench (lucide) 18×18 $brand-600
- "Cómo reconectar" 15/600 $ink-900

##### Step 1 (fill_container)
- row gap:12 items:center
- Icon Box: 36×36 bg:$brand-100 r:12 center items:center
  - power (lucide) 18×18 $brand-600
- "Revisa que el reloj esté encendido." 14/400(normal) $ink-600 lineHeight:1.35 fixed-width

##### Step 2 (fill_container)
- row gap:12 items:center
- Icon Box: 36×36 bg:$brand-100 r:12 center items:center
  - battery-low (lucide) 18×18 $brand-600
- "Revisa la batería del reloj." 14/400(normal) $ink-600 lineHeight:1.35 fixed-width

##### Step 3 (fill_container)
- row gap:12 items:center
- Icon Box: 36×36 bg:$brand-100 r:12 center items:center
  - smartphone (lucide) 18×18 $brand-600
- "Acerca el teléfono al reloj." 14/400(normal) $ink-600 lineHeight:1.35 fixed-width

#### Retry Button (fill_container)
- bg: #FFFFFFCC, r:18, stroke: $brand-500 1.5px
- row gap:10 pad:16 center items:center
- refresh-cw (lucide) 20×20 $brand-600
- "Reintentar conexión" 16/600 $brand-600

### Tab Bar (ref: v4PMkp) absolute x:0 y:760 w:390

---

## Screen 6 · Chequeo facial (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:16 pad:[14,20,100,20]

#### StatusBar (fill_container)
- pad:[0,4], space_between items:center
- Time "9:41" 15/600 $ink-900
- Sys: row gap:6 signal 16×16, wifi 16×16, battery-full 16×16 $ink-900

#### Header (fill_container)
- row gap:10 items:center
- Logo (ref: J8RcD)
- Title: vertical gap:2
  - "Neurowatch" 22/700 $ink-900
  - "Chequeo facial de hoy" 13/400(normal) $ink-600

#### Capture Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:14 pad:18 items:center

##### Viewport (fill_container×314)
- clip: true, bg:#1E293B, r:16
- center items:center
- Face Guide: ellipse 170×220 absolute x:72 y:47 fill:#00000000 stroke:$brand-600 3px
- Caption Pill: bg:#0F172A99 r:999 pad:[7,14] items:center absolute x:57 y:266
  - "Alinea tu rostro dentro del marco" 13/500 #E2E8F0

##### Capture Btn (fill_container)
- bg: $brand-600, r:12
- effect: shadow (0,4,12,#4F46E540)
- row gap:8 pad:14 center items:center
- camera (lucide) 20×20 #FFFFFF
- "Tomar foto" 16/600 #FFFFFF

#### Result Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:12 pad:18

##### rhead (fill_container)
- space_between items:center
- "Resultado de hoy" 15/700 $ink-900
- "6 jul · 9:12" 12/400(normal) $ink-400

##### Good (fill_container)
- bg: $ok-fill, r:14, stroke: #10B98159 1px
- row gap:10 pad:[12,14] items:center
- circle-check (lucide) 20×20 $ok
- txt: vertical gap:1 fill_container
  - "Simétrico" 14/600 $ink-900
- "Resultado actual" 11/600 $ok

##### Warn (fill_container)
- bg: #F59E0B1A, r:14, stroke: #F59E0B59 1px
- row gap:10 pad:[12,14] items:center
- triangle-alert (lucide) 20×20 $warn
- txt: vertical gap:1 fill_container
  - "Posible asimetría" 14/600 $ink-900
- "Alternativa" 11/500 $ink-400

##### save (fill_container)
- row gap:6 pad:[2,2,0,2] items:center
- book-marked (lucide) 14×14 $ink-400
- "Se guarda en tu bitácora" 12/400(normal) $ink-600

#### Spacer (fill_container×fill_container)

#### Disclaimer (fill_container)
- row gap:8 pad:[0,4]
- info (lucide) 14×14 $ink-400
- "Neurowatch es una herramienta asistiva. No reemplaza atención médica ni constituye diagnóstico. Ante una emergencia, llame a servicios de urgencia." 11/400(normal) $ink-600 lineHeight:1.4 fixed-width

#### Tab Bar (ref: v4PMkp) absolute x:0 y:760 w:390
- Overrides: Inicio icon+label $ink-400/500, Chequeo icon+label $brand-600/600

---

## Screen 7 · Historial (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:16 pad:[14,20,100,20]

#### StatusBar (fill_container)
- pad:[0,4], space_between items:center
- Time "9:41" 15/600 $ink-900
- Sys: row gap:6 signal 16×16, wifi 16×16, battery-full 16×16 $ink-900

#### Header (fill_container)
- row gap:10 items:center
- Logo (ref: J8RcD)
- Title: vertical gap:2
  - "Neurowatch" 22/700 $ink-900
  - "Tendencias y bitácora" 13/400(normal) $ink-600

#### Range Selector (fill_container)
- bg: $brand-100, r:999, row gap:4 pad:4
- Tab Dia: fill_container fill:#00000000 r:999 vertical pad:[8,0] center items:center
  - "Dia" 13/500 $ink-600
- Tab Semana: fill_container bg:$brand-600 r:999 vertical pad:[8,0] center items:center
  - "Semana" 13/700 #FFFFFF
- Tab Mes: fill_container fill:#00000000 r:999 vertical pad:[8,0] center items:center
  - "Mes" 13/500 $ink-600

#### Pulse Trend Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:12 pad:16

##### Pulse Header (fill_container)
- space_between items:center
- "Tendencia de pulso" 14/600 $ink-900
- "29 jun - 5 jul" 12/400(normal) $ink-600

##### Bars Row (fill_container×120)
- row gap:8 items:end
- 7 bars width:fill_container, r:[6,6,0,0]:
  - Bar Lun: $brand-600 h:35
  - Bar Mar: $brand-600 h:50
  - Bar Mie: $brand-600 h:45
  - Bar Jue: $warn h:100
  - Bar Vie: $brand-600 h:60
  - Bar Sab: $brand-600 h:55
  - Bar Dom: $brand-600 h:40

##### Labels Row (fill_container)
- row gap:8
- "Lun" 11/400(normal) $ink-400 textAlign:center fill_container
- "Mar" 11/400(normal) $ink-400 textAlign:center fill_container
- "Mie" 11/400(normal) $ink-400 textAlign:center fill_container
- "Jue" 11/400(normal) $ink-400 textAlign:center fill_container
- "Vie" 11/400(normal) $ink-400 textAlign:center fill_container
- "Sab" 11/400(normal) $ink-400 textAlign:center fill_container
- "Dom" 11/400(normal) $ink-400 textAlign:center fill_container

#### Bitacora Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:14 pad:16

##### Heading
- "Bitacora de chequeos faciales" 14/600 $ink-900

##### Timeline (fill_container)
- vertical

###### Entry 6 jul (fill_container)
- row gap:12 pad:[0,0,8,0]
- Indicator Col: 20 wide, vertical gap:4 items:center
  - Dot: ellipse 10×10 $ok
  - Connector: rect 2×38 $brand-100
- Thumb: 48×48 bg:$brand-100 r:10 center items:center
  - user-round (lucide) 24×24 $brand-600
- Text Col: vertical gap:6
  - "6 jul" 13/600 $ink-900
  - Chip: bg:$ok-fill r:999 pad:[4,10]
    - "Simetrico" 11/500 $ok

###### Entry 5 jul (fill_container)
- row gap:12 pad:[0,0,8,0]
- Indicator Col: 20 wide, vertical gap:4 items:center
  - Dot: ellipse 10×10 $ok
  - Connector: rect 2×38 $brand-100
- Thumb: 48×48 bg:$brand-100 r:10 center items:center
  - user-round (lucide) 24×24 $brand-600
- Text Col: vertical gap:6
  - "5 jul" 13/600 $ink-900
  - Chip: bg:$ok-fill r:999 pad:[4,10]
    - "Simetrico" 11/500 $ok

###### Entry 4 jul (fill_container)
- row gap:12 pad:[0,0,8,0]
- Indicator Col: 20 wide, vertical gap:4 items:center
  - Dot: ellipse 10×10 $warn
  - Connector: rect 2×38 $brand-100
- Thumb: 48×48 bg:$brand-100 r:10 center items:center
  - user-round (lucide) 24×24 $brand-600
- Text Col: vertical gap:6
  - "4 jul" 13/600 $ink-900
  - Chip: bg:#F59E0B1A r:999 pad:[4,10]
    - "Posible asimetria" 11/500 $warn

###### Entry 3 jul (fill_container)
- row gap:12 (no bottom padding)
- Indicator Col: 20 wide, vertical gap:4 items:center
  - Dot: ellipse 10×10 $ok (no connector — last entry)
- Thumb: 48×48 bg:$brand-100 r:10 center items:center
  - user-round (lucide) 24×24 $brand-600
- Text Col: vertical gap:6
  - "3 jul" 13/600 $ink-900
  - Chip: bg:$ok-fill r:999 pad:[4,10]
    - "Simetrico" 11/500 $ok

---

## Screen 8 · Contactos (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:16 pad:[14,20,100,20]

#### StatusBar (fill_container)
- pad:[0,4], space_between items:center
- Time "9:41" 15/600 $ink-900
- Sys: row gap:6 signal 16×16, wifi 16×16, battery-full 16×16 $ink-900

#### Header (fill_container)
- row gap:10 items:center
- Logo (ref: J8RcD)
- Title: vertical gap:2
  - "Neurowatch" 22/700 $ink-900
  - "Contactos de emergencia" 13/400(normal) $ink-600

#### Contacts Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:4 pad:8

##### Contact Row Maria Lopez (fill_container)
- row gap:12 pad:8 items:center
- Avatar: 44×44 bg:$brand-100 r:999 center items:center
  - user (lucide) 20×20 $brand-600
- Text Col: vertical gap:2 fill_container
  - "Maria Lopez" 15/700 $ink-900
  - "Hija" 13/400(normal) $ink-600
- Status Chip: bg:$ok-fill r:999 gap:4 pad:[6,10] items:center
  - check (lucide) 12×12 $ok
  - "Vinculado" 11/600 $ok

##### Divider
- rect fill_container×1 $glass-border

##### Contact Row Dr. Ramirez (fill_container)
- row gap:12 pad:8 items:center
- Avatar: 44×44 bg:$brand-100 r:999 center items:center
  - user (lucide) 20×20 $brand-600
- Text Col: vertical gap:2 fill_container
  - "Dr. Ramirez" 15/700 $ink-900
  - "Medico" 13/400(normal) $ink-600
- Status Chip: bg:$ok-fill r:999 gap:4 pad:[6,10] items:center
  - check (lucide) 12×12 $ok
  - "Vinculado" 11/600 $ok

#### Add Contact Button (fill_container)
- bg: $brand-100, r:14, row gap:8 pad:14 center items:center
- user-plus (lucide) 18×18 $brand-600
- "Agregar contacto" 15/600 $brand-600

#### New Contact Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:14 pad:16

##### Heading
- "Nuevo contacto" 14/600 $ink-900

##### Field Nombre (fill_container)
- vertical gap:6
- "Nombre" 12/400(normal) $ink-600
- Input Box: fill_container×44 bg:#FFFFFF r:10 stroke:$glass-border 1px pad:[0,12] items:center
  - "Ej. Maria Lopez" 13/400(normal) $ink-400

##### Field Relacion (fill_container)
- vertical gap:6
- "Relacion" 12/400(normal) $ink-600
- Input Box: fill_container×44 bg:#FFFFFF r:10 stroke:$glass-border 1px pad:[0,12] items:center
  - "Ej. Hija, Medico, Vecino" 13/400(normal) $ink-400

##### Field Usuario de Telegram (fill_container)
- vertical gap:6
- "Usuario de Telegram" 12/400(normal) $ink-600
- Input Box: fill_container×44 bg:#FFFFFF r:10 stroke:$glass-border 1px pad:[0,12] items:center
  - "@usuario" 13/400(normal) $ink-400

##### Link Telegram Button (fill_container×52)
- bg: $brand-600, r:14, row gap:8 center items:center
- send (lucide) 18×18 #FFFFFF
- "Vincular con Telegram" 15/600 #FFFFFF

#### Spacer (fill_container×fill_container)

#### Tab Bar (ref: v4PMkp) absolute x:0 y:760 w:390
- Overrides: Inicio icon+label $ink-400/500, Contactos icon+label $brand-600/600

---

## Onboarding 1 · Datos del paciente (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:20 pad:[24,20,28,20]

### Progress (fill_container)
- vertical gap:10
- "Paso 1 de 4" 13/600 $brand-600
- bars: row gap:6
  - bar1: fill_container×6 $brand-600 r:999
  - bar2: fill_container×6 $brand-100 r:999
  - bar3: fill_container×6 $brand-100 r:999
  - bar4: fill_container×6 $brand-100 r:999

### Title
- "Tus datos" 24/700 $ink-900

### Sub
- "Esto nos ayuda a crear tu perfil y a calibrar tu monitoreo." 14/400(normal) $ink-600 lineHeight:1.4 fixed-width

### Form Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:14 pad:18

#### Field Nombre (fill_container)
- vertical gap:6
- "Nombre" 12/400(normal) $ink-600
- Input Box: fill_container×44 bg:#FFFFFF r:10 stroke:$glass-border 1px pad:[0,12] items:center
  - "Ej. Rosa Fernandez" 14/400(normal) $ink-400

#### Field Edad (fill_container)
- vertical gap:6
- "Edad" 12/400(normal) $ink-600
- Input Box: fill_container×44 bg:#FFFFFF r:10 stroke:$glass-border 1px pad:[0,12] items:center
  - "Ej. 74" 14/400(normal) $ink-400

#### Field FC en reposo habitual (fill_container)
- vertical gap:6
- "FC en reposo habitual" 12/400(normal) $ink-600
- Input Box: fill_container×44 bg:#FFFFFF r:10 stroke:$glass-border 1px pad:[0,12] items:center
  - "Ej. 68 BPM" 14/400(normal) $ink-400

### Spacer (fill_container×fill_container)

### CTA (fill_container×56)
- bg: $brand-600, r:14
- effect: shadow (0,8,20,#4F46E540)
- center items:center
- "Continuar" 17/700 #FFFFFF

---

## Onboarding 2 · Foto base (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:20 pad:[24,20,28,20]

### Progress (fill_container)
- vertical gap:10
- "Paso 2 de 4" 13/600 $brand-600
- bars: row gap:6
  - bar1: fill_container×6 $brand-600 r:999
  - bar2: fill_container×6 $brand-600 r:999
  - bar3: fill_container×6 $brand-100 r:999
  - bar4: fill_container×6 $brand-100 r:999

### Title
- "Foto base" 24/700 $ink-900

### Sub
- "Tomate una foto de referencia — la usaremos para comparar tus futuros chequeos." 14/400(normal) $ink-600 lineHeight:1.4 fixed-width

### Capture Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:14 pad:18 items:center

#### Viewport (fill_container×314)
- clip: true, bg:#1E293B, r:16
- Face Guide: ellipse 170×220 absolute x:72 y:47 fill:#00000000 stroke:$brand-600 3px
- Caption Pill: bg:#0F172A99 r:999 pad:[7,14] items:center absolute x:57 y:266
  - "Alinea tu rostro dentro del marco" 13/500 #E2E8F0

#### Capture Btn (fill_container)
- bg: $brand-600, r:12
- effect: shadow (0,4,12,#4F46E540)
- row gap:8 pad:14 center items:center
- camera (lucide) 20×20 #FFFFFF
- "Tomar foto" 16/600 #FFFFFF

### Spacer (fill_container×fill_container)

### CTA (fill_container×56)
- bg: $brand-600, r:14
- effect: shadow (0,8,20,#4F46E540)
- center items:center
- "Continuar" 17/700 #FFFFFF

---

## Onboarding 3 · Contactos de emergencia (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:20 pad:[24,20,28,20]

### Progress (fill_container)
- vertical gap:10
- "Paso 3 de 4" 13/600 $brand-600
- bars: row gap:6
  - bar1: fill_container×6 $brand-600 r:999
  - bar2: fill_container×6 $brand-600 r:999
  - bar3: fill_container×6 $brand-600 r:999
  - bar4: fill_container×6 $brand-100 r:999

### Title
- "Contactos de emergencia" 24/700 $ink-900 fixed-width

### Subtitle
- "Agrega al menos un contacto que recibira las alertas por Telegram." 14/400(normal) $ink-600

### New Contact Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:14 pad:16

#### Heading
- "Nuevo contacto" 14/600 $ink-900

#### Field Nombre (fill_container)
- vertical gap:6
- "Nombre" 12/400(normal) $ink-600
- Input Box: fill_container×44 bg:#FFFFFF r:10 stroke:$glass-border 1px pad:[0,12] items:center
  - "Ej. Maria Lopez" 13/400(normal) $ink-400

#### Field Relacion (fill_container)
- vertical gap:6
- "Relacion" 12/400(normal) $ink-600
- Input Box: fill_container×44 bg:#FFFFFF r:10 stroke:$glass-border 1px pad:[0,12] items:center
  - "Ej. Hija, Medico, Vecino" 13/400(normal) $ink-400

#### Field Usuario de Telegram (fill_container)
- vertical gap:6
- "Usuario de Telegram" 12/400(normal) $ink-600
- Input Box: fill_container×44 bg:#FFFFFF r:10 stroke:$glass-border 1px pad:[0,12] items:center
  - "@usuario" 13/400(normal) $ink-400

#### Link Telegram Button (fill_container×52)
- bg: $brand-600, r:14, row gap:8 center items:center
- send (lucide) 18×18 #FFFFFF
- "Vincular con Telegram" 15/600 #FFFFFF

### Contactos agregados Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:4 pad:12

#### Heading
- "Contactos agregados" 14/600 $ink-900

#### Contact Row Maria Lopez (fill_container)
- row gap:12 pad:8 items:center
- Avatar: 44×44 bg:$brand-100 r:999 center items:center
  - user (lucide) 20×20 $brand-600
- Text Col: vertical gap:2 fill_container
  - "Maria Lopez" 15/700 $ink-900
  - "Hija" 13/400(normal) $ink-600
- Status Chip: bg:$ok-fill r:999 gap:4 pad:[6,10] items:center
  - check (lucide) 12×12 $ok
  - "Vinculado" 11/600 $ok

### Spacer (fill_container×fill_container)

### CTA Continuar (fill_container×56)
- bg: $brand-600, r:14, center items:center
- "Continuar" 16/700 #FFFFFF

### Skip Wrap (fill_container)
- justifyContent: center
- "Ahora no" 13/400(normal) $ink-400

---

## Onboarding 4 · Emparejar el reloj (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:20 pad:[24,20,28,20]

### Progress (fill_container)
- vertical gap:10
- "Paso 4 de 4" 13/600 $brand-600
- bars: row gap:6
  - bar1: fill_container×6 $brand-600 r:999
  - bar2: fill_container×6 $brand-600 r:999
  - bar3: fill_container×6 $brand-600 r:999
  - bar4: fill_container×6 $brand-600 r:999

### Title
- "Emparejar tu reloj" 24/700 $ink-900 fixed-width

### Subtitle
- "Buscamos tu reloj por Bluetooth para empezar a monitorear." 14/400(normal) $ink-600

### Search Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:16 pad:32 items:center

#### Pulse Circle (120×120)
- bg: $brand-100, r:999, center items:center
- bluetooth (lucide) 32×32 $brand-600

#### Status Text
- "Buscando tu reloj..." 16/600 $ink-900

#### Caption
- "Asegurate de que el reloj este cerca y encendido." 13/400(normal) $ink-600 textAlign:center fixed-width

### Device Found Row (fill_container)
- bg: $ok-fill, r:14, stroke: #10B98159 1px
- row gap:12 pad:14 items:center

#### Icon Wrap (40×40)
- bg: #FFFFFF, r:999, center items:center
- watch (lucide) 20×20 $ok

#### Text Col (fill_container)
- vertical gap:2
- "Neurowatch Band" 15/700 $ink-900
- "Dispositivo encontrado" 13/400(normal) $ok

#### Check Icon
- check (lucide) 20×20 $ok

### Spacer (fill_container×fill_container)

### CTA Probar (fill_container×56)
- bg: $brand-600, r:14, row gap:8 center items:center
- zap (lucide) 18×18 #FFFFFF
- "Probar conexion" 16/700 #FFFFFF

---

## Onboarding 5 · Listo para monitorear (390×844)
- clip: true
- bg: gradient #EEF2FF→#ECFEFF 315°
- vertical gap:24 pad:[24,20,28,20] justifyContent:center

### Success Hero (fill_container)
- vertical gap:14 pad:8 items:center

#### Badge (76×76)
- bg: $ok, r:38
- effect: shadow (0,8,24,#10B98159)
- center items:center
- check (lucide) 38×38 #FFFFFF

#### Title
- "Listo para monitorear" 24/700 $ink-900 textAlign:center

#### Sub
- "Configuramos todo lo necesario para empezar a cuidar a Rosa." 14/400(normal) $ink-600 lineHeight:1.4 textAlign:center fixed-width

### Checklist Card (fill_container)
- bg: $glass-fill, r:20, stroke: $glass-border 1px
- effect: background_blur(20)
- effect: shadow (0,8,32,#1F293714)
- vertical gap:4 pad:8

#### Item Foto base (fill_container)
- row gap:12 pad:12 items:center
- ic: 32×32 bg:$ok-fill r:999 center items:center
  - check (lucide) 16×16 $ok
- col: vertical gap:1 fill_container
  - "Foto base" 14/600 $ink-900
  - "Referencia facial guardada" 12/400(normal) $ink-600

#### Divider
- rect fill_container×1 $glass-border

#### Item Contacto vinculado (fill_container)
- row gap:12 pad:12 items:center
- ic: 32×32 bg:$ok-fill r:999 center items:center
  - check (lucide) 16×16 $ok
- col: vertical gap:1 fill_container
  - "Contacto vinculado" 14/600 $ink-900
  - "Maria Lopez por Telegram" 12/400(normal) $ink-600

#### Divider
- rect fill_container×1 $glass-border

#### Item Reloj emparejado (fill_container)
- row gap:12 pad:12 items:center
- ic: 32×32 bg:$ok-fill r:999 center items:center
  - check (lucide) 16×16 $ok
- col: vertical gap:1 fill_container
  - "Reloj emparejado" 14/600 $ink-900
  - "Neurowatch Band conectado" 12/400(normal) $ink-600

### Spacer (fill_container×fill_container)

### CTA (fill_container×56)
- bg: $brand-600, r:14
- effect: shadow (0,8,20,#4F46E540)
- row gap:8 center items:center
- arrow-right (lucide) 20×20 #FFFFFF
- "Ir al dashboard" 17/700 #FFFFFF
