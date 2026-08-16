"use client";

import {
  IconActivity,
  IconSignal,
  IconWifi,
  IconBatteryFull,
  IconUserRound,
} from "@/components/ui/icons";
import GlassCard from "@/components/ui/GlassCard";
import StatusChip from "@/components/ui/StatusChip";
import { useNeurowatch } from "@/components/NeurowatchProvider";

const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export default function HistorialPage() {
  const { recentBPMs, status, facialHistory } = useNeurowatch();

  // Weekly trend: map last 7 readings (padded)
  const trendBPMs: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const idx = recentBPMs.length - 1 - i;
    trendBPMs.push(recentBPMs[idx] ?? 65 + Math.floor(Math.random() * 20));
  }

  const max = Math.max(...trendBPMs, 1);

  const barColors = trendBPMs.map((bpm) =>
    bpm > 90 || bpm < 55 ? "bg-warn" : "bg-brand-600"
  );

  return (
    <div className="flex flex-col gap-4 px-5 pt-3.5 md:pt-6 md:max-w-lg md:mx-auto">
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

      <div className="flex items-center gap-2.5">
        <div className="h-[34px] w-[34px] rounded-[11px] bg-brand-600 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.25)] text-white">
          <IconActivity size={20} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[22px] font-bold text-ink-900 leading-tight">
            Neurowatch
          </span>
          <span className="text-[13px] font-normal text-ink-600 leading-tight">
            Tendencias y bitacora
          </span>
        </div>
      </div>

      <div className="flex bg-brand-100 rounded-full p-1 gap-1">
        {["Dia", "Semana", "Mes"].map((range, i) => (
          <button
            key={range}
            className={`flex-1 rounded-full py-2 text-center text-[13px] transition-colors ${
              i === 1
                ? "bg-brand-600 text-white font-bold"
                : "text-ink-600 font-medium"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      <GlassCard className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink-900">
            Tendencia de pulso
          </span>
          <span className="text-xs font-normal text-ink-600">
            Ultimos 7 dias
          </span>
        </div>

        <div className="h-[120px] flex items-end gap-2">
          {trendBPMs.map((bpm, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-[6px] ${barColors[i]}`}
              style={{ height: `${(bpm / max) * 100}%` }}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {days.map((d) => (
            <span
              key={d}
              className="flex-1 text-center text-[11px] font-normal text-ink-400"
            >
              {d}
            </span>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-3.5 p-4">
        <span className="text-sm font-semibold text-ink-900">
          Bitacora de chequeos faciales
        </span>

        <div className="flex flex-col">
          {facialHistory.length === 0 && (
            <p className="text-[13px] font-normal text-ink-400 py-4 text-center">
              No hay chequeos faciales registrados aun.
            </p>
          )}
          {facialHistory.map((entry, i) => {
            const isLast = i === facialHistory.length - 1;
            const idx = entry.index;
            const isWarn = idx <= 85 && idx >= 70;
            const isAlert = idx < 70;
            const chipStatus = isAlert ? "alert" : isWarn ? "warn" : "ok";
            const chipLabel = isAlert
              ? "Asimetria marcada"
              : isWarn
                ? "Leve asimetria"
                : "Simetrico";
            const dotColor = isAlert
              ? "bg-alert"
              : isWarn
                ? "bg-warn"
                : "bg-ok";

            return (
              <div
                key={entry.date + i}
                className={`flex gap-3 ${isLast ? "" : "pb-2"}`}
              >
                <div className="w-5 flex flex-col items-center gap-1">
                  <span
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColor}`}
                  />
                  {!isLast && (
                    <span className="w-0.5 flex-1 bg-brand-100" />
                  )}
                </div>
                <div className="h-12 w-12 rounded-[10px] bg-brand-100 flex items-center justify-center shrink-0 text-brand-600">
                  <IconUserRound size={24} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-semibold text-ink-900">
                    {entry.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusChip
                      label={chipLabel}
                      status={chipStatus}
                      size="sm"
                    />
                    <span className="text-xs text-ink-500 tabular-nums">
                      Indice {idx}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
