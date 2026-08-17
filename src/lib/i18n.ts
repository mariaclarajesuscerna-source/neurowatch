export type Language = "es" | "qu";

export const translations = {
  es: {
    spanish: "ESPAÑOL",
    quechua: "QUECHUA",

    neuroWatch: "NeuroWatch",
    huarazPeru: "HUARAZ · PERÚ",
    tagline: "Tecnología que cuida tu vida, con raíces que nos unen.",

    menu: "Menú",
    notifications: "Notificaciones",

    technology: "Tecnología que cuida tu vida",
    wellbeing: "Tu bienestar,",
    ourMission: "nuestra misión.",

    monitorDescription:
      "Monitorea tus signos vitales en tiempo real con tecnología creada pensando en nuestra gente.",

    whyNeurowatch: "¿Por qué NeuroWatch?",

    realtime: "Monitoreo en tiempo real",
    realtimeDescription:
      "Cuida tu corazón y vigila tus signos vitales.",

    purposefulTechnology: "Tecnología con propósito",
    purposefulDescription:
      "Innovación que busca mejorar vidas en Huaraz.",

    connected: "Conectado contigo",
    connectedDescription:
      "Datos y monitoreo siempre cerca de ti.",

    madeForPeople: "Hecho para nuestra gente",
    madeForPeopleDescription:
      "Diseñado pensando en nuestra tierra.",

    liveMonitoring: "Monitoreo en vivo",
    heartRate: "Frecuencia",
    cardiac: "cardíaca",

    bpm: "ppm",

    currentStatus: "Estado actual",
    activeMonitoring: "Monitoreo activo",
    waitingConnection: "Esperando conexión",

    connect: "Conectar",
    connectedDevice: "Dispositivo conectado",
    disconnected: "Dispositivo desconectado",

    alert: "ALERTA",
    warning: "ADVERTENCIA",
    normal: "NORMAL",

    cancel: "Cancelar",
    confirm: "Confirmar",
    save: "Guardar",
    close: "Cerrar",

    patient: "Paciente",
    contacts: "Contactos",
    settings: "Configuración",
    history: "Historial",

    facialCheck: "Chequeo facial",
    pulse: "Pulso",
    temperature: "Temperatura",
    oxygen: "Oxígeno",

    noData: "Sin datos",

    emergency:
      "Se detectó una posible anomalía. Verifica el estado de la persona.",

    disclaimer:
      "NeuroWatch es una herramienta asistiva y no reemplaza la atención médica.",
  },

  qu: {
    spanish: "ESPAÑOL",
    quechua: "RUNASIMI",

    neuroWatch: "NeuroWatch",
    huarazPeru: "WARAS · PERÚ",
    tagline:
      "Kawsayniykita waqaychay tecnología, sapinchikwan kuska.",

    menu: "Menú",
    notifications: "Willakuykuna",

    technology: "Kawsayniykita waqaychay tecnología",
    wellbeing: "Allin kawsayniyki,",
    ourMission: "llank'ayninchikmi.",

    monitorDescription:
      "Kawsaypa señalkunata pacha pacha qhawariy, runakunapaq ruwasqa tecnologíawan.",

    whyNeurowatch: "¿Imaraykutaq NeuroWatch?",

    realtime: "Pachapachalla qhawariy",
    realtimeDescription:
      "Sunquykita waqaychay, kawsaypa señalkunata qhawariy.",

    purposefulTechnology: "Tecnología munayninwan",
    purposefulDescription:
      "Musuq yachaywan Waraspi kawsaykunata allinchay.",

    connected: "Qampiwanchik kuska",
    connectedDescription:
      "Datoswan qhawariywan qam qayllapi kachkan.",

    madeForPeople: "Runakunapaq ruwasqa",
    madeForPeopleDescription:
      "Llaqtanchikta yuyarispa ruwasqa.",

    liveMonitoring: "Kawsay qhawariy",
    heartRate: "Sunqupa",
    cardiac: "muyuriynin",

    bpm: "ppm",

    currentStatus: "Kunanpa situación",
    activeMonitoring: "Qhawariy kachkan",
    waitingConnection: "Conexiónta suyarichkan",

    connect: "Tinkichiy",
    connectedDevice: "Dispositivo tinkisqa",
    disconnected: "Dispositivo rakisqa",

    alert: "ALERTA",
    warning: "UYARIY",
    normal: "ALLIN",

    cancel: "Saquiy",
    confirm: "Arí",
    save: "Waqaychay",
    close: "Wisqay",

    patient: "Unquq",
    contacts: "Tinkiqkuna",
    settings: "Rurayninkuna",
    history: "Ñawpaq qhawariykuna",

    facialCheck: "Uya qhawariy",
    pulse: "Sunqupa muyuriynin",
    temperature: "Rupay",
    oxygen: "Oxígeno",

    noData: "Mana datokuna kanchu",

    emergency:
      "Posible anomalía tarisqa. Runapa situaciónninta utqaylla qhawariy.",

    disclaimer:
      "NeuroWatch yanapakuy herramienta, mana hampiqpa yanapayninta rantinchu.",
  },
} as const;

export type TranslationKey = keyof typeof translations.es;

export function getTranslations(language: Language) {
  return translations[language];
}
