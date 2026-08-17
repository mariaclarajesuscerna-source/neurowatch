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

export default function DashboardPage() {
  const router = useRouter();

  const {
    language,
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
          location: "ÁNCASH · PERÚ",
          subtitle: "Monitoreo inteligente en tiempo real",

          monitoring: "TU MONITOREO",
          welcome: "Tu bienestar, más cerca.",

          deviceStatus: "Estado del dispositivo",
          active: "Sistema activo",
          waiting: "Esperando conexión",

          live: "EN VIVO",
          offline: "SIN CONEXIÓN",

          connect: "Conectar reloj NeuroWatch",

          current: "ESTADO ACTUAL",
          monitoringActive: "Monitoreo activo",

          connected: "Reloj conectado",
          putFinger:
            "Coloca el dedo sobre el sensor para comenzar a recibir tu pulso.",

          signs: "SIGNOS EN VIVO",
          heart: "Frecuencia cardíaca",

          device: "DISPOSITIVO",
          stable: "Señal estable",
          noConnection: "Sin conexión",

          intelligent: "Detección inteligente",

          connection: "CONEXIÓN",
          bluetooth: "Bluetooth activo",
          pending: "Pendiente",

          made: "HECHO DESDE ÁNCASH",
          identity: "Tecnología con identidad andina",

          assistive:
            "Herramienta asistiva · No diagnostica ni sustituye la atención profesional.",

          connectedStatus: "Conectado",
          disconnectedStatus: "Desconectado",
        }
      : {
          location: "ANQASH · PIRUW",
          subtitle: "Kawsayta pacha-pachapi rikapay",

          monitoring: "QAMPA RIKAYNIKI",
          welcome: "Kawsayniki aswan qayllapi.",

          deviceStatus: "Dispositivopa kaynin",
          active: "Sistema llamk'achkan",
          waiting: "Tinkiyta suyarichkan",

          live: "KAWASHAQ",
          offline: "MANA TINKISQA",

          connect: "NeuroWatch relojwan tinkiy",

          current: "KUNAN KAYNIN",
          monitoringActive: "Rikapaykuy llamk'achkan",

          connected: "Reloj tinkisqa",
          putFinger:
            "Ruk'aykita sensorpa hawanman churay, puywaykita chaskinapaq.",

          signs: "KAWSAYPA WILLAYNINKUNA",
          heart: "Shunqupa puywaynin",

          device: "DISPOSITIVO",
          stable: "Willakuy allinmi",
          noConnection: "Mana tinkisqa",

          intelligent: "Yachaywan rikay",

          connection: "TINKIY",
          bluetooth: "Bluetooth llamk'achkan",
          pending: "Suyarichkan",

          made: "ANQASHMANTA RURASQA",
          identity: "Andino yachaywan rurasqa tecnología",

          assistive:
            "Yanapakuq sistema · Mana hampinchu, hampiqpa yanaynintaqa mana rantinchu.",

          connectedStatus: "Tinkisqa",
          disconnectedStatus: "Mana tinkisqa",
        };

  const connected = bleData.connected;

  const connStatus = connected
    ? ("ok" as const)
    : ("muted" as const);

  const connLabel = connected
    ? text.connectedStatus
    : text.disconnectedStatus;

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">

      {/* =====================================================
          FONDO
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-300/25 blur-3xl" />

        <div className="absolute right-[-120px] top-32 h-96 w-96 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="absolute bottom-[-180px] left-1/3 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />

        {/* Cordillera */}

        <div className="absolute bottom-0 left-0 w-full opacity-[0.08]">

          <svg
            viewBox="0 0 1440 300"
            className="w-full"
            preserveAspectRatio="none"
          >

            <path
              fill="#312e81"
              d="M0 250L180 100L300 215L470 45L650 225L820 80L990 205L1170 35L1440 235V300H0Z"
            />

          </svg>

        </div>

      </div>

      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <main className="relative mx-auto flex max-w-lg flex-col gap-4 px-5 pb-28 pt-5 md:ml-[270px] md:max-w-3xl md:px-8 md:pb-10 md:pt-8">

        {/* =====================================================
            UBICACIÓN
        ===================================================== */}

        <div className="flex items-center justify-center gap-2">

          <span className="text-lg">
            🏔️
          </span>

          <span className="text-[10px] font-black tracking-[0.22em] text-indigo-600">
            {text.location}
          </span>

          <span className="text-lg">
            🇵🇪
          </span>

        </div>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-fuchsia-600 text-white shadow-xl">

              <IconActivity size={27} />

              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />

            </div>

            <div>

              <h1 className="text-[26px] font-black tracking-tight">
                NeuroWatch
              </h1>

              <p className="text-[11px] font-semibold text-slate-500">
                {text.subtitle}
              </p>

            </div>

          </div>

          <StatusChip
            label={connLabel}
            status={connStatus}
          />

        </div>

        {/* =====================================================
            BANNER ANDINO
        ===================================================== */}

        <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">

          <div className="flex items-center gap-1">

            <span className="h-1.5 flex-1 bg-red-500" />
            <span className="h-1.5 flex-1 bg-orange-400" />
            <span className="h-1.5 flex-1 bg-yellow-400" />
            <span className="h-1.5 flex-1 bg-green-500" />
            <span className="h-1.5 flex-1 bg-cyan-500" />
            <span className="h-1.5 flex-1 bg-purple-600" />

          </div>

          <div className="flex items-center justify-center gap-3 px-4 py-3">

            <span className="text-xl">
              🏔️
            </span>

            <span className="text-[10px] font-black tracking-[0.15em] text-slate-500">
              {text.location}
            </span>

            <span className="text-xl">
              💧
            </span>

          </div>

        </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-950 via-purple-800 to-fuchsia-600 p-6 text-white shadow-2xl shadow-purple-300/40">

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />

          <div className="relative">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[10px] font-black tracking-[0.2em] text-cyan-200">
                  {text.monitoring}
                </p>

                <h2 className="mt-2 max-w-xs text-[26px] font-black leading-tight">
                  {text.welcome}
                </h2>

              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-4xl backdrop-blur">
                ⌚
              </div>

            </div>

            {/* Montañas */}

            <div className="my-5 overflow-hidden rounded-2xl bg-white/10 px-3 py-1">

              <svg
                viewBox="0 0 500 70"
                className="h-12 w-full"
                preserveAspectRatio="none"
              >

                <path
                  d="M0 65L70 25L115 55L180 8L250 55L315 18L380 55L440 5L500 48V70H0Z"
                  fill="rgba(255,255,255,.16)"
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

                <p className="text-[11px] text-white/60">
                  {text.deviceStatus}
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <span
                    className={`h-3 w-3 rounded-full ${
                      connected
                        ? "animate-pulse bg-emerald-300"
                        : "bg-white/40"
                    }`}
                  />

                  <span className="text-[15px] font-bold">
                    {connected
                      ? text.active
                      : text.waiting}
                  </span>

                </div>

              </div>

              <span className="rounded-full bg-white/15 px-3 py-1.5 text-[9px] font-black backdrop-blur">
                {connected
                  ? `● ${text.live}`
                  : text.offline}
              </span>

            </div>

          </div>

        </section>

        {/* =====================================================
            CONECTAR
        ===================================================== */}

        {!connected && (

          <button
            onClick={connectBLE}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 py-4 text-white shadow-xl transition hover:-translate-y-0.5 active:scale-[0.98]"
          >

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">

              <IconBluetooth size={21} />

            </span>

            <span className="text-[14px] font-black">
              {text.connect}
            </span>

          </button>

        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {bleError && (

          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

            <div className="flex items-center gap-3">

              <span className="text-xl">
                ⚠️
              </span>

              <p className="text-[12px] font-bold text-red-600">
                {bleError}
              </p>

            </div>

          </div>

        )}

        {/* =====================================================
            ESTADO ACTUAL
        ===================================================== */}

        {connected && bleData.bpm > 0 && (

          <div className="rounded-[28px] border border-white bg-white/85 p-4 shadow-xl backdrop-blur">

            <div className="mb-3 flex items-center justify-between">

              <div>

                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                  {text.current}
                </p>

                <p className="text-[15px] font-black">
                  {text.monitoringActive}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-xl">
                ❤️
              </div>

            </div>

            <HeroStatus state={status} />

          </div>

        )}

        {/* =====================================================
            ESPERANDO PULSO
        ===================================================== */}

        {connected && bleData.bpm === 0 && (

          <div className="rounded-[28px] border border-white bg-white/85 p-7 text-center shadow-xl">

            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-fuchsia-100 text-4xl">
              ❤️
            </div>

            <p className="text-[17px] font-black">
              {text.connected}
            </p>

            <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-slate-500">
              {text.putFinger}
            </p>

            <div className="mx-auto mt-5 h-1.5 w-24 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />

          </div>

        )}

        {/* =====================================================
            PULSO EN VIVO
        ===================================================== */}

        <section>

          <div className="mb-2 flex items-end justify-between px-1">

            <div>

              <p className="text-[10px] font-black tracking-[0.18em] text-indigo-400">
                {text.signs}
              </p>

              <h2 className="text-[18px] font-black">
                {text.heart}
              </h2>

            </div>

            <span className="rounded-full bg-rose-50 px-3 py-1.5 text-[9px] font-black text-rose-500">

              ❤️ {text.live}

            </span>

          </div>

          <div className="overflow-hidden rounded-[28px] border border-white bg-white/85 shadow-xl">

            <PulseCard
              bpm={bleData.bpm}
              bars={pulseBars}
            />

          </div>

        </section>

        {/* =====================================================
            DISPOSITIVO
        ===================================================== */}

        <section>

          <div className="mb-2 flex items-center justify-between px-1">

            <div>

              <p className="text-[10px] font-black tracking-[0.18em] text-cyan-500">
                {text.device}
              </p>

              <h2 className="text-[18px] font-black">
                NeuroWatch
              </h2>

            </div>

            <span className="text-xl">
              🏔️
            </span>

          </div>

          <div className="overflow-hidden rounded-[28px] border border-white bg-white/85 shadow-xl">

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

        {/* =====================================================
            TARJETAS
        ===================================================== */}

        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-[24px] border border-white bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 shadow-lg">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg">
              🧠
            </div>

            <p className="text-[10px] font-bold text-slate-400">
              NeuroWatch
            </p>

            <p className="mt-1 text-[13px] font-black">
              {text.intelligent}
            </p>

          </div>

          <div className="rounded-[24px] border border-white bg-gradient-to-br from-cyan-50 to-blue-50 p-4 shadow-lg">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-lg">
              📡
            </div>

            <p className="text-[10px] font-bold text-slate-400">
              {text.connection}
            </p>

            <p className="mt-1 text-[13px] font-black">
              {connected
                ? text.bluetooth
                : text.pending}
            </p>

          </div>

        </div>

        {/* =====================================================
            IDENTIDAD ANDINA
        ===================================================== */}

        <div className="relative overflow-hidden rounded-[28px] border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-rose-50 p-5 shadow-lg">

          <div className="absolute -right-4 -top-6 text-7xl opacity-10">
            🏔️
          </div>

          <div className="relative">

            <div className="flex items-center gap-3">

              <span className="text-3xl">
                🏔️
              </span>

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                  {text.made}
                </p>

                <p className="mt-1 text-[15px] font-black">
                  {text.identity}
                </p>

              </div>

            </div>

            <div className="mt-4 flex gap-1">

              <span className="h-1.5 flex-1 rounded-full bg-red-500" />
              <span className="h-1.5 flex-1 rounded-full bg-orange-400" />
              <span className="h-1.5 flex-1 rounded-full bg-yellow-400" />
              <span className="h-1.5 flex-1 rounded-full bg-green-500" />
              <span className="h-1.5 flex-1 rounded-full bg-cyan-500" />
              <span className="h-1.5 flex-1 rounded-full bg-purple-600" />

            </div>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="pb-5 pt-2 text-center">

          <div className="mx-auto mb-3 h-px max-w-xs bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

          <p className="text-[9px] font-semibold text-slate-400">
            {text.assistive}
          </p>

          <p className="mt-2 text-[9px] font-black text-indigo-300">
            🏔️ {text.location} 🇵🇪
          </p>

        </footer>

        {/* =====================================================
            ALERTA
        ===================================================== */}

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
