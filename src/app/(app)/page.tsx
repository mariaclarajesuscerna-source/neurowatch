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

  return (
    <div className="flex flex-col gap-3.5 px-5 pt-3.5 md:pt-6 md:max-w-lg md:mx-auto">

      {/* Barra de estado */}
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

      {/* Encabezado */}
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

      {/* BotÃģn conectar reloj */}
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

      {/* Error BLE */}
      {bleError && (
        <div className="rounded-[14px] bg-alert-fill border border-alert-border p-3.5">
          <p className="text-[13px] font-medium text-alert">
            {bleError}
          </p>
        </div>
      )}

      {/* Estado principal */}
      {bleData.connected && bleData.bpm > 0 && (
        <HeroStatus state={status} />
      )}

      {/* Esperando datos */}
      {bleData.connected && bleData.bpm === 0 && (
        <div className="rounded-[20px] bg-white/55 backdrop-blur-xl border border-white/70 p-6 text-center">
          <p className="text-[15px] font-medium text-ink-600">
            Conectado al reloj. Coloca el dedo en el sensor para ver tu pulso.
          </p>
        </div>
      )}

      {/* Pulso */}
      <PulseCard
        bpm={bleData.bpm}
        bars={pulseBars}
      />

      {/* Dispositivo */}
      <DeviceCard
        connected={bleData.connected}
        signalStatus={
          bleData.connected
            ? "Senal estable"
            : "Sin conectar"
        }
        batteryPercent={Math.round(bleData.batteryPercent)}
      />

      {/* Alertas */}
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
