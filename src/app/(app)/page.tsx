"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { IconBluetooth } from "@/components/ui/icons";

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

          monitoring: "TU MONITOREO",
          welcome: "Tu bienestar, nuestra misión.",

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
          why2Text:
            "Innovación que busca mejorar vidas en Huaraz.",

          why3Title: "CONECTADO CONTIGO",
          why3Text:
            "Información disponible cuando la necesitas.",

          why4Title: "HECHO PARA NUESTRA GENTE",
          why4Text:
            "Diseñado pensando en nuestra tierra.",

          assistive:
            "Herramienta asistiva · No diagnostica ni sustituye la atención profesional.",

          languageSpanish: "ESPAÑOL",
          languageQuechua: "QUECHUA",

          connect: "CONECTAR RELOJ NEUROWATCH",
          live: "EN VIVO",
        }
      : {
          location: "WARAS · ANQASH · PIRUW",
          subtitle: "Kawsaykita waqaychay yachay",
          mission: "Sapinchiskunawan tinkisqa",

          monitoring: "QAMPA RIKAYNIKI",
          welcome: "Kawsayniki, llapa munayninchik.",

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
          why2Text:
            "Musuq yachay Huaraspi kawsaykunata yanapan.",

          why3Title: "QAMWAN TINKISQA",
          why3Text:
            "Willaykikunata munasqaykipi chaskiy.",

          why4Title: "RUNAKUNAPAQ RURASQA",
          why4Text:
            "Llaqtanchikta yuyarispa rurasqa.",

          assistive:
            "Yanapakuq sistema · Mana hampiqchu, hampiqpa yanayninta mana rantinchu.",

          languageSpanish: "ESPAÑOL",
          languageQuechua: "QUECHUA",

          connect: "NEUROWATCH RELOJWAN TINKIY",
          live: "KAWSACHKAN",
        };

  const connected = bleData.connected;

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
    <div className="min-h-screen overflow-x-hidden bg-[#F8FDFF] text-[#203447]">

      {/* =====================================================
          FONDO
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Sol */}
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#F5C542]/20 blur-3xl" />

        {/* Luz celeste */}
        <div className="absolute -left-32 top-[15%] h-72 w-72 rounded-full bg-[#19A9C7]/10 blur-3xl" />

        {/* Luz verde */}
        <div className="absolute right-[-100px] top-[48%] h-80 w-80 rounded-full bg-[#2E9B62]/10 blur-3xl" />

        {/* Luz naranja */}
        <div className="absolute bottom-[8%] left-[-100px] h-80 w-80 rounded-full bg-[#F28C28]/10 blur-3xl" />

        {/* Montañas */}
        <svg
          className="absolute bottom-0 left-0 h-[250px] w-full opacity-[0.10]"
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
        >
          <path
            d="M0 260L130 120L220 205L370 45L520 220L690 90L830 220L1010 35L1180 205L1310 90L1440 210V300H0Z"
            fill="#2877B8"
          />

          <path
            d="M0 280L160 180L260 230L420 120L560 250L720 155L880 250L1040 135L1210 235L1340 160L1440 220V300H0Z"
            fill="#2E9B62"
          />
        </svg>

      </div>

      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 px-4 pb-20 pt-5 sm:px-6 md:pt-8">

        {/* ===================================================
            UBICACIÓN + IDIOMA
        =================================================== */}

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-2">

            <span className="text-2xl">
              🏔️
            </span>

            <span className="text-[10px] font-black tracking-[0.13em] text-[#17324D]">
              {text.location}
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="hidden text-[9px] font-black text-[#80909B] sm:block">
              IDIOMA
            </span>

            <div className="flex rounded-2xl border border-[#D6E5E8] bg-white p-1 shadow-sm">

              <button
                type="button"
                onClick={() => changeLanguage("es")}
                className={`rounded-xl px-3 py-2 text-[9px] font-black transition ${
                  language === "es"
                    ? "bg-[#EF3E32] text-white shadow"
                    : "text-[#71808B] hover:bg-[#EDF7F8]"
                }`}
              >
                🇵🇪 {text.languageSpanish}
              </button>

              <button
                type="button"
                onClick={() => changeLanguage("qch")}
                className={`rounded-xl px-3 py-2 text-[9px] font-black transition ${
                  language === "qch"
                    ? "bg-[#F28C28] text-white shadow"
                    : "text-[#71808B] hover:bg-[#FFF6E7]"
                }`}
              >
                🏔️ {text.languageQuechua}
              </button>

            </div>

          </div>

        </div>

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#EF3E32] via-[#F28C28] to-[#F5C542] text-3xl shadow-[0_10px_25px_rgba(239,62,50,0.25)]">

              🫀

              <span className="absolute right-[-3px] top-[-3px] h-3.5 w-3.5 rounded-full border-[3px] border-white bg-[#2E9B62]" />

            </div>

            <div>

              <h1 className="text-[27px] font-black tracking-[-0.04em] text-[#17324D]">
                NeuroWatch
              </h1>

              <p className="mt-0.5 text-[11px] font-bold text-[#7B8994]">
                {text.subtitle}
              </p>

            </div>

          </div>

          <div className="hidden text-right sm:block">

            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6F7F8D]">
              ÁNCASH
            </p>

            <p className="mt-1 text-xs font-black text-[#17324D]">
              {text.mission}
            </p>

          </div>

        </header>

        {/* ===================================================
            FRANJA ANDINA
        =================================================== */}

        <div className="overflow-hidden rounded-full">

          <div className="flex h-2">

            <span className="flex-1 bg-[#EF3E32]" />
            <span className="flex-1 bg-[#F28C28]" />
            <span className="flex-1 bg-[#F5C542]" />
            <span className="flex-1 bg-[#2E9B62]" />
            <span className="flex-1 bg-[#19A9C7]" />
            <span className="flex-1 bg-[#2877B8]" />

          </div>

        </div>

        <div className="flex items-center justify-center gap-3 py-1">

          <span className="text-[9px] font-black tracking-[0.18em] text-[#607583]">
            HUARAZ
          </span>

          <span className="text-[#F28C28]">
            ◆
          </span>

          <span className="text-[9px] font-black tracking-[0.18em] text-[#607583]">
            NEUROWATCH
          </span>

        </div>

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#174F72] via-[#177C8F] to-[#1C9B79] text-white shadow-[0_20px_45px_rgba(23,79,114,0.24)]">

          <div className="absolute inset-0 opacity-[0.10]">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#F5C542] blur-2xl" />
            <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#EF3E32] blur-2xl" />
          </div>

          <div className="relative p-6 sm:p-8">

            <div className="flex items-start justify-between gap-4">

              <div>

                <span className="text-[10px] font-black tracking-[0.2em] text-[#BCECF0]">
                  {text.monitoring}
                </span>

                <h2 className="mt-2 max-w-xl text-[29px] font-black leading-[1.08] tracking-[-0.03em] sm:text-[34px]">
                  {text.welcome}
                </h2>

              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] border border-white/20 bg-white/10 text-3xl backdrop-blur">
                ⌚
              </div>

            </div>

            {/* Montañas decorativas */}

            <div className="mt-6 h-14 overflow-hidden rounded-2xl bg-white/10">

              <svg
                viewBox="0 0 900 100"
                className="h-full w-full"
                preserveAspectRatio="none"
              >

                <path
                  d="M0 100L100 50L160 78L260 15L350 80L470 30L570 82L680 12L790 70L900 35V100Z"
                  fill="rgba(255,255,255,0.13)"
                />

                <path
                  d="M0 100L100 50L160 78L260 15L350 80L470 30L570 82L680 12L790 70L900 35"
                  fill="none"
                  stroke="rgba(255,255,255,0.75)"
                  strokeWidth="2"
                />

              </svg>

            </div>

            {/* Estado */}

            <div className="mt-5 flex items-end justify-between gap-4">

              <div>

                <span className="text-[11px] text-white/60">
                  {text.connected}
                </span>

                <strong className="mt-1 flex items-center gap-2 text-sm">

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      connected
                        ? "animate-pulse bg-[#7DF2B0]"
                        : "bg-white/40"
                    }`}
                  />

                  {connected
                    ? text.stable
                    : text.noConnection}

                </strong>

              </div>

              <span className="rounded-full bg-white/10 px-3 py-2 text-[9px] font-black">
                {connected
                  ? text.live
                  : "OFFLINE"}
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            CONECTAR
        =================================================== */}

        {!connected && (
          <button
            type="button"
            onClick={connectBLE}
            className="flex min-h-16 w-full items-center justify-center gap-3 rounded-[20px] bg-gradient-to-br from-[#17324D] to-[#22668B] px-5 text-white shadow-[0_12px_25px_rgba(23,50,77,0.20)] transition hover:-translate-y-0.5 active:scale-[0.98]"
          >

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <IconBluetooth size={21} />
            </span>

            <span className="text-sm font-black">
              {text.connect}
            </span>

            <span className="ml-auto text-xl opacity-50">
              →
            </span>

          </button>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {bleError && (
          <div className="flex items-center gap-3 rounded-[18px] border border-[#FFC9C5] bg-[#FFF4F2] p-4">

            <span className="text-xl">
              ⚠️
            </span>

            <p className="text-xs font-bold text-[#C7352C]">
              {bleError}
            </p>

          </div>
        )}

        {/* ===================================================
            ESTADO ACTUAL
        =================================================== */}

        <section className="rounded-[27px] border border-white bg-white/90 p-4 shadow-[0_10px_30px_rgba(34,60,76,0.09)] backdrop-blur">

          <div className="mb-3 flex items-center justify-between">

            <div>

              <span className="text-[10px] font-black tracking-[0.17em] text-[#2877B8]">
                {text.current}
              </span>

              <h2 className="mt-1 text-lg font-black text-[#17324D]">
                {connected
                  ? text.monitoringActive
                  : text.noConnection}
              </h2>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#FFF0EE] text-xl">
              ❤️
            </div>

          </div>

          {connected && bleData.bpm > 0 ? (
            <HeroStatus state={status} />
          ) : (
            <div className="rounded-[20px] bg-gradient-to-br from-[#E2F8FB] to-[#FFF1DF] px-5 py-7 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
                ❤️
              </div>

              <h3 className="mt-3 text-base font-black text-[#17324D]">
                {connected
                  ? text.connected
                  : text.noConnection}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#75838D]">
                {connected
                  ? text.putFinger
                  : text.connect}
              </p>

              <div className="mx-auto mt-5 h-1 w-24 animate-pulse rounded-full bg-gradient-to-r from-[#19A9C7] via-[#2E9B62] to-[#EF3E32]" />

            </div>
          )}

        </section>

        {/* ===================================================
            SIGNOS EN VIVO
        =================================================== */}

        <section>

          <div className="mb-3 flex items-end justify-between px-1">

            <div>

              <p className="text-[10px] font-black tracking-[0.2em] text-[#19A9C7]">
                {text.signs}
              </p>

              <h2 className="mt-1 text-lg font-black text-[#17324D]">
                {text.heart}
              </h2>

            </div>

            <span className="rounded-full bg-[#FFF0EE] px-3 py-2 text-[9px] font-black text-[#EF3E32]">
              ♥ {text.live}
            </span>

          </div>

          <div className="overflow-hidden rounded-[27px] border border-white bg-white/90 shadow-[0_10px_30px_rgba(34,60,76,0.09)]">

            <PulseCard
              bpm={bleData.bpm}
              bars={pulseBars}
            />

          </div>

        </section>

        {/* ===================================================
            DISPOSITIVO
        =================================================== */}

        <section>

          <div className="mb-3 flex items-end justify-between px-1">

            <div>

              <p className="text-[10px] font-black tracking-[0.2em] text-[#2E9B62]">
                {text.device}
              </p>

              <h2 className="mt-1 text-lg font-black text-[#17324D]">
                {text.deviceName}
              </h2>

            </div>

            <span className="text-3xl">
              ⌚
            </span>

          </div>

          <div className="overflow-hidden rounded-[27px] border border-white bg-white/90 shadow-[0_10px_30px_rgba(34,60,76,0.09)]">

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

        <div className="grid grid-cols-2 gap-3">

          <div className="min-h-[145px] rounded-[23px] border border-[#B9E8EF] bg-gradient-to-br from-[#E6F9FC] to-[#D9F2F8] p-4 shadow-[0_9px_24px_rgba(34,60,76,0.08)]">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[13px] bg-white text-xl shadow-sm">
              🧠
            </div>

            <span className="text-[9px] font-bold text-[#84929A]">
              NEUROWATCH
            </span>

            <p className="mt-1 text-sm font-black leading-tight text-[#17324D]">
              {text.intelligent}
            </p>

            <p className="mt-2 text-[10px] leading-relaxed text-[#66807B]">
              {text.intelligentDescription}
            </p>

          </div>

          <div className="min-h-[145px] rounded-[23px] border border-[#FFE59B] bg-gradient-to-br from-[#FFF7D9] to-[#FFF0C3] p-4 shadow-[0_9px_24px_rgba(34,60,76,0.08)]">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[13px] bg-white text-xl shadow-sm">
              📡
            </div>

            <span className="text-[9px] font-bold text-[#84929A]">
              {text.connection}
            </span>

            <p className="mt-1 text-sm font-black leading-tight text-[#17324D]">
              {connected
                ? text.bluetooth
                : text.pending}
            </p>

          </div>

        </div>

        {/* ===================================================
            POR QUÉ NEUROWATCH
        =================================================== */}

        <section className="overflow-hidden rounded-[27px] border border-white bg-white/90 shadow-[0_10px_30px_rgba(34,60,76,0.09)]">

          <div className="bg-gradient-to-r from-[#EF3E32] to-[#F28C28] px-5 py-4 text-white">

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
                bg: "bg-[#FFF0EE]",
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

                  <p className="text-xs font-black text-[#17324D]">
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
            IDENTIDAD HUARAZ
        =================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-[#F4D68C] bg-gradient-to-br from-[#FFF9E8] via-white to-[#FFF0E8] p-6 shadow-[0_10px_28px_rgba(91,71,30,0.08)]">

          <div className="absolute right-[-15px] top-[-25px] text-8xl opacity-[0.07]">
            🏔️
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#F28C28] to-[#F5C542] text-2xl shadow-[0_8px_18px_rgba(242,140,40,0.20)]">
              ☀️
            </div>

            <span className="mt-3 text-[9px] font-black tracking-[0.17em] text-[#C47C16]">
              {text.made}
            </span>

            <h2 className="mt-1 text-3xl font-black text-[#17324D]">
              HUARAZ
            </h2>

            <p className="mt-1 max-w-md text-sm font-semibold text-[#7C898F]">
              {text.identity}
            </p>

            <div className="mt-4 w-full max-w-xl">

              <svg
                viewBox="0 0 700 120"
                className="h-24 w-full"
                preserveAspectRatio="none"
              >

                <path
                  d="M0 115L90 55L140 80L235 10L330 85L420 35L510 90L600 25L700 75V120H0Z"
                  fill="#2E9B62"
                  opacity="0.8"
                />

                <path
                  d="M235 10L205 35L225 30L235 45L250 28L270 42L260 25Z"
                  fill="white"
                />

                <path
                  d="M600 25L575 50L595 43L610 55L625 40L645 52L635 34Z"
                  fill="white"
                />

              </svg>

            </div>

            <div className="mt-2 flex w-full gap-1">

              <span className="h-2 flex-1 rounded-full bg-[#EF3E32]" />
              <span className="h-2 flex-1 rounded-full bg-[#F28C28]" />
              <span className="h-2 flex-1 rounded-full bg-[#F5C542]" />
              <span className="h-2 flex-1 rounded-full bg-[#2E9B62]" />
              <span className="h-2 flex-1 rounded-full bg-[#19A9C7]" />
              <span className="h-2 flex-1 rounded-full bg-[#2877B8]" />

            </div>

          </div>

        </section>

        {/* ===================================================
            VALORES
        =================================================== */}

        <section className="rounded-[27px] border border-white bg-white/90 p-4 shadow-[0_10px_30px_rgba(34,60,76,0.09)]">

          <div className="grid grid-cols-5 gap-1">

            {[
              {
                icon: "❤️",
                label: text.health,
                bg: "bg-[#EF3E32]",
              },
              {
                icon: "🤝",
                label: text.trust,
                bg: "bg-[#2E9B62]",
              },
              {
                icon: "💡",
                label: text.innovation,
                bg: "bg-[#F28C28]",
              },
              {
                icon: "👥",
                label: text.community,
                bg: "bg-[#2877B8]",
              },
              {
                icon: "◆",
                label: text.tradition,
                bg: "bg-[#19A9C7]",
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

        <footer className="pb-5 pt-2 text-center">

          <div className="mx-auto mb-4 flex w-[180px] items-center justify-center">

            <span className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[#F28C28]" />

            <span className="mx-1 h-0.5 flex-1 bg-[#19A9C7]" />

            <span className="h-0.5 flex-1 bg-gradient-to-r from-[#19A9C7] to-transparent" />

          </div>

          <p className="mx-auto max-w-xl text-[9px] font-semibold leading-relaxed text-[#89969D]">
            {text.assistive}
          </p>

          <strong className="mt-2 block text-[9px] font-black tracking-[0.12em] text-[#9BA8AE]">
            🏔️ HUARAZ · ÁNCASH · PERÚ
          </strong>

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
