"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconActivity,
  IconSignal,
  IconWifi,
  IconBatteryFull,
  IconWatch,
  IconTimer,
  IconWrench,
  IconPower,
  IconBatteryLow,
  IconSmartphone,
  IconRefreshCw,
} from "@/components/ui/icons";
import GlassCard from "@/components/ui/GlassCard";
import { useNeurowatch } from "@/components/NeurowatchProvider";

export default function DesconectadoPage() {
  const router = useRouter();
  const { bleData, disconnectedSince, connectBLE } = useNeurowatch();

  useEffect(() => {
    if (bleData.connected) {
      router.replace("/");
    }
  }, [bleData.connected, router]);

  const secondsAgo = disconnectedSince
    ? Math.floor((Date.now() - disconnectedSince) / 1000)
    : 0;
  const minutes = Math.floor(secondsAgo / 60);
  const secs = secondsAgo % 60;

  const handleRetry = async () => {
    await connectBLE();
  };

  return (
    <div className="flex flex-col gap-4 px-5 pt-4 md:pt-6 md:max-w-lg md:mx-auto">
      {/* Status Bar — mobile only */}
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
      <div className="flex items-center gap-2.5">
        <div className="h-[34px] w-[34px] rounded-[11px] bg-brand-600 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.25)] text-white">
          <IconActivity size={20} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[22px] font-bold text-ink-900 leading-tight">
            Neurowatch
          </span>
          <span className="text-[13px] font-normal text-ink-600 leading-tight">
            Estado del dispositivo
          </span>
        </div>
      </div>

      {/* Offline Card */}
      <GlassCard className="rounded-[22px] flex flex-col gap-3 p-6 items-center">
        <div className="h-[72px] w-[72px] rounded-full bg-muted/15 border border-muted flex items-center justify-center text-muted">
          <IconWatch size={34} />
        </div>

        <h2 className="text-[22px] font-bold text-ink-900">
          Reloj desconectado
        </h2>

        <span className="inline-flex items-center gap-1.5 px-3 py-[5px] rounded-xl bg-muted/15">
          <span className="h-2 w-2 rounded-full bg-muted shrink-0" />
          <span className="text-[13px] font-semibold text-ink-600">
            Desconectado
          </span>
        </span>

        <div className="flex items-center gap-1.5 text-ink-400">
          <IconTimer size={14} />
          <span className="text-[13px] font-normal text-ink-600">
            Última señal hace {minutes} min {secs} s
          </span>
        </div>
      </GlassCard>

      {/* Troubleshoot Card */}
      <GlassCard className="rounded-[22px] flex flex-col gap-3.5 p-4">
        <div className="flex items-center gap-2">
          <IconWrench size={18} />
          <span className="text-[15px] font-semibold text-ink-900">
            Cómo reconectar
          </span>
        </div>

        {[
          { Icon: IconPower, text: "Revisa que el reloj esté encendido." },
          { Icon: IconBatteryLow, text: "Revisa la batería del reloj." },
          { Icon: IconSmartphone, text: "Acerca el teléfono al reloj." },
        ].map(({ Icon, text }, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 text-brand-600">
              <Icon size={18} />
            </div>
            <p className="text-sm font-normal text-ink-600 leading-[1.35] max-w-[240px]">
              {text}
            </p>
          </div>
        ))}
      </GlassCard>

      {/* Retry Button */}
      <button
        onClick={handleRetry}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-[18px] bg-white/80 border-[1.5px] border-brand-500 text-brand-600"
      >
        <IconRefreshCw size={20} />
        <span className="text-base font-semibold">Reintentar conexión</span>
      </button>
    </div>
  );
}
