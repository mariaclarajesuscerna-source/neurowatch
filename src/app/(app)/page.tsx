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
    streak,
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

  const battery = Math.round(
    bleData.batteryPercent
  );

  const hasBPM =
    bleData.connected &&
    bleData.bpm > 0;

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
          CENTRO NEUROWATCH
      ===================================================== */}

      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white shadow-[0_12px_30px_rgba(79,70,229,0.25)]">

        {/* Decoración */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/65">
                Centro NeuroWatch
              </p>

              <h2 className="mt-1 text-[23px] font-bold">
                {bleData.connected
                  ? "Monitoreo activo"
                  : "Listo para monitorear"}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <IconActivity size={24} />
            </div>

          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">

            {/* BPM */}

            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-[11px] text-white/60">
                Pulso
              </p>

              <p className="mt-1 text-[20px] font-bold">
                {hasBPM
                  ? bleData.bpm
                  : "--"}
              </p>

              <p className="text-[10px] text-white/55">
                BPM
              </p>
            </div>

            {/* BATERÍA */}

            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-[11px] text-white/60">
                Batería
              </p>

            <p className="mt-1 text-[20px] font-bold">
  {bleData.connected
    ? `${Math.round(bleData.batteryPercent)}%`
    : "--"}
</p>
              <p className="text-[10px] text-white/55">
                dispositivo
              </p>
            </div>

            {/* CONEXIÓN */}

            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-[11px] text-white/60">
                Estado
              </p>

              <div className="mt-2 flex items-center gap-1.5">

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    bleData.connected
                      ? "bg-green-300"
                      : "bg-white/35"
                  }`}
                />

                <span className="text-[12px] font-semibold">
                  {bleData.connected
                    ? "Activo"
                    : "Offline"}
                </span>

              </div>
            </div>

          </div>

          {/* CHEQUEO RÁPIDO */}

          <button
            type="button"
            onClick={() => router.push("/chequeo")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[15px] bg-white py-3.5 text-[14px] font-bold text-brand-700 shadow-sm transition-all hover:bg-white/90 active:scale-[0.98]"
          >
            <IconCamera size={19} />
            Chequeo facial rápido
          </button>

        </div>
      </div>

      {/* =====================================================
          RACHA
      ===================================================== */}

      {streak && streak.count > 0 && (
        <div className="flex items-center justify-between rounded-[18px] border border-white/70 bg-white/55 px-4 py-3 backdrop-blur-xl">

          <div className="flex items-center gap-2.5">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
              <IconZap size={19} />
            </div>

            <div>
              <p className="text-[13px] font-bold text-ink-900">
                Racha de monitoreo
              </p>

              <p className="text-[11px] text-ink-600">
                Sigue cuidando tu seguimiento diario
              </p>
            </div>

          </div>

          <span className="text-[18px] font-bold text-brand-600">
            {streak.count}{" "}
            <span className="text-[12px]">
              {streak.count === 1
                ? "día"
                : "días"}
            </span>
          </span>

        </div>
      )}

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
          ESTADO PRINCIPAL
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
          PULSO
      ===================================================== */}

      <PulseCard
        bpm={bleData.bpm}
        bars={pulseBars}
      />

      {/* =====================================================
          DISPOSITIVO
      ===================================================== */}

      <DeviceCard
        connected={bleData.connected}
        signalStatus={
          bleData.connected
            ? "Señal estable"
            : "Sin conectar"
        }
        batteryPercent={battery}
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
