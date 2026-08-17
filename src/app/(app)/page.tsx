"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/LanguageProvider";

import {
  IconSignal,
  IconWifi,
  IconBatteryFull,
  IconBluetooth,
} from "@/components/ui/icons";

import HeroStatus from "@/components/dashboard/HeroStatus";
import PulseCard from "@/components/dashboard/PulseCard";
import DeviceCard from "@/components/dashboard/DeviceCard";
import AlertModal from "@/components/alert/AlertModal";

import { useNeurowatch } from "@/components/NeurowatchProvider";

const pageText = {
  es: {
    tagline: "Tecnología que cuida tu vida, con raíces que nos unen.",
    technology: "Tecnología que cuida tu vida",
    wellbeing: "Tu bienestar,",
    mission: "nuestra misión.",
    monitor:
      "Monitorea tus signos vitales en tiempo real con tecnología creada pensando en nuestra gente.",
    why: "¿Por qué NeuroWatch?",
    realtime: "Monitoreo en tiempo real",
    realtimeDesc: "Cuida tu corazón y vigila tus signos vitales.",
    purpose: "Tecnología con propósito",
    purposeDesc: "Innovación que busca mejorar vidas en Huaraz.",
    connected: "Conectado contigo",
    connectedDesc: "Datos y monitoreo siempre cerca de ti.",
    people: "Hecho para nuestra gente",
    peopleDesc: "Diseñado pensando en nuestra tierra.",
    liveMonitoring: "Monitoreo en vivo",
    heartRate: "Frecuencia cardíaca",
    currentStatus: "Estado actual",
    activeMonitoring: "Monitoreo activo",
    waitingConnection: "Esperando conexión",
    connectWatch: "Conectar reloj NeuroWatch",
    liveSigns: "Signos en vivo",
    live: "● EN VIVO",
    connectedWatch: "Conectado al reloj.",
    finger:
      "Coloca el dedo en el sensor para comenzar a recibir tus datos de pulso.",
    alerts: "Alertas",
    highRate: "Frecuencia alta",
    waitingData: "Esperando datos del reloj.",
    rest: "Recuerda descansar",
    restDesc: "Tómate un momento para relajarte.",
    allGood: "¡Todo bien!",
    monitoring: "Tus signos vitales están siendo monitoreados.",
    ourLand: "Nuestra tierra",
    ourStrength: "Nuestra tierra, nuestra fuerza.",
    connectedWithYou: "Conectado contigo",
    status: "Estado",
    battery: "Batería",
    active: "ACTIVO",
    ready: "LISTO",
    health: "Salud",
    trust: "Confianza",
    innovation: "Innovación",
    community: "Comunidad",
    mountain: "Cordillera Blanca",
    huaraz: "Huaraz",
  },

  qu: {
    tagline:
      "Kawsayniykita waqaychanapaq tecnología, ñawpa yachayninchiswan.",
    technology: "Kawsayniykita waqaychay",
    wellbeing: "Allin kawsayniyki,",
    mission: "llank'ayninchis.",
    monitor:
      "Kawsayniykipa señalkunata pachan pachan qhawariy, runakunapaq ruwasqa tecnologíawan.",
    why: "¿Imaraykutaq NeuroWatch?",
    realtime: "Pachanmanta qhawariy",
    realtimeDesc:
      "Sunquykita waqaychay, kawsayniykipa señalkunata qhawariy.",
    purpose: "Tecnología munaywan",
    purposeDesc: "Huarazpi runakunapa kawsayninta allinchayta munan.",
    connected: "Qamwan tinkisqa",
    connectedDesc: "Datoskunata qhawariy, qanpa qayllaykipi.",
    people: "Ñuqanchispaq ruwasqa",
    peopleDesc: "Allpa suyunchispa yuyayninwan ruwasqa.",
    liveMonitoring: "Kawsay qhawariy",
    heartRate: "Sunqupa pisiqnin",
    currentStatus: "Kunan kawsay",
    activeMonitoring: "Qhawariy kachkan",
    waitingConnection: "Tinkiyta suyachkan",
    connectWatch: "NeuroWatch relojwan tinkiy",
    liveSigns: "Kawsay señalkuna",
    live: "● KAWSACHKAN",
    connectedWatch: "Relojwan tinkisqa.",
    finger:
      "Ruk'aykita sensorpi churay, sunqupa pisiqninpa datonkuna chayamunanpaq.",
    alerts: "Willakuykuna",
    highRate: "Sunqupa pisiqnin hatun",
    waitingData: "Relojpa datonta suyachkan.",
    rest: "Samayta yuyariy",
    restDesc: "Pisi pachata samakuy.",
    allGood: "¡Allinmi!",
    monitoring: "Kawsayniykipa señalkunata qhawarichkan.",
    ourLand: "Llaqtanchis",
    ourStrength: "Llaqtanchis, kallpanchis.",
    connectedWithYou: "Qamwan tinkisqa",
    status: "Kawsay",
    battery: "Batería",
    active: "KACHKAN",
    ready: "LISTO",
    health: "Kawsay",
    trust: "Kuska yuyay",
    innovation: "Musuq yachay",
    community: "Ayllu",
    mountain: "Cordillera Blanca",
    huaraz: "Huaraz",
  },
} as const;

const textilePattern = `
  repeating-linear-gradient(
    45deg,
    #c94a20 0px,
    #c94a20 8px,
    #e8a33d 8px,
    #e8a33d 16px,
    #2f8f5b 16px,
    #2f8f5b 24px,
    #087f83 24px,
    #087f83 32px
  )
`;const pageText = {
  es: {
    tagline: "Tecnología que cuida tu vida, con raíces que nos unen.",
    technology: "Tecnología que cuida tu vida",
    wellbeing: "Tu bienestar,",
    mission: "nuestra misión.",
    monitor:
      "Monitorea tus signos vitales en tiempo real con tecnología creada pensando en nuestra gente.",
    why: "¿Por qué NeuroWatch?",
    realtime: "Monitoreo en tiempo real",
    realtimeDesc: "Cuida tu corazón y vigila tus signos vitales.",
    purpose: "Tecnología con propósito",
    purposeDesc: "Innovación que busca mejorar vidas en Huaraz.",
    connected: "Conectado contigo",
    connectedDesc: "Datos y monitoreo siempre cerca de ti.",
    people: "Hecho para nuestra gente",
    peopleDesc: "Diseñado pensando en nuestra tierra.",
    liveMonitoring: "Monitoreo en vivo",
    heartRate: "Frecuencia cardíaca",
    currentStatus: "Estado actual",
    activeMonitoring: "Monitoreo activo",
    waitingConnection: "Esperando conexión",
    connectWatch: "Conectar reloj NeuroWatch",
    liveSigns: "Signos en vivo",
    live: "● EN VIVO",
    connectedWatch: "Conectado al reloj.",
    finger:
      "Coloca el dedo en el sensor para comenzar a recibir tus datos de pulso.",
    alerts: "Alertas",
    highRate: "Frecuencia alta",
    waitingData: "Esperando datos del reloj.",
    rest: "Recuerda descansar",
    restDesc: "Tómate un momento para relajarte.",
    allGood: "¡Todo bien!",
    monitoring: "Tus signos vitales están siendo monitoreados.",
    ourLand: "Nuestra tierra",
    ourStrength: "Nuestra tierra, nuestra fuerza.",
    connectedWithYou: "Conectado contigo",
    status: "Estado",
    battery: "Batería",
    active: "ACTIVO",
    ready: "LISTO",
    health: "Salud",
    trust: "Confianza",
    innovation: "Innovación",
    community: "Comunidad",
    mountain: "Cordillera Blanca",
    huaraz: "Huaraz",
  },

  qu: {
    tagline:
      "Kawsayniykita waqaychanapaq tecnología, ñawpa yachayninchiswan.",
    technology: "Kawsayniykita waqaychay",
    wellbeing: "Allin kawsayniyki,",
    mission: "llank'ayninchis.",
    monitor:
      "Kawsayniykipa señalkunata pachan pachan qhawariy, runakunapaq ruwasqa tecnologíawan.",
    why: "¿Imaraykutaq NeuroWatch?",
    realtime: "Pachanmanta qhawariy",
    realtimeDesc:
      "Sunquykita waqaychay, kawsayniykipa señalkunata qhawariy.",
    purpose: "Tecnología munaywan",
    purposeDesc: "Huarazpi runakunapa kawsayninta allinchayta munan.",
    connected: "Qamwan tinkisqa",
    connectedDesc: "Datoskunata qhawariy, qanpa qayllaykipi.",
    people: "Ñuqanchispaq ruwasqa",
    peopleDesc: "Allpa suyunchispa yuyayninwan ruwasqa.",
    liveMonitoring: "Kawsay qhawariy",
    heartRate: "Sunqupa pisiqnin",
    currentStatus: "Kunan kawsay",
    activeMonitoring: "Qhawariy kachkan",
    waitingConnection: "Tinkiyta suyachkan",
    connectWatch: "NeuroWatch relojwan tinkiy",
    liveSigns: "Kawsay señalkuna",
    live: "● KAWSACHKAN",
    connectedWatch: "Relojwan tinkisqa.",
    finger:
      "Ruk'aykita sensorpi churay, sunqupa pisiqninpa datonkuna chayamunanpaq.",
    alerts: "Willakuykuna",
    highRate: "Sunqupa pisiqnin hatun",
    waitingData: "Relojpa datonta suyachkan.",
    rest: "Samayta yuyariy",
    restDesc: "Pisi pachata samakuy.",
    allGood: "¡Allinmi!",
    monitoring: "Kawsayniykipa señalkunata qhawarichkan.",
    ourLand: "Llaqtanchis",
    ourStrength: "Llaqtanchis, kallpanchis.",
    connectedWithYou: "Qamwan tinkisqa",
    status: "Kawsay",
    battery: "Batería",
    active: "KACHKAN",
    ready: "LISTO",
    health: "Kawsay",
    trust: "Kuska yuyay",
    innovation: "Musuq yachay",
    community: "Ayllu",
    mountain: "Cordillera Blanca",
    huaraz: "Huaraz",
  },
} as const;

const textilePattern = `
  repeating-linear-gradient(
    45deg,
    #c94a20 0px,
    #c94a20 8px,
    #e8a33d 8px,
    #e8a33d 16px,
    #2f8f5b 16px,
    #2f8f5b 24px,
    #087f83 24px,
    #087f83 32px
  )
`;const pageText = {
  es: {
    tagline: "Tecnología que cuida tu vida, con raíces que nos unen.",
    technology: "Tecnología que cuida tu vida",
    wellbeing: "Tu bienestar,",
    mission: "nuestra misión.",
    monitor:
      "Monitorea tus signos vitales en tiempo real con tecnología creada pensando en nuestra gente.",
    why: "¿Por qué NeuroWatch?",
    realtime: "Monitoreo en tiempo real",
    realtimeDesc: "Cuida tu corazón y vigila tus signos vitales.",
    purpose: "Tecnología con propósito",
    purposeDesc: "Innovación que busca mejorar vidas en Huaraz.",
    connected: "Conectado contigo",
    connectedDesc: "Datos y monitoreo siempre cerca de ti.",
    people: "Hecho para nuestra gente",
    peopleDesc: "Diseñado pensando en nuestra tierra.",
    liveMonitoring: "Monitoreo en vivo",
    heartRate: "Frecuencia cardíaca",
    currentStatus: "Estado actual",
    activeMonitoring: "Monitoreo activo",
    waitingConnection: "Esperando conexión",
    connectWatch: "Conectar reloj NeuroWatch",
    liveSigns: "Signos en vivo",
    live: "● EN VIVO",
    connectedWatch: "Conectado al reloj.",
    finger:
      "Coloca el dedo en el sensor para comenzar a recibir tus datos de pulso.",
    alerts: "Alertas",
    highRate: "Frecuencia alta",
    waitingData: "Esperando datos del reloj.",
    rest: "Recuerda descansar",
    restDesc: "Tómate un momento para relajarte.",
    allGood: "¡Todo bien!",
    monitoring: "Tus signos vitales están siendo monitoreados.",
    ourLand: "Nuestra tierra",
    ourStrength: "Nuestra tierra, nuestra fuerza.",
    connectedWithYou: "Conectado contigo",
    status: "Estado",
    battery: "Batería",
    active: "ACTIVO",
    ready: "LISTO",
    health: "Salud",
    trust: "Confianza",
    innovation: "Innovación",
    community: "Comunidad",
    mountain: "Cordillera Blanca",
    huaraz: "Huaraz",
  },

  qu: {
    tagline:
      "Kawsayniykita waqaychanapaq tecnología, ñawpa yachayninchiswan.",
    technology: "Kawsayniykita waqaychay",
    wellbeing: "Allin kawsayniyki,",
    mission: "llank'ayninchis.",
    monitor:
      "Kawsayniykipa señalkunata pachan pachan qhawariy, runakunapaq ruwasqa tecnologíawan.",
    why: "¿Imaraykutaq NeuroWatch?",
    realtime: "Pachanmanta qhawariy",
    realtimeDesc:
      "Sunquykita waqaychay, kawsayniykipa señalkunata qhawariy.",
    purpose: "Tecnología munaywan",
    purposeDesc: "Huarazpi runakunapa kawsayninta allinchayta munan.",
    connected: "Qamwan tinkisqa",
    connectedDesc: "Datoskunata qhawariy, qanpa qayllaykipi.",
    people: "Ñuqanchispaq ruwasqa",
    peopleDesc: "Allpa suyunchispa yuyayninwan ruwasqa.",
    liveMonitoring: "Kawsay qhawariy",
    heartRate: "Sunqupa pisiqnin",
    currentStatus: "Kunan kawsay",
    activeMonitoring: "Qhawariy kachkan",
    waitingConnection: "Tinkiyta suyachkan",
    connectWatch: "NeuroWatch relojwan tinkiy",
    liveSigns: "Kawsay señalkuna",
    live: "● KAWSACHKAN",
    connectedWatch: "Relojwan tinkisqa.",
    finger:
      "Ruk'aykita sensorpi churay, sunqupa pisiqninpa datonkuna chayamunanpaq.",
    alerts: "Willakuykuna",
    highRate: "Sunqupa pisiqnin hatun",
    waitingData: "Relojpa datonta suyachkan.",
    rest: "Samayta yuyariy",
    restDesc: "Pisi pachata samakuy.",
    allGood: "¡Allinmi!",
    monitoring: "Kawsayniykipa señalkunata qhawarichkan.",
    ourLand: "Llaqtanchis",
    ourStrength: "Llaqtanchis, kallpanchis.",
    connectedWithYou: "Qamwan tinkisqa",
    status: "Kawsay",
    battery: "Batería",
    active: "KACHKAN",
    ready: "LISTO",
    health: "Kawsay",
    trust: "Kuska yuyay",
    innovation: "Musuq yachay",
    community: "Ayllu",
    mountain: "Cordillera Blanca",
    huaraz: "Huaraz",
  },
} as const;

const textilePattern = `
  repeating-linear-gradient(
    45deg,
    #c94a20 0px,
    #c94a20 8px,
    #e8a33d 8px,
    #e8a33d 16px,
    #2f8f5b 16px,
    #2f8f5b 24px,
    #087f83 24px,
    #087f83 32px
  )
`;
export default function DashboardPage() {
  const router = useRouter();

  const {
    language,
    setLanguage,
  } = useLanguage();
const text = pageText[language];
  const {
    bleData,
    bleError,
    connectBLE,
    status,
    pulseBars,
    contacts,
    alertOpen,
    countdownSeconds,
    settings,
    cancelAlert,
    disconnectedSince,
  } = useNeurowatch();

  useEffect(() => {
    if (disconnectedSince) {
      router.replace("/desconectado");
    }
  }, [router, disconnectedSince]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7efe0] text-[#263a32]">

    {/* =========================
    FONDO
========================= */}

<div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

  {/* Brillo cálido */}
  <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#e8a33d]/15 blur-3xl" />

  {/* Brillo turquesa */}
  <div className="absolute -right-40 top-96 h-[500px] w-[500px] rounded-full bg-[#087f83]/10 blur-3xl" />

  {/* Montañas andinas */}
  <div className="absolute bottom-0 left-0 right-0 h-72 opacity-[0.08]">

    <svg
      viewBox="0 0 1200 300"
      className="h-full w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >

      {/* Montaña turquesa */}
      <path
        d="M0 300V205L130 95l95 100L355 60l130 155L625 85l120 120L890 45l140 150 90-95 80 60v140Z"
        fill="#087f83"
      />

      {/* Montaña terracota */}
      <path
        d="M0 300V245l170-110 100 70 145-105 130 105 130-85 120 75 145-110 160 95 120-70v190Z"
        fill="#c94a20"
      />

    </svg>

  </div>

</div>

      <main className="mx-auto w-full max-w-[1500px] px-3 pb-28 pt-3 sm:px-5 lg:px-8 lg:pb-12 lg:pt-6">

        {/* BARRA SUPERIOR */}

        <div className="mb-3 flex items-center justify-between lg:hidden">
          <span className="text-sm font-black text-[#3b2a1a]">
            {new Date().toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <div className="flex items-center gap-2 text-[#075d63]">
            <IconSignal size={16} />
            <IconWifi size={16} />
            <IconBatteryFull size={16} />
          </div>
        </div>

        {/* PATRÓN TEXTIL */}

        <div
          className="mb-4 h-7 w-full overflow-hidden rounded-b-2xl border border-[#b86b31]/30 shadow-sm"
          style={{ backgroundImage: textilePattern }}
        />

        {/* HEADER */}

        <header className="mb-5 flex flex-col gap-4 rounded-[28px] border border-[#e4c99e] bg-[#fff9ed]/90 p-4 shadow-[0_12px_35px_rgba(72,48,25,0.08)] backdrop-blur-xl sm:p-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#087f83] text-3xl text-white shadow-[0_8px_20px_rgba(8,127,131,0.25)]">
              ❤️
            </div>

            <div>
              <h1 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-[#075d63] sm:text-4xl">
                NeuroWatch
              </h1>

              <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-[#c1440c]">
                {t("huarazPeru")}
              </p>

             <p className="mt-1 text-xs font-semibold text-[#79634d]">
  {text.tagline}
</p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e3c89f] bg-white/80 text-xl shadow-sm"
              aria-label="Menú"
            >
              ☰
            </button>

            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#e3c89f] bg-white/80 text-xl shadow-sm"
              aria-label="Notificaciones"
            >
              🔔
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#c1272d]" />
            </button>

          </div>
        </header>

        {/* IDIOMAS */}

        <div className="mb-5 flex justify-center">

          <div className="flex w-full max-w-sm rounded-2xl border border-[#e3c89f] bg-[#fffaf0] p-1 shadow-sm">

            <button
              type="button"
              onClick={() => setLanguage("es")}
              className={`flex-1 rounded-xl py-2.5 text-xs font-black transition-all ${
                language === "es"
                  ? "bg-[#087f83] text-white shadow-md"
                  : "text-[#704a2d] hover:bg-[#087f83]/10"
              }`}
            >
              ESPAÑOL
            </button>

            <button
              type="button"
              onClick={() => setLanguage("qu")}
              className={`flex-1 rounded-xl py-2.5 text-xs font-black transition-all ${
                language === "qu"
                  ? "bg-[#c1440c] text-white shadow-md"
                  : "text-[#704a2d] hover:bg-[#c1440c]/10"
              }`}
            >
              QUECHUA
            </button>

          </div>

        </div>

        {/* GRID PRINCIPAL */}

        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.35fr_0.8fr]">

          {/* =========================
              COLUMNA IZQUIERDA
          ========================== */}

          <aside className="space-y-5">

           {/* HERO HUARAZ */}

<section className="relative overflow-hidden rounded-[30px] border border-[#dfbf8e] bg-[#fff7e8] shadow-[0_16px_40px_rgba(72,48,25,0.12)]">

  {/* Patrón textil */}

  <div
    className="h-7"
    style={{ backgroundImage: textilePattern }}
  />

  <div className="p-6">

    <div className="flex justify-end">
      <span className="text-5xl opacity-80">
        ☀️
      </span>
    </div>

    <p className="mt-1 max-w-[260px] text-xs font-black uppercase tracking-[0.18em] text-[#c1440c]">
      {text.technology}
    </p>

    <h2 className="mt-3 max-w-[300px] font-display text-4xl font-black uppercase leading-[0.95] text-[#075d63]">
      {text.wellbeing}
      <br />
      {text.mission}
    </h2>

    <p className="mt-4 max-w-[300px] text-sm leading-relaxed text-[#6b5842]">
      {text.monitor}
    </p>

    {/* FOTO REAL: CORDILLERA BLANCA */}

    <div className="mt-8">

      <div className="relative h-48 overflow-hidden rounded-3xl shadow-lg">

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Huascaran_Huandoy_Chopicalqui_seen_from_Huaraz.JPG"
          alt="Cordillera Blanca vista desde Huaraz"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#173c3a]/70 via-transparent to-transparent" />

        {/* TEXTO SOBRE LA IMAGEN */}

        <div className="absolute bottom-3 left-4 right-4">

          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
            Huaraz · Áncash
          </p>

          <p className="mt-1 text-lg font-black text-white">
            {text.mountain}
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

{/* POR QUÉ NEUROWATCH */}

            <section className="overflow-hidden rounded-[27px] border border-[#dfbf8e] bg-[#fff9ed] shadow-[0_12px_30px_rgba(72,48,25,0.09)]">

              <div className="flex items-center justify-between bg-[#c1440c] px-5 py-4 text-white">

                <h2 className="font-display text-xl font-black uppercase">
                  ¿Por qué NeuroWatch?
                </h2>

                <span>✦</span>

              </div>

              <div className="space-y-5 p-5">

                <div className="flex gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c1440c]/10 text-2xl">
                    ❤️
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase text-[#263a32]">
                      Monitoreo en tiempo real
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-[#6b5842]">
                      Cuida tu corazón y vigila tus signos vitales.
                    </p>
                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#087f83]/10 text-2xl">
                    💡
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase">
                      Tecnología con propósito
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-[#6b5842]">
                      Innovación que busca mejorar vidas en Huaraz.
                    </p>
                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2f8f5b]/10 text-2xl">
                    🛡️
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase">
                      Conectado contigo
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-[#6b5842]">
                      Datos y monitoreo siempre cerca de ti.
                    </p>
                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8a33d]/15 text-2xl">
                    👥
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase">
                      Hecho para nuestra gente
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-[#6b5842]">
                      Diseñado pensando en nuestra tierra.
                    </p>
                  </div>

                </div>

              </div>

              <div
                className="h-5"
                style={{ backgroundImage: textilePattern }}
              />

            </section>

          </aside>

          {/* =========================
              COLUMNA CENTRAL
          ========================== */}

          <section className="space-y-5">

            {/* FRECUENCIA CARDÍACA */}

            <section className="relative overflow-hidden rounded-[32px] border border-[#dfbf8e] bg-[#fff9ed] p-5 shadow-[0_16px_40px_rgba(72,48,25,0.11)] sm:p-7">

              <div className="absolute right-5 top-5 text-5xl opacity-80">
                ❤️
              </div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#087f83]">
                Monitoreo en vivo
              </p>

              <h2 className="mt-2 font-display text-3xl font-black uppercase leading-none text-[#263a32] sm:text-4xl">
                Frecuencia
                <br />
                cardíaca
              </h2>

              <div className="my-6 flex justify-center">

                <div className="relative flex h-48 w-52 items-center justify-center">

                  <div className="absolute text-[170px] leading-none drop-shadow-[0_12px_18px_rgba(193,68,12,0.25)]">
                    ❤️
                  </div>

                  <div className="relative z-10 mt-2 text-center text-white">

                    <div className="text-5xl font-black leading-none">
                      {bleData.bpm > 0 ? bleData.bpm : "--"}
                    </div>

                    <div className="mt-1 text-sm font-black">
                      ppm
                    </div>

                  </div>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <div className="h-0.5 flex-1 bg-[#2f8f5b]/40" />

                <div className="text-3xl font-bold tracking-tight text-[#2f8f5b]">
                  ─╲╱╲╱╲╱─
                </div>

                <div className="h-0.5 flex-1 bg-[#2f8f5b]/40" />

              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#e5cba3] bg-white/75 p-4">

                <div>

                  <p className="text-xs font-black uppercase text-[#3b2a1a]">
                    Estado actual
                  </p>

                  <p className="mt-1 text-lg font-black uppercase text-[#2f8f5b]">
                    {bleData.connected
                      ? "Monitoreo activo"
                      : "Esperando conexión"}
                  </p>

                </div>

                <span
                  className={`h-4 w-4 rounded-full ${
                    bleData.connected
                      ? "bg-[#2f8f5b] shadow-[0_0_12px_rgba(47,143,91,0.6)]"
                      : "bg-[#a9967d]"
                  }`}
                />

              </div>

            </section>

            {/* BOTÓN BLUETOOTH */}

            {!bleData.connected && (
              <button
                onClick={connectBLE}
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#087f83] px-5 py-4 text-white shadow-[0_10px_25px_rgba(8,127,131,0.25)] transition hover:scale-[1.01] active:scale-[0.98]"
              >
                <IconBluetooth size={22} />

                <span className="font-black">
                  Conectar reloj NeuroWatch
                </span>
              </button>
            )}

            {/* ERROR */}

            {bleError && (
              <div className="rounded-2xl border border-[#c1272d]/30 bg-[#c1272d]/10 p-4">

                <p className="text-sm font-semibold text-[#c1272d]">
                  {bleError}
                </p>

              </div>
            )}

            {/* ESTADO */}

            {bleData.connected && bleData.bpm > 0 && (
              <HeroStatus state={status} />
            )}

            {/* SIGNOS EN VIVO */}

            <section className="rounded-[28px] border border-[#dfbf8e] bg-[#fff9ed] p-5 shadow-[0_12px_30px_rgba(72,48,25,0.08)]">

              <div className="mb-4 flex items-center justify-between">

                <h2 className="font-display text-2xl font-black uppercase text-[#075d63]">
                  Signos en vivo
                </h2>

                <span className="text-xs font-black text-[#2f8f5b]">
                  ● EN VIVO
                </span>

              </div>

              <div className="grid grid-cols-1 gap-3">

                <VitalCard
                  icon="❤️"
                  title="Frecuencia cardíaca"
                  value={bleData.bpm > 0 ? String(bleData.bpm) : "--"}
                  unit="ppm"
                />

              </div>

            </section>

            {/* ESPERANDO DATOS */}

            {bleData.connected && bleData.bpm === 0 && (
              <div className="rounded-[24px] border border-[#dfbf8e] bg-white/70 p-6 text-center shadow-sm">

                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#087f83]/10 text-2xl">
                  ❤️
                </div>

                <p className="font-semibold text-[#6b5842]">
                  Conectado al reloj.
                </p>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-[#8c7660]">
                  Coloca el dedo en el sensor para comenzar a recibir tus
                  datos de pulso.
                </p>

              </div>
            )}

            {/* GRÁFICA */}

            <PulseCard
              bpm={bleData.bpm}
              bars={pulseBars}
            />

            {/* RELOJ */}

            <DeviceCard
              connected={bleData.connected}
              signalStatus={
                bleData.connected
                  ? "Señal estable"
                  : "Sin conectar"
              }
              batteryPercent={Math.round(
                bleData.batteryPercent
              )}
            />

          </section>

          {/* =========================
              COLUMNA DERECHA
          ========================== */}

          <aside className="space-y-5">

            {/* ALERTAS */}

            <section className="overflow-hidden rounded-[30px] border border-[#dfbf8e] bg-[#fff9ed] shadow-[0_16px_40px_rgba(72,48,25,0.10)]">

              <div className="flex items-center justify-between bg-[#e85a20] px-5 py-4 text-white">

                <h2 className="font-display text-2xl font-black uppercase">
                  Alertas
                </h2>

                <span className="text-2xl">
                  🔔
                </span>

              </div>

              <div className="space-y-3 p-5">

                <AlertRow
                  icon="❤️"
                  title="Frecuencia alta"
                  description={
                    bleData.bpm > 0
                      ? `Frecuencia cardíaca: ${bleData.bpm} ppm`
                      : "Esperando datos del reloj."
                  }
                  time="EN VIVO"
                  type="danger"
                />

                <AlertRow
                  icon="⚠️"
                  title="Recuerda descansar"
                  description="Tómate un momento para relajarte."
                  time="09:15 AM"
                  type="warning"
                />

                <AlertRow
                  icon="✓"
                  title="¡Todo bien!"
                  description="Tus signos vitales están siendo monitoreados."
                  time="08:00 AM"
                  type="success"
                />

              </div>

              <div
                className="h-5"
                style={{ backgroundImage: textilePattern }}
              />

            </section>

            {/* HUARAZ */}

            <section className="relative overflow-hidden rounded-[30px] border border-[#dfbf8e] bg-[#eaf0dc] shadow-[0_16px_40px_rgba(72,48,25,0.10)]">

              <div className="relative min-h-[300px] p-6">

                <div className="absolute right-4 top-3 text-5xl">
                  ☀️
                </div>

                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c1440c]">
                  Nuestra tierra
                </p>

                <h2 className="mt-1 font-display text-4xl font-black uppercase text-[#075d63]">
                  Huaraz
                </h2>

                <p className="mt-1 max-w-[230px] text-sm font-bold leading-relaxed text-[#536456]">
                  Nuestra tierra,
                  <br />
                  nuestra fuerza.
                </p>

                {/* FOTO REAL PLAZA DE ARMAS */}

                <div className="absolute bottom-5 left-4 right-4 h-40 overflow-hidden rounded-3xl shadow-lg">

                  <img
                    src="https://d36tnp772eyphs.cloudfront.net/blogs/1/2019/07/Plaza-De-Armas-in-Peruvian-city-of-Huaraz.jpg"
                    alt="Plaza de Armas de Huaraz"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3">

                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                      Nuestra tierra
                    </p>

                    <p className="text-lg font-black text-white">
                      Huaraz
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* CONECTADO CONTIGO */}

            <section className="overflow-hidden rounded-[27px] border border-[#dfbf8e] bg-[#fff9ed] shadow-[0_12px_30px_rgba(72,48,25,0.08)]">

              <div className="p-5">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#087f83] text-2xl text-white">
                    🛡️
                  </div>

                  <div>

                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#087f83]">
                      NeuroWatch
                    </p>

                    <h2 className="font-display text-xl font-black uppercase">
                      Conectado contigo
                    </h2>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-[#087f83]/10 p-3">

                    <p className="text-[10px] font-bold text-[#6b5842]">
                      Estado
                    </p>

                    <p className="mt-1 text-sm font-black text-[#2f8f5b]">
                      {bleData.connected ? "ACTIVO" : "LISTO"}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-[#c1440c]/10 p-3">

                    <p className="text-[10px] font-bold text-[#6b5842]">
                      Batería
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {bleData.connected
                        ? `${Math.round(
                            bleData.batteryPercent
                          )}%`
                        : "--"}
                    </p>

                  </div>

                </div>

              </div>

              <div
                className="h-5"
                style={{ backgroundImage: textilePattern }}
              />

            </section>

          </aside>

        </div>

        {/* PIE CULTURAL */}

        <section className="mt-5 rounded-[28px] border border-[#dfbf8e] bg-[#fff9ed] p-5 shadow-[0_12px_30px_rgba(72,48,25,0.08)]">

          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">

            <CultureItem icon="❤️" text="Salud" />
            <CultureItem icon="🤝" text="Confianza" />
            <CultureItem icon="💡" text="Innovación" />
            <CultureItem icon="👥" text="Comunidad" />

          </div>

          <div
            className="h-5"
            style={{ backgroundImage: textilePattern }}
          />

        </section>

      </main>

      {/* ALERTA ORIGINAL */}

      <AlertModal
        open={alertOpen}
        remainingSeconds={countdownSeconds}
        totalSeconds={settings.countdownSeconds}
        contacts={contacts.map((c) => c.name)}
        onCancel={cancelAlert}
      />

    </div>
  );
}

/* =========================
   VITAL CARD
========================= */

function VitalCard({
  icon,
  title,
  value,
  unit,
}: {
  icon: string;
  title: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#e6cfa9] bg-[#fffaf0] p-4 shadow-sm">

      <div className="mb-2 text-2xl">
        {icon}
      </div>

      <p className="text-[11px] font-bold text-[#6b5842]">
        {title}
      </p>

      <p className="mt-1 text-2xl font-black text-[#263a32]">
        {value}
      </p>

      <p className="text-[10px] font-black text-[#a9967d]">
        {unit}
      </p>

    </div>
  );
}

/* =========================
   ALERT ROW
========================= */

function AlertRow({
  icon,
  title,
  description,
  time,
  type,
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
  type: "danger" | "warning" | "success";
}) {
  const styles = {
    danger: "bg-[#c1272d]/10",
    warning: "bg-[#e8a33d]/15",
    success: "bg-[#2f8f5b]/10",
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl p-3 ${styles[type]}`}
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-xl">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-start justify-between gap-2">

          <p className="text-xs font-black uppercase">
            {title}
          </p>

          <span className="shrink-0 text-[9px] font-bold text-[#8c7660]">
            {time}
          </span>

        </div>

        <p className="mt-1 text-[10px] leading-relaxed text-[#6b5842]">
          {description}
        </p>

      </div>

    </div>
  );
}

/* =========================
   CULTURE ITEM
========================= */

function CultureItem({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-[#f9f0df] p-3 text-center">

      <span className="text-2xl">
        {icon}
      </span>

      <span className="text-[11px] font-black uppercase text-[#3b2a1a]">
        {text}
      </span>

    </div>
  );
}
