"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  IconActivity,
  IconSignal,
  IconWifi,
  IconBatteryFull,
  IconBluetooth,
} from "@/components/ui/icons";

import StatusChip from "@/components/ui/StatusChip";
import HeroStatus from "@/components/dashboard/HeroStatus";
import PulseCard from "@/components/dashboard/PulseCard";
import DeviceCard from "@/components/dashboard/DeviceCard";
import AlertModal from "@/components/alert/AlertModal";

import { useNeurowatch } from "@/components/NeurowatchProvider";

export default function DashboardPage() {
  const router = useRouter();

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

  const [language, setLanguage] = useState<"es" | "qch">("es");

  useEffect(() => {
    if (disconnectedSince) {
      router.replace("/desconectado");
    }
  }, [router, disconnectedSince]);

  const connStatus = bleData.connected
    ? ("ok" as const)
    : ("muted" as const);

  const connLabel = bleData.connected
    ? language === "es"
      ? "Conectado"
      : "Tinkisqa"
    : language === "es"
      ? "Desconectado"
      : "Rakirisqa";

  const text = {
    es: {
      subtitle: "Monitoreo inteligente en tiempo real",
      location: "HUARAZ · ÁNCASH · PERÚ",
      monitoring: "TU MONITOREO",
      welcome: "Tu bienestar, más cerca.",
      deviceStatus: "Estado del dispositivo",
      active: "Sistema activo",
      waiting: "Esperando conexión",
      live: "EN VIVO",
      offline: "OFFLINE",
      connect: "Conectar reloj NeuroWatch",
      activeMonitoring: "Monitoreo activo",
      currentStatus: "Estado actual",
      waitingData: "Reloj conectado",
      putFinger:
        "Coloca el dedo sobre el sensor para comenzar a recibir tu pulso.",
      liveSigns: "Signos en vivo",
      heartRate: "Frecuencia cardíaca",
      device: "Dispositivo",
      intelligent: "Detección inteligente",
      connection: "Conexión",
      bluetooth: "Bluetooth activo",
      pending: "Pendiente",
      stableSignal: "Señal estable",
      noConnection: "Sin conectar",
      spanish: "ES",
      quechua: "QCH",
      footer:
        "NeuroWatch · Herramienta asistiva de monitoreo · Huaraz, Áncash",
    },

    qch: {
      subtitle: "Kawsayta rikapaykuy pacha-pacha",
      location: "WARAS · ANQASH · PIRUW",
      monitoring: "QAMPA RIKAYNIN",
      welcome: "Kawsayniki aswan qayllapi.",
      deviceStatus: "Dispositivopa kaynin",
      active: "Sistema llamk'achkan",
      waiting: "Tinkiyta suyarichkan",
      live: "KAWSACHKAN",
      offline: "WIFI / BLE MANA KAN",
      connect: "NeuroWatch relojwan tinkiy",
      activeMonitoring: "Rikapaykuy llamk'achkan",
      currentStatus: "Kunan kaynin",
      waitingData: "Reloj tinkisqa",
      putFinger:
        "Ruk'aykita sensorpa hawanman churay, puywaykita chaskinapaq.",
      liveSigns: "Kawsaypa willayninkuna",
      heartRate: "Shunqupa puywaynin",
      device: "Dispositivo",
      intelligent: "Yachaywan rikay",
      connection: "Tinkiy",
      bluetooth: "Bluetooth llamk'achkan",
      pending: "Suyarichkan",
      stableSignal: "Señal allinmi",
      noConnection: "Mana tinkisqa",
      spanish: "ES",
      quechua: "QCH",
      footer:
        "NeuroWatch · Kawsayta yanapakuq sistema · Waras, Anqash",
    },
  }[language];

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f5ff] text-slate-900">

      {/* ===================================================== */}
      {/* FONDO ANDINO */}
      {/* ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Círculos de color */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />

        <div className="absolute right-[-120px] top-40 h-96 w-96 rounded-full bg-fuchsia-300/25 blur-3xl" />

        <div className="absolute bottom-[-150px] left-1/3 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />

        {/* Montañas */}
        <div className="absolute bottom-0 left-0 w-full opacity-[0.10]">
          <svg
            viewBox="0 0 1440 300"
            className="h-auto w-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#312e81"
              d="M0 250L180 110L310 220L470 60L650 230L820 90L990 210L1170 50L1440 240V300H0Z"
            />
          </svg>
        </div>

      </div>

      <div className="relative mx-auto flex max-w-lg flex-col gap-4 px-5 pb-10 pt-4 md:pt-7">

        {/* ===================================================== */}
        {/* BARRA SUPERIOR */}
        {/* ===================================================== */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <span className="text-xs font-black tracking-[0.18em] text-indigo-600">
              {text.location}
            </span>

          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={() => setLanguage("es")}
              className={`rounded-full px-3 py-1.5 text-[11px] font-black transition ${
                language === "es"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300"
                  : "bg-white text-slate-400"
              }`}
            >
              🇵🇪 {text.spanish}
            </button>

            <button
              onClick={() => setLanguage("qch")}
              className={`rounded-full px-3 py-1.5 text-[11px] font-black transition ${
                language === "qch"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-300"
                  : "bg-white text-slate-400"
              }`}
            >
              🏔️ {text.quechua}
            </button>

          </div>

        </div>

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="relative flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-300/40">

              <IconActivity size={27} />

              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-[#f7f5ff] bg-emerald-400" />

            </div>

            <div>

              <h1 className="text-[26px] font-black tracking-tight text-slate-900">
                NeuroWatch
              </h1>

              <p className="text-[12px] font-semibold text-slate-500">
                {text.subtitle}
              </p>

            </div>

          </div>

          <StatusChip
            label={connLabel}
            status={connStatus}
          />

        </div>

        {/* ===================================================== */}
        {/* DETALLE ANDINO */}
        {/* ===================================================== */}

        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-cyan-50 px-4 py-2.5 shadow-sm">

          <div className="flex items-center justify-center gap-2">

            <span className="text-lg">🏔️</span>

            <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />

            <span className="text-xs font-black tracking-widest text-indigo-700">
              ANQASH
            </span>

            <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500" />

            <span className="text-lg">🇵🇪</span>

          </div>

        </div>

        {/* ===================================================== */}
        {/* HERO */}
        {/* ===================================================== */}

        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#312e81] via-[#6d28d9] to-[#db2777] p-6 text-white shadow-2xl shadow-purple-300/40">

          {/* Brillos */}

          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-yellow-300/20 blur-2xl" />

          <div className="pointer-events-none absolute right-20 top-20 h-20 w-20 rounded-full bg-white/10 blur-xl" />

          <div className="relative z-10">

            <div className="mb-5 flex items-start justify-between">

              <div>

                <p className="text-[11px] font-black tracking-[0.2em] text-cyan-200">
                  {text.monitoring}
                </p>

                <h2 className="mt-2 max-w-xs text-[25px] font-black leading-tight">
                  {text.welcome}
                </h2>

              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-4xl shadow-lg backdrop-blur-xl">
                ⌚
              </div>

            </div>

            {/* Mini montaña */}

            <div className="mb-5 overflow-hidden rounded-xl bg-white/10 px-3 py-1 backdrop-blur">

              <svg
                viewBox="0 0 500 70"
                className="h-12 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 65L70 25L115 55L180 8L250 55L315 18L380 55L440 5L500 48V70H0Z"
                  fill="rgba(255,255,255,.18)"
                />

                <path
                  d="M0 65L70 25L115 55L180 8L250 55L315 18L380 55L440 5L500 48"
                  fill="none"
                  stroke="rgba(255,255,255,.8)"
                  strokeWidth="2"
                />
              </svg>

            </div>

            <div className="flex items-end justify-between">

              <div>

                <p className="text-[12px] text-white/60">
                  {text.deviceStatus}
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <span
                    className={`h-3 w-3 rounded-full ${
                      bleData.connected
                        ? "animate-pulse bg-emerald-300"
                        : "bg-white/40"
                    }`}
                  />

                  <span className="text-[15px] font-bold">
                    {bleData.connected
                      ? text.active
                      : text.waiting}
                  </span>

                </div>

              </div>

              <span className="rounded-full border border-white/10 bg-white/15 px-3 py-1.5 text-[10px] font-black backdrop-blur-xl">

                {bleData.connected
                  ? `● ${text.live}`
                  : text.offline}

              </span>

            </div>

          </div>

        </div>

        {/* ===================================================== */}
        {/* CONECTAR */}
        {/* ===================================================== */}

        {!bleData.connected && (

          <button
            onClick={connectBLE}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 py-4 text-white shadow-xl shadow-indigo-300/30 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >

            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-fuchsia-400/10 to-yellow-400/10 opacity-0 transition group-hover:opacity-100" />

            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <IconBluetooth size={21} />
            </span>

            <span className="relative text-[15px] font-black">
              {text.connect}
            </span>

          </button>

        )}

        {/* ===================================================== */}
        {/* ERROR */}
        {/* ===================================================== */}

        {bleError && (

          <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-4 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                ⚠️
              </div>

              <p className="text-[13px] font-bold text-red-600">
                {bleError}
              </p>

            </div>

          </div>

        )}

        {/* ===================================================== */}
        {/* ESTADO CONECTADO */}
        {/* ===================================================== */}

        {bleData.connected && bleData.bpm > 0 && (

          <div className="relative overflow-hidden rounded-[27px] border border-white/80 bg-white/85 p-4 shadow-xl shadow-indigo-100/50 backdrop-blur-xl">

            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-200/30 blur-2xl" />

            <div className="relative mb-3 flex items-center justify-between">

              <div>

                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                  {text.currentStatus}
                </p>

                <p className="text-[15px] font-black text-slate-900">
                  {text.activeMonitoring}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 text-xl shadow-sm">
                ❤️
              </div>

            </div>

            <HeroStatus state={status} />

          </div>

        )}

        {/* ===================================================== */}
        {/* ESPERANDO DATOS */}
        {/* ===================================================== */}

        {bleData.connected && bleData.bpm === 0 && (

          <div className="relative overflow-hidden rounded-[27px] border border-white/80 bg-white/85 p-7 text-center shadow-xl backdrop-blur-xl">

            <div className="absolute left-0 top-0 h-24 w-24 rounded-full bg-cyan-200/20 blur-2xl" />

            <div className="relative">

              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-fuchsia-100 text-4xl shadow-inner">
                ❤️
              </div>

              <p className="text-[17px] font-black text-slate-900">
                {text.waitingData}
              </p>

              <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-slate-500">
                {text.putFinger}
              </p>

              <div className="mx-auto mt-5 h-1.5 w-24 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />

            </div>

          </div>

        )}

        {/* ===================================================== */}
        {/* PULSO */}
        {/* ===================================================== */}

        <div className="relative">

          <div className="mb-2 flex items-end justify-between px-1">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">
                {text.liveSigns}
              </p>

              <h2 className="text-[18px] font-black text-slate-900">
                {text.heartRate}
              </h2>

            </div>

            <span className="rounded-full bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-1.5 text-[10px] font-black text-rose-500 shadow-sm">
              ❤️ LIVE
            </span>

          </div>

          <div className="overflow-hidden rounded-[27px] border border-white/80 bg-white/85 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">

            <PulseCard
              bpm={bleData.bpm}
              bars={pulseBars}
            />

          </div>

        </div>

        {/* ===================================================== */}
        {/* DISPOSITIVO */}
        {/* ===================================================== */}

        <div>

          <div className="mb-2 flex items-end justify-between px-1">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-500">
                {text.device}
              </p>

              <h2 className="text-[18px] font-black text-slate-900">
                NeuroWatch
              </h2>

            </div>

            <span className="text-xl">
              🏔️
            </span>

          </div>

          <div className="overflow-hidden rounded-[27px] border border-white/80 bg-white/85 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">

            <DeviceCard
              connected={bleData.connected}
              signalStatus={
                bleData.connected
                  ? text.stableSignal
                  : text.noConnection
              }
              batteryPercent={Math.round(
                bleData.batteryPercent
              )}
            />

          </div>

        </div>

        {/* ===================================================== */}
        {/* TARJETAS */}
        {/* ===================================================== */}

        <div className="grid grid-cols-2 gap-3">

          {/* IA */}

          <div className="group relative overflow-hidden rounded-[23px] border border-white bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 shadow-md transition hover:-translate-y-1">

            <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-fuchsia-200/40 blur-xl" />

            <div className="relative">

              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg shadow-lg">
                🧠
              </div>

              <p className="text-[10px] font-bold text-slate-400">
                NeuroWatch
              </p>

              <p className="mt-1 text-[13px] font-black text-slate-900">
                {text.intelligent}
              </p>

            </div>

          </div>

          {/* CONEXIÓN */}

          <div className="group relative overflow-hidden rounded-[23px] border border-white bg-gradient-to-br from-cyan-50 to-blue-50 p-4 shadow-md transition hover:-translate-y-1">

            <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-cyan-200/40 blur-xl" />

            <div className="relative">

              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-lg shadow-lg">
                📡
              </div>

              <p className="text-[10px] font-bold text-slate-400">
                {text.connection}
              </p>

              <p className="mt-1 text-[13px] font-black text-slate-900">
                {bleData.connected
                  ? text.bluetooth
                  : text.pending}
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================== */}
        {/* IDENTIDAD HUARAZ */}
        {/* ===================================================== */}

        <div className="relative overflow-hidden rounded-[27px] border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-rose-50 p-5 shadow-lg">

          <div className="absolute right-[-20px] top-[-20px] text-7xl opacity-10">
            🏔️
          </div>

          <div className="relative">

            <div className="flex items-center gap-3">

              <div className="text-3xl">
                🏔️
              </div>

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                  Hecho desde Áncash
                </p>

                <p className="mt-1 text-[15px] font-black text-slate-900">
                  Tecnología con identidad andina 🇵🇪
                </p>

              </div>

            </div>

            <div className="mt-4 flex gap-1">

              <span className="h-1.5 flex-1 rounded-full bg-red-500" />
              <span className="h-1.5 flex-1 rounded-full bg-orange-400" />
              <span className="h-1.5 flex-1 rounded-full bg-yellow-400" />
              <span className="h-1.5 flex-1 rounded-full bg-green-500" />
              <span className="h-1.5 flex-1 rounded-full bg-blue-500" />
              <span className="h-1.5 flex-1 rounded-full bg-purple-600" />

            </div>

          </div>

        </div>

        {/* ===================================================== */}
        {/* FOOTER */}
        {/* ===================================================== */}

        <footer className="pb-5 pt-2 text-center">

          <div className="mx-auto mb-3 h-px max-w-xs bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

          <p className="text-[10px] font-bold text-slate-400">
            {text.footer}
          </p>

          <p className="mt-1 text-[9px] text-slate-400">
            {language === "es"
              ? "Herramienta asistiva · No diagnostica ni sustituye la atención profesional."
              : "Yanapakuq herramienta · Mana hampiqmi, hampiqpa yanapaynintaqa mana rantinchu."}
          </p>

        </footer>

        {/* ===================================================== */}
        {/* ALERTA */}
        {/* ===================================================== */}

        <AlertModal
          open={alertOpen}
          remainingSeconds={countdownSeconds}
          totalSeconds={settings.countdownSeconds}
          contacts={contacts.map((c) => c.name)}
          onCancel={cancelAlert}
        />

      </div>
    </div>
  );
}
