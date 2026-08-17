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
    <div className="flex flex-col gap-3.5 px-5 pt-3.5 md:mx-auto md:max-w-lg md:pt-6">

      {/* Status Bar */}
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">

          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-brand-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)]">
            <IconActivity size={20} />
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[22px] font-bold leading-tight text-ink-900">
              Neurowatch
            </span>

            <span className="text-[13px] font-normal leading-tight text-ink-600">
              Monitoreo en vivo
            </span>
          </div>

        </div>

        <StatusChip
          label={connLabel}
          status={connStatus}
        />
      </div>

      {/* Connect button */}
      {!bleData.connected && (
        <button
          onClick={connectBLE}
          type="button"
          className="flex w-full items-center justify-center gap-2.5 rounded-[18px] bg-brand-600 py-4 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)] transition-transform active:scale-[0.98]"
        >
          <IconBluetooth size={22} />

          <span className="text-base font-bold">
            Conectar reloj
          </span>
        </button>
      )}

      {/* BLE error */}
      {bleError && (
        <div className="rounded-[14px] border border-alert-border bg-alert-fill p-3.5">
          <p className="text-[13px] font-medium text-alert">
            {bleError}
          </p>
        </div>
      )}

      {/* Connected status */}
      {bleData.connected && bleData.bpm > 0 && (
        <HeroStatus state={status} />
      )}

      {/* Waiting for pulse */}
      {bleData.connected && bleData.bpm === 0 && (
        <div className="rounded-[20px] border border-white/70 bg-white/55 p-6 text-center backdrop-blur-xl">
          <p className="text-[15px] font-medium text-ink-600">
            Conectado al reloj. Coloca el dedo en el sensor para ver tu pulso.
          </p>
        </div>
      )}

      {/* Pulse */}
      <PulseCard
        bpm={bleData.bpm}
        bars={pulseBars}
      />

      {/* Device */}
      <DeviceCard
        connected={bleData.connected}
        signalStatus={
          bleData.connected
            ? "Señal estable"
            : "Sin conectar"
        }
        batteryPercent={batteryPercent}
      />

      {/* Extra battery information */}
      <div className="rounded-[20px] border border-white/70 bg-white/55 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
              <IconBatteryFull size={22} />
            </div>

            <div>
              <p className="text-[13px] font-medium text-ink-600">
                Batería del dispositivo
              </p>

              <p className="mt-1 text-[20px] font-bold text-ink-900">
                {bleData.connected
                  ? `${batteryPercent}%`
                  : "--"}
              </p>
            </div>

          </div>

          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              bleData.connected
                ? "bg-ok/10 text-ok"
                : "bg-ink-900/5 text-ink-500"
            }`}
          >
            {bleData.connected
              ? "Activo"
              : "Sin conectar"}
          </div>

        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        open={alertOpen}
        remainingSeconds={countdownSeconds}
        totalSeconds={settings.countdownSeconds}
        contacts={contacts.map(
          (contact) => contact.name
        )}
        onCancel={cancelAlert}
      />

    </div>
  );
}
```
