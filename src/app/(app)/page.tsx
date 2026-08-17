"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  IconActivity,
  IconBluetooth,
} from "@/components/ui/icons";

import StatusChip from "@/components/ui/StatusChip";
import HeroStatus from "@/components/dashboard/HeroStatus";
import PulseCard from "@/components/dashboard/PulseCard";
import DeviceCard from "@/components/dashboard/DeviceCard";
import AlertModal from "@/components/alert/AlertModal";

import { useNeurowatch } from "@/components/NeurowatchProvider";

type Language = "es" | "qch";

export default function DashboardPage() {
  const router = useRouter();

  const {
    language,
    setLanguage,
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

  /* =========================================================
     DESCONEXIÓN
  ========================================================= */

  useEffect(() => {
    if (disconnectedSince) {
      router.replace("/desconectado");
    }
  }, [router, disconnectedSince]);

  /* =========================================================
     TEXTOS
  ========================================================= */

  const text =
    language === "es"
      ? {
          location: "HUARAZ · ÁNCASH · PERÚ",
          subtitle: "Tecnología que cuida tu vida",
          mission: "con raíces que nos unen",

          home: "Inicio",
          history: "Historial",
          alerts: "Alertas",
          profile: "Perfil",

          monitoring: "TU MONITOREO",
          welcome: "Tu bienestar, nuestra misión.",

          deviceStatus: "ESTADO DEL DISPOSITIVO",
          active: "MONITOREO ACTIVO",
          waiting: "ESPERANDO CONEXIÓN",

          live: "EN VIVO",
          offline: "SIN CONEXIÓN",

          connect: "CONECTAR RELOJ NEUROWATCH",

          current: "ESTADO ACTUAL",
          monitoringActive: "Monitoreo activo",
          connected: "Reloj conectado",

          putFinger:
            "Coloca el dedo sobre el sensor para comenzar a recibir tu pulso.",

          signs: "SIGNOS EN VIVO",
          heart: "Frecuencia cardíaca",

          pulse: "Pulso en vivo",
          bpm: "ppm",

          device: "NEUROWATCH RELOJ",
          deviceName: "NeuroWatch",
          stable: "Señal estable",
          noConnection: "Sin conexión",

          intelligent: "Detección inteligente",
          intelligentDescription:
            "Tecnología que analiza tus señales en tiempo real.",

          connection: "Conexión",
          bluetooth: "Bluetooth activo",
          pending: "Pendiente",

          made: "HECHO DESDE ÁNCASH",
          identity: "Tecnología con identidad andina",

          health: "Salud",
          trust: "Confianza",
          innovation: "Innovación",
          community: "Comunidad",
          tradition: "Tradición",

          why: "¿POR QUÉ NEUROWATCH?",

          why1Title: "MONITOREO EN TIEMPO REAL",
          why1Text: "Cuida tu corazón cada segundo.",

          why2Title: "TECNOLOGÍA CON PROPÓSITO",
          why2Text: "Innovación que busca mejorar vidas en Huaraz.",

          why3Title: "CONECTADO CONTIGO",
          why3Text: "Información disponible cuando la necesitas.",

          why4Title: "HECHO PARA NUESTRA GENTE",
          why4Text: "Diseñado pensando en nuestra tierra.",

          alertsTitle: "ALERTAS",

          assistive:
            "Herramienta asistiva · No diagnostica ni sustituye la atención profesional.",

          languageSpanish: "ESPAÑOL",
          languageQuechua: "QUECHUA",
        }
      : {
          location: "WARAS · ANQASH · PIRUW",
          subtitle: "Kawsaykita waqaychay yachay",
          mission: "Sapinchiskunawan tinkisqa",

          home: "Qallariy",
          history: "Ñawpaq rikay",
          alerts: "Qatiq willakuy",
          profile: "Runapa willaynin",

          monitoring: "QAMPA RIKAYNIKI",
          welcome: "Kawsayniki, llapa munayninchik.",

          deviceStatus: "DISPOSITIVOPA KAYNIN",
          active: "RIKAYKUNA LLAMK'ACHKAN",
          waiting: "TINKIYTA SUYARICHKAN",

          live: "KAWSACHKAN",
          offline: "MANA TINKISQA",

          connect: "NEUROWATCH RELOJWAN TINKIY",

          current: "KUNAN KAYNIN",
          monitoringActive: "Rikaykuna llamk'achkan",
          connected: "Reloj tinkisqa",

          putFinger:
            "Ruk'aykita sensorpa hawanman churay, puywaykita chaskinapaq.",

          signs: "KAWSAYPA WILLAYNINKUNA",
          heart: "Shunqupa puywaynin",

          pulse: "Puyway kawsachkan",
          bpm: "puyway/min",

          device: "NEUROWATCH RELOJ",
          deviceName: "NeuroWatch",
          stable: "Willakuy allinmi",
          noConnection: "Mana tinkisqa",

          intelligent: "Yachaywan rikay",
          intelligentDescription:
            "Yachaywan qampa willaykikunata pacha-pachapi rikachkan.",

          connection: "Tinkiy",
          bluetooth: "Bluetooth llamk'achkan",
          pending: "Suyarichkan",

          made: "ANQASHMANTA RURASQA",
          identity: "Andino yachaywan tecnología",

          health: "Kawsay",
          trust: "Sulpay",
          innovation: "Musuq yachay",
          community: "Ayllu",
          tradition: "Ñawpa yachay",

          why: "¿IMARAYKUN NEUROWATCH?",

          why1Title: "PACHA-PACHA RIKAY",
          why1Text: "Shunquta sapa kuti waqaychay.",

          why2Title: "YACHAY MUNAYNIYUQ",
          why2Text: "Musuq yachay Huaraspi kawsaykunata yanapan.",

          why3Title: "QAMWAN TINKISQA",
          why3Text: "Willaykikunata munasqaykipi chaskiy.",

          why4Title: "RUNAKUNAPAQ RURASQA",
          why4Text: "Llaqtanchikta yuyarispa rurasqa.",

          alertsTitle: "QATIQ WILLAKUY",

          assistive:
            "Yanapakuq sistema · Mana hampiqchu, hampiqpa yanayninta mana rantinchu.",

          languageSpanish: "ESPAÑOL",
          languageQuechua: "QUECHUA",
        };

  const connected = bleData.connected;

  const connStatus = connected
    ? ("ok" as const)
    : ("muted" as const);

  const connLabel = connected
    ? language === "es"
      ? "Conectado"
      : "Tinkisqa"
    : language === "es"
      ? "Desconectado"
      : "Mana tinkisqa";

  /* =========================================================
     CAMBIO DE IDIOMA
  ========================================================= */

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "neurowatch-language",
        newLanguage
      );

      window.dispatchEvent(
        new CustomEvent("neurowatch-language-change", {
          detail: newLanguage,
        })
      );
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFF8E8] text-[#173E43]">

      {/* =====================================================
          DECORACIÓN DE FONDO
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Sol */}
        <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-[#F6B21A]/20 blur-2xl" />

        {/* Luz turquesa */}
        <div className="absolute right-[-80px] top-[20%] h-72 w-72 rounded-full bg-[#18A6A6]/15 blur-3xl" />

        {/* Luz naranja */}
        <div className="absolute bottom-[10%] left-[-100px] h-80 w-80 rounded-full bg-[#F15A24]/10 blur-3xl" />

        {/* Montañas de fondo */}
        <svg
          className="absolute bottom-0 left-0 h-[250px] w-full opacity-[0.10]"
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
        >
          <path
            d="M0 260L130 120L220 205L370 45L520 220L690 90L830 220L1010 35L1180 205L1310 90L1440 210V300H0Z"
            fill="#167C80"
          />
        </svg>
      </div>

      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-4 sm:px-6 md:pb-10 md:pt-7">

        {/* ===================================================
            FRANJA TEXTIL SUPERIOR
        =================================================== */}

        <div className="mb-4 overflow-hidden rounded-2xl border-2 border-[#E8A31A] bg-[#174B4F] shadow-lg">

          <div className="flex h-8 items-center justify-center gap-2 overflow-hidden">

            {Array.from({ length: 22 }).map((_, index) => (
              <div
                key={index}
                className="flex h-6 w-8 shrink-0 items-center justify-center"
              >
                <div
                  className={`h-5 w-5 rotate-45 border-2 ${
                    index % 4 === 0
                      ? "border-[#E63824]"
                      : index % 4 === 1
                        ? "border-[#F6B21A]"
                        : index % 4 === 2
                          ? "border-[#20A58A]"
                          : "border-[#F4E2B8]"
                  }`}
                />
              </div>
            ))}

          </div>
        </div>

        {/* ===================================================
            ENCABEZADO
        =================================================== */}

        <header className="rounded-[30px] border-2 border-[#E7D3A5] bg-[#FFFDF5] p-4 shadow-[0_10px_35px_rgba(67,51,20,0.12)] sm:p-5">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            {/* Logo */}

            <div className="flex items-center gap-4">

              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[#F5E7C5] shadow-inner">

                <div className="text-4xl">
                  ☀️
                </div>

                <span className="absolute bottom-[-4px] left-2 text-xl">
                  🏔️
                </span>

              </div>

              <div>

                <h1 className="text-3xl font-black tracking-[-0.04em] text-[#124E52] sm:text-4xl">
                  NeuroWatch
                </h1>

                <p className="mt-0.5 text-[11px] font-black uppercase tracking-[0.15em] text-[#E34B27]">
                  {text.location}
                </p>

                <p className="mt-1 text-xs font-bold text-[#59716D]">
                  {text.subtitle}
                </p>

              </div>
            </div>

            {/* =================================================
                BOTONES DE IDIOMA GRANDES
            ================================================= */}

            <div className="rounded-2xl border-2 border-[#E7D3A5] bg-[#FFF4D8] p-1.5 shadow-sm">

              <div className="flex">

                <button
                  type="button"
                  onClick={() => changeLanguage("es")}
                  className={`min-h-12 rounded-xl px-5 text-xs font-black transition-all sm:px-7 ${
                    language === "es"
                      ? "bg-[#168B84] text-white shadow-md"
                      : "text-[#69452C] hover:bg-white"
                  }`}
                >
                  🇵🇪 {text.languageSpanish}
                </button>

                <button
                  type="button"
                  onClick={() => changeLanguage("qch")}
                  className={`min-h-12 rounded-xl px-5 text-xs font-black transition-all sm:px-7 ${
                    language === "qch"
                      ? "bg-[#E94B27] text-white shadow-md"
                      : "text-[#69452C] hover:bg-white"
                  }`}
                >
                  🏔️ {text.languageQuechua}
                </button>

              </div>

            </div>

          </div>

          {/* Navegación visual */}

          <div className="mt-5 grid grid-cols-4 gap-2 border-t border-[#EADCBF] pt-3">

            {[
              {
                icon: "⌂",
                label: text.home,
                active: true,
              },
              {
                icon: "▣",
                label: text.history,
                active: false,
              },
              {
                icon: "🔔",
                label: text.alerts,
                active: false,
              },
              {
                icon: "●",
                label: text.profile,
                active: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex flex-col items-center justify-center rounded-xl py-2 ${
                  item.active
                    ? "bg-[#168B84] text-white"
                    : "text-[#58716D]"
                }`}
              >
                <span className="text-lg leading-none">
                  {item.icon}
                </span>

                <span className="mt-1 text-[9px] font-black">
                  {item.label}
                </span>
              </div>
            ))}

          </div>

        </header>

        {/* ===================================================
            HERO PRINCIPAL
        =================================================== */}

        <section className="relative mt-5 overflow-hidden rounded-[32px] border-2 border-[#E6D3A4] bg-[#FFFDF5] shadow-[0_15px_45px_rgba(66,53,27,0.14)]">

          {/* Decoración superior */}

          <div className="absolute right-5 top-4 text-4xl opacity-80">
            ☀️
          </div>

          <div className="absolute bottom-4 right-4 text-4xl opacity-10">
            🏔️
          </div>

          <div className="relative p-5 sm:p-7">

            <div className="max-w-2xl">

              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#E64A26]">
                {text.monitoring}
              </p>

              <h2 className="mt-2 max-w-xl text-3xl font-black leading-tight text-[#174D50] sm:text-4xl">
                {text.welcome}
              </h2>

            </div>

            {/* =================================================
                CORAZÓN + PULSO
            ================================================= */}

            <div className="relative mt-6 overflow-hidden rounded-[28px] bg-[#FFF3D8] p-5">

              <div className="flex flex-col items-center justify-center">

                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#168B84]">
                  {text.pulse}
                </p>

                <div className="relative mt-2 flex h-40 w-40 items-center justify-center">

                  {/* ondas */}

                  <div className="absolute h-40 w-40 animate-pulse rounded-full border-2 border-[#E94B27]/20" />

                  <div className="absolute h-32 w-32 rounded-full border-2 border-[#F3A712]/30" />

                  {/* corazón */}

                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#E94B27] text-white shadow-[0_12px_35px_rgba(233,75,39,0.30)]">

                    <div className="text-center">

                      <div className="text-5xl leading-none">
                        ♥
                      </div>

                      <div className="mt-1 text-2xl font-black">
                        {bleData.bpm > 0
                          ? bleData.bpm
                          : "--"}
                      </div>

                      <div className="text-[10px] font-black">
                        {text.bpm}
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* Línea ECG */}

              <div className="mt-2 h-12 overflow-hidden">

                <svg
                  viewBox="0 0 700 80"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 45 H80 L105 45 L120 15 L137 65 L153 45 H230 L250 45 L267 30 L280 55 L295 45 H380 L400 45 L418 12 L435 68 L452 45 H540 L560 45 L575 25 L590 60 L605 45 H700"
                    fill="none"
                    stroke="#168B84"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              </div>

            </div>

            {/* =================================================
                ESTADO ACTUAL
            ================================================= */}

            {connected && bleData.bpm > 0 && (
              <div className="mt-4 rounded-2xl border-2 border-[#E9D8B2] bg-white p-4">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-black uppercase tracking-wider text-[#168B84]">
                      {text.current}
                    </p>

                    <p className="mt-1 text-base font-black text-[#174D50]">
                      {text.monitoringActive}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F5E9] text-xl">
                    ❤️
                  </div>

                </div>

                <div className="mt-3">
                  <HeroStatus state={status} />
                </div>

              </div>
            )}

            {/* Esperando sensor */}

            {connected && bleData.bpm === 0 && (
              <div className="mt-4 rounded-2xl border-2 border-[#E9D8B2] bg-white p-6 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0DD] text-3xl">
                  ❤️
                </div>

                <p className="mt-3 text-base font-black text-[#174D50]">
                  {text.connected}
                </p>

                <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#65736F]">
                  {text.putFinger}
                </p>

              </div>
            )}

          </div>

          {/* Montañas */}

          <div className="h-16 overflow-hidden bg-[#E5F0E8]">

            <svg
              viewBox="0 0 900 100"
              className="h-full w-full"
              preserveAspectRatio="none"
            >

              <path
                d="M0 100 L120 45 L180 75 L270 10 L360 75 L470 25 L570 78 L680 12 L790 70 L900 35 V100Z"
                fill="#75A99A"
              />

              <path
                d="M0 100 L120 45 L180 75 L270 10 L360 75 L470 25 L570 78 L680 12 L790 70 L900 35 V100Z"
                fill="#167C80"
                opacity="0.55"
                transform="translate(0 12)"
              />

            </svg>

          </div>

        </section>

        {/* ===================================================
            BOTÓN CONECTAR
        =================================================== */}

        {!connected && (
          <button
            type="button"
            onClick={connectBLE}
            className="mt-4 flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#174D50] px-5 text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#123F42] active:scale-[0.98]"
          >

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <IconBluetooth size={22} />
            </span>

            <span className="text-sm font-black">
              {text.connect}
            </span>

          </button>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {bleError && (
          <div className="mt-4 rounded-2xl border-2 border-[#E94B27]/20 bg-[#FFF0EA] p-4">

            <div className="flex items-center gap-3">

              <span className="text-xl">
                ⚠️
              </span>

              <p className="text-xs font-bold text-[#C63B20]">
                {bleError}
              </p>

            </div>

          </div>
        )}

        {/* ===================================================
            SIGNOS EN VIVO
        =================================================== */}

        <section className="mt-5">

          <div className="mb-3 flex items-end justify-between">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E94B27]">
                {text.signs}
              </p>

              <h2 className="mt-1 text-2xl font-black text-[#174D50]">
                {text.heart}
              </h2>

            </div>

            <span className="rounded-full bg-[#E8F5E9] px-3 py-2 text-[9px] font-black text-[#168B84]">
              ♥ {text.live}
            </span>

          </div>

          <div className="overflow-hidden rounded-[28px] border-2 border-[#E8D6AC] bg-[#FFFDF5] shadow-lg">

            <PulseCard
              bpm={bleData.bpm}
              bars={pulseBars}
            />

          </div>

        </section>

        {/* ===================================================
            DISPOSITIVO
        =================================================== */}

        <section className="mt-5">

          <div className="mb-3 flex items-center justify-between">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#168B84]">
                {text.device}
              </p>

              <h2 className="mt-1 text-2xl font-black text-[#174D50]">
                {text.deviceName}
              </h2>

            </div>

            <span className="text-3xl">
              ⌚
            </span>

          </div>

          <div className="overflow-hidden rounded-[28px] border-2 border-[#E8D6AC] bg-[#FFFDF5] shadow-lg">

            <DeviceCard
              connected={connected}
              signalStatus={
                connected
                  ? text.stable
                  : text.noConnection
              }
              batteryPercent={Math.round(
                bleData.batteryPercent
              )}
            />

          </div>

        </section>

        {/* ===================================================
            TARJETAS
        =================================================== */}

        <div className="mt-5 grid grid-cols-2 gap-3">

          <div className="rounded-[24px] border-2 border-[#CDE3D9] bg-[#EAF6EE] p-4 shadow-md">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#168B84] text-xl text-white">
              🧠
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-[#59807A]">
              NeuroWatch
            </p>

            <p className="mt-1 text-sm font-black text-[#174D50]">
              {text.intelligent}
            </p>

            <p className="mt-2 text-[10px] leading-relaxed text-[#66807B]">
              {text.intelligentDescription}
            </p>

          </div>

          <div className="rounded-[24px] border-2 border-[#F0D6A1] bg-[#FFF3D8] p-4 shadow-md">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F3A712] text-xl text-white">
              📡
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B7048]">
              {text.connection}
            </p>

            <p className="mt-1 text-sm font-black text-[#174D50]">
              {connected
                ? text.bluetooth
                : text.pending}
            </p>

          </div>

        </div>

        {/* ===================================================
            ¿POR QUÉ NEUROWATCH?
        =================================================== */}

        <section className="mt-5 overflow-hidden rounded-[28px] border-2 border-[#E6D2A4] bg-[#FFFDF5] shadow-lg">

          <div className="bg-[#E94B27] px-5 py-4 text-white">

            <h2 className="text-lg font-black">
              {text.why}
            </h2>

          </div>

          <div className="p-4">

            {[
              {
                icon: "❤️",
                title: text.why1Title,
                description: text.why1Text,
                bg: "bg-[#FFF0EA]",
              },
              {
                icon: "⚙️",
                title: text.why2Title,
                description: text.why2Text,
                bg: "bg-[#E9F6F4]",
              },
              {
                icon: "🛡️",
                title: text.why3Title,
                description: text.why3Text,
                bg: "bg-[#FFF5D9]",
              },
              {
                icon: "🏔️",
                title: text.why4Title,
                description: text.why4Text,
                bg: "bg-[#EAF4E9]",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 border-b border-[#EDE1C7] py-4 last:border-b-0"
              >

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${item.bg}`}
                >
                  {item.icon}
                </div>

                <div>

                  <p className="text-xs font-black text-[#174D50]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-[#65736F]">
                    {item.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* ===================================================
            IDENTIDAD HUARACINA
        =================================================== */}

        <section className="relative mt-5 overflow-hidden rounded-[30px] border-2 border-[#D7C48E] bg-[#FFF0C9] shadow-xl">

          <div className="absolute right-[-20px] top-[-15px] text-8xl opacity-10">
            🦙
          </div>

          <div className="absolute bottom-[-20px] left-[-10px] text-8xl opacity-10">
            🏔️
          </div>

          <div className="relative p-6">

            <div className="flex flex-col items-center text-center">

              <div className="text-5xl">
                ☀️
              </div>

              <p className="mt-2 text-[11px] font-black uppercase tracking-[0.25em] text-[#E94B27]">
                {text.made}
              </p>

              <h2 className="mt-1 text-3xl font-black text-[#174D50]">
                HUARAZ
              </h2>

              <p className="mt-1 max-w-md text-sm font-bold text-[#63766D]">
                {text.identity}
              </p>

              {/* Montañas */}

              <div className="mt-4 w-full max-w-xl">

                <svg
                  viewBox="0 0 700 120"
                  className="h-24 w-full"
                  preserveAspectRatio="none"
                >

                  <path
                    d="M0 115L90 55L140 80L235 10L330 85L420 35L510 90L600 25L700 75V120H0Z"
                    fill="#168B84"
                  />

                  <path
                    d="M235 10L205 35L225 30L235 45L250 28L270 42L260 25Z"
                    fill="#FFFDF5"
                  />

                  <path
                    d="M600 25L575 50L595 43L610 55L625 40L645 52L635 34Z"
                    fill="#FFFDF5"
                  />

                </svg>

              </div>

              {/* Franja de colores */}

              <div className="mt-2 flex w-full gap-1">

                <span className="h-2 flex-1 rounded-full bg-[#D92820]" />
                <span className="h-2 flex-1 rounded-full bg-[#F07820]" />
                <span className="h-2 flex-1 rounded-full bg-[#F4B51A]" />
                <span className="h-2 flex-1 rounded-full bg-[#2D9C57]" />
                <span className="h-2 flex-1 rounded-full bg-[#168B84]" />
                <span className="h-2 flex-1 rounded-full bg-[#174D50]" />

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            VALORES
        =================================================== */}

        <section className="mt-5 rounded-[28px] border-2 border-[#E7D3A5] bg-[#FFFDF5] p-4 shadow-lg">

          <div className="grid grid-cols-5 gap-1">

            {[
              {
                icon: "❤️",
                label: text.health,
                bg: "bg-[#E94B27]",
              },
              {
                icon: "🤝",
                label: text.trust,
                bg: "bg-[#168B84]",
              },
              {
                icon: "💡",
                label: text.innovation,
                bg: "bg-[#F3A712]",
              },
              {
                icon: "👥",
                label: text.community,
                bg: "bg-[#3C9D45]",
              },
              {
                icon: "◆",
                label: text.tradition,
                bg: "bg-[#D85B2A]",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center"
              >

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-lg text-white ${item.bg}`}
                >
                  {item.icon}
                </div>

                <span className="mt-2 text-[9px] font-black text-[#526762]">
                  {item.label}
                </span>

              </div>
            ))}

          </div>

        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="mt-6 pb-5 text-center">

          <div className="mb-4 flex items-center justify-center gap-1">

            <span className="h-2 w-8 rounded-full bg-[#D92820]" />
            <span className="h-2 w-8 rounded-full bg-[#F07820]" />
            <span className="h-2 w-8 rounded-full bg-[#F4B51A]" />
            <span className="h-2 w-8 rounded-full bg-[#2D9C57]" />
            <span className="h-2 w-8 rounded-full bg-[#168B84]" />

          </div>

          <p className="mx-auto max-w-xl text-[9px] font-semibold leading-relaxed text-[#75827D]">
            {text.assistive}
          </p>

          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#174D50]">
            🏔️ HUARAZ · ÁNCASH · PERÚ
          </p>

        </footer>

        {/* ===================================================
            ALERTA
        =================================================== */}

        <AlertModal
          open={alertOpen}
          remainingSeconds={countdownSeconds}
          totalSeconds={settings.countdownSeconds}
          contacts={contacts.map((c) => c.name)}
          onCancel={cancelAlert}
        />

      </main>
    </div>
  );
}
