
"use client";
import { useEffect } from "react";
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

  useEffect(() => {
    if (disconnectedSince) {
      router.replace("/desconectado");
    }
  }, [router, disconnectedSince]);

  const connStatus = bleData.connected ? ("ok" as const) : ("muted" as const);
  const connLabel = bleData.connected ? "Conectado" : "Desconectado";

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-100">
      <div className="relative mx-auto flex max-w-lg flex-col gap-4 px-5 pb-8 pt-4 md:pt-7">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-72 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />

        {/* Mobile status bar */}
        <div className="relative flex items-center justify-between px-1 md:hidden">
          <span className="text-[14px] font-bold text-ink-900">
            {new Date().toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur">
            <IconSignal size={15} />
            <IconWifi size={15} />
            <IconBatteryFull size={15} />
          </div>
        </div>

        {/* Header */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-300/40">
              <IconActivity size={25} />
            </div>

            <div>
              <h1 className="text-[25px] font-extrabold tracking-tight text-ink-900">
                NeuroWatch
              </h1>
              <p className="text-[12px] font-medium text-ink-500">
                Monitoreo inteligente en tiempo real
              </p>
            </div>
          </div>

          <StatusChip label={connLabel} status={connStatus} />
        </div>

        {/* Hero welcome card */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-5 text-white shadow-xl shadow-indigo-300/30">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-white/70">
                  TU MONITOREO
                </p>
                <h2 className="mt-1 text-[22px] font-extrabold">
                  Tu bienestar, más cerca.
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur">
                ⌚
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[13px] text-white/70">
                  Estado del dispositivo
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      bleData.connected ? "bg-emerald-300" : "bg-white/40"
                    }`}
                  />

                  <span className="text-[16px] font-bold">
                    {bleData.connected
                      ? "Sistema activo"
                      : "Esperando conexión"}
                  </span>
                </div>
              </div>

              <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">
                {bleData.connected ? "EN VIVO" : "OFFLINE"}
              </span>
            </div>
          </div>
        </div>

        {/* Connect button */}
        {!bleData.connected && (
          <button
            onClick={connectBLE}
            className="relative flex w-full items-center justify-center gap-3 rounded-2xl bg-ink-900 py-4 text-white shadow-xl shadow-ink-900/20 transition-all active:scale-[0.98]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <IconBluetooth size={21} />
            </span>

            <span className="text-[15px] font-bold">
              Conectar reloj NeuroWatch
            </span>
          </button>
        )}

        {/* BLE error */}
        {bleError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <p className="text-[13px] font-semibold text-red-600">
              {bleError}
            </p>
          </div>
        )}

        {/* Connected status */}
        {bleData.connected && bleData.bpm > 0 && (
          <div className="overflow-hidden rounded-[26px] border border-white/80 bg-white/75 p-4 shadow-lg shadow-indigo-100/50 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">
                  Estado actual
                </p>
                <p className="text-[15px] font-bold text-ink-900">
                  Monitoreo activo
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                ❤️
              </div>
            </div>

            <HeroStatus state={status} />
          </div>
        )}

        {/* Waiting for data */}
        {bleData.connected && bleData.bpm === 0 && (
          <div className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/75 p-6 text-center shadow-lg shadow-indigo-100/40 backdrop-blur-xl">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-3xl">
              ❤️
            </div>

            <p className="text-[16px] font-bold text-ink-900">
              Reloj conectado
            </p>

            <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
              Coloca el dedo sobre el sensor para comenzar a recibir tu pulso.
            </p>

            <div className="mx-auto mt-4 h-1.5 w-20 animate-pulse rounded-full bg-indigo-500" />
          </div>
        )}

        {/* Pulse section */}
        <div className="relative">
          <div className="mb-2 flex items-center justify-between px-1">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">
                Signos en vivo
              </p>
              <h2 className="text-[17px] font-extrabold text-ink-900">
                Frecuencia cardíaca
              </h2>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-600">
              ❤️ LIVE
            </span>
          </div>

          <div className="overflow-hidden rounded-[26px] border border-white/80 bg-white/80 shadow-lg shadow-indigo-100/40 backdrop-blur-xl">
            <PulseCard bpm={bleData.bpm} bars={pulseBars} />
          </div>
        </div>

        {/* Device */}
        <div>
          <div className="mb-2 px-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">
              Dispositivo
            </p>
          </div>

          <div className="overflow-hidden rounded-[26px] border border-white/80 bg-white/80 shadow-lg shadow-indigo-100/40 backdrop-blur-xl">
            <DeviceCard
              connected={bleData.connected}
              signalStatus={
                bleData.connected ? "Señal estable" : "Sin conectar"
              }
              batteryPercent={Math.round(bleData.batteryPercent)}
            />
          </div>
        </div>

        {/* Quick information cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-white/80 bg-white/75 p-4 shadow-md backdrop-blur-xl">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-lg">
              🧠
            </div>

            <p className="text-[11px] font-semibold text-ink-400">
              NeuroWatch
            </p>

            <p className="mt-1 text-[13px] font-bold text-ink-900">
              Detección inteligente
            </p>
          </div>

          <div className="rounded-[22px] border border-white/80 bg-white/75 p-4 shadow-md backdrop-blur-xl">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-lg">
              📡
            </div>

            <p className="text-[11px] font-semibold text-ink-400">
              Conexión
            </p>

            <p className="mt-1 text-[13px] font-bold text-ink-900">
              {bleData.connected ? "Bluetooth activo" : "Pendiente"}
            </p>
          </div>
        </div>

        {/* Alert modal */}
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

  
