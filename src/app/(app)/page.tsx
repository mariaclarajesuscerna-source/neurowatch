```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconActivity,
  IconSignal,
  IconWifi,
  IconBatteryFull,
  IconBluetooth,
  IconCamera,
  IconZap,
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

  const connStatus = bleData.connected
    ? ("ok" as const)
    : ("muted" as const);

  const connLabel = bleData.connected
    ? "Conectado"
    : "Desconectado";

  const batteryPercent = Math.round(
    bleData.batteryPercent
  );

  return (
    <div className="flex flex-col gap-3.5 px-5 pt-3.5 md:pt-6 md:max-w-lg md:mx-auto">

      {/* =====================================================
          STATUS BAR
      ===================================================== */}

      <div className="flex items-center justify-between px-1 md:hidden">
        <span className="text-[15px] font-semibold text-ink-900">
          {new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        <div className="flex items-center gap-1.5 text-ink-900">
          <IconSignal size={16} />
          <IconWifi size={16} />
          <IconBatteryFull size={16} />
        </div>
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2.5">

          <div className="h-[34px] w-[34px] rounded-[11px] bg-brand-600 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.25)] text-white">
            <IconActivity size={20} />
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[22px] font-bold text-ink-900 leading-tight">
              Neurowatch
            </span>

            <span className="text-[13px] font-normal text-ink-600 leading-tight">
              Monitoreo en vivo
            </span>
          </div>

        </div>

        <StatusChip
          label={connLabel}
          status={connStatus}
        />

      </div>

      {/* =====================================================
          PANEL PRINCIPAL
      ===================================================== */}

      <div className="relative overflow-hidden rounded-[24px] bg-brand-600 p-5 text-white shadow-[0_12px_30px_rgba(79,70,229,0.25)]">

        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

        <div className="pointer-events-none absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-white/5" />

        <div className="relative">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
                Centro NeuroWatch
              </p>

              <h2 className="mt-1 text-[23px] font-bold">
                {bleData.connected
                  ? "Monitoreo activo"
                  : "Listo para monitorear"}
              </h2>

              <p className="mt-1 text-[12px] text-white/70">
                Tu información en tiempo real
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <IconActivity size={24} />
            </div>

          </div>

          {/* =================================================
              DATOS EN VIVO
          ================================================= */}

          <div className="mt-5 grid grid-cols-3 gap-2">

            {/* PULSO */}

            <div className="rounded-2xl bg-white/10 p-3">

              <p className="text-[10px] text-white/60">
                Pulso
              </p>

              <p className="mt-1 text-[20px] font-bold">
                {bleData.connected &&
                bleData.bpm > 0
                  ? bleData.bpm
                  : "--"}
              </p>

              <p className="text-[9px] text-white/55">
                BPM
              </p>

            </div>

            {/* BATERÍA */}

            <div className="rounded-2xl bg-white/10 p-3">

              <p className="text-[10px] text-white/60">
                Batería
              </p>

              <p className="mt-1 text-[20px] font-bold">
                {bleData.connected
                  ? batteryPercent + "%"
                  : "--"}
              </p>

              <p className="text-[9px] text-white/55">
                dispositivo
              </p>

            </div>

            {/* ESTADO */}

            <div className="rounded-2xl bg-white/10 p-3">

              <p className="text-[10px] text-white/60">
                Estado
              </p>

              <div className="mt-2 flex items-center gap-1.5">

                <span
                  className={
                    bleData.connected
                      ? "h-2.5 w-2.5 rounded-full bg-green-300"
                      : "h-2.5 w-2.5 rounded-full bg-white/30"
                  }
                />

                <span className="text-[11px] font-semibold">
                  {bleData.connected
                    ? "Activo"
                    : "Offline"}
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              CHEQUEO FACIAL
          ================================================= */}

          <button
            type="button"
            onClick={() => router.push("/chequeo")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[15px] bg-white py-3.5 text-[14px] font-bold text-brand-600 transition-all hover:bg-white/90 active:scale-[0.98]"
          >
            <IconCamera size={19} />
            Chequeo facial rápido
          </button>

        </div>
      </div>

      {/* =====================================================
          CONECTAR RELOJ
      ===================================================== */}

      {!bleData.connected && (
        <button
          onClick={connectBLE}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-[18px] bg-brand-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)] active:scale-[0.98] transition-transform"
        >
          <IconBluetooth size={22} />

          <span className="text-base font-bold">
            Conectar reloj
          </span>

        </button>
      )}

      {/* =====================================================
          ERROR BLE
      ===================================================== */}

      {bleError && (
        <div className="rounded-[14px] bg-alert-fill border border-alert-border p-3.5">
          <p className="text-[13px] font-medium text-alert">
            {bleError}
          </p>
        </div>
      )}

      {/* =====================================================
          ESTADO DEL MONITOREO
      ===================================================== */}

      {bleData.connected &&
        bleData.bpm > 0 && (
          <HeroStatus state={status} />
        )}

      {/* =====================================================
          ESPERANDO DATOS
      ===================================================== */}

      {bleData.connected &&
        bleData.bpm === 0 && (
          <div className="rounded-[20px] bg-white/55 backdrop-blur-xl border border-white/70 p-6 text-center">

            <p className="text-[15px] font-medium text-ink-600">
              Conectado al reloj. Coloca el dedo
              en el sensor para ver tu pulso.
            </p>

          </div>
        )}

      {/* =====================================================
          PULSE CARD
      ===================================================== */}

      <PulseCard
        bpm={bleData.bpm}
        bars={pulseBars}
      />

      {/* =====================================================
          DEVICE CARD
      ===================================================== */}

      <DeviceCard
        connected={bleData.connected}
        signalStatus={
          bleData.connected
            ? "Señal estable"
            : "Sin conectar"
        }
        batteryPercent={batteryPercent}
      />

      {/* =====================================================
          ALERTA
      ===================================================== */}

      <AlertModal
        open={alertOpen}
        remainingSeconds={countdownSeconds}
        totalSeconds={settings.countdownSeconds}
        contacts={contacts.map(
          (c) => c.name
        )}
        onCancel={cancelAlert}
      />

    </div>
  );
}
```
