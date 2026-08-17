"use client";

import { useEffect, useState } from "react";
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
import { getFacialChecks, type StoredFacialCheck } from "@/lib/storage";

const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export default function HistorialPage() {
  const { recentBPMs, facialHistory } = useNeurowatch();

  /*
   * =====================================================
   * FOTOS DEL HISTORIAL
   * =====================================================
   */

  const [facialChecks, setFacialChecks] = useState<
    StoredFacialCheck[]
  >([]);

  const [selectedPhoto, setSelectedPhoto] =
    useState<string | null>(null);

  useEffect(() => {
    setFacialChecks(getFacialChecks());
  }, [facialHistory]);

  /*
   * =====================================================
   * TENDENCIA BPM
   * =====================================================
   */

  const trendBPMs: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const idx = recentBPMs.length - 1 - i;

    trendBPMs.push(
      recentBPMs[idx] ??
        65 + Math.floor(Math.random() * 20)
    );
  }

  const max = Math.max(...trendBPMs, 1);

  const barColors = trendBPMs.map((bpm) =>
    bpm > 90 || bpm < 55
      ? "bg-warn"
      : "bg-brand-600"
  );

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div className="flex flex-col gap-4 px-5 pt-3.5 md:pt-6 md:max-w-lg md:mx-auto">

      {/* STATUS BAR */}
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

      {/* ENCABEZADO */}
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

      {/* FILTROS */}
      <div className="flex bg-brand-100 rounded-full p-1 gap-1">
        {["Dia", "Semana", "Mes"].map(
          (range, i) => (
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
          )
        )}
      </div>

      {/* =================================================
          TENDENCIA DE PULSO
          ================================================= */}

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
              style={{
                height: `${(bpm / max) * 100}%`,
              }}
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

      {/* =================================================
          HISTORIAL FACIAL
          ================================================= */}

      <GlassCard className="flex flex-col gap-3.5 p-4">

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink-900">
            Bitacora de chequeos faciales
          </span>

          {facialChecks.length > 0 && (
            <span className="text-xs text-ink-400">
              {facialChecks.length} chequeo
              {facialChecks.length === 1
                ? ""
                : "s"}
            </span>
          )}
        </div>

        {/* SIN HISTORIAL */}
        {facialChecks.length === 0 && (
          <p className="text-[13px] font-normal text-ink-400 py-4 text-center">
            No hay chequeos faciales registrados aun.
          </p>
        )}

        {/* LISTA */}
        {facialChecks.length > 0 && (
          <div className="flex flex-col">
            {facialChecks.map(
              (entry, i) => {

                const isLast =
                  i ===
                  facialChecks.length - 1;

                const idx =
                  entry.index;

                const isWarn =
                  idx <= 85 &&
                  idx >= 70;

                const isAlert =
                  idx < 70;

                const chipStatus =
                  isAlert
                    ? "alert"
                    : isWarn
                      ? "warn"
                      : "ok";

                const chipLabel =
                  isAlert
                    ? "Asimetria marcada"
                    : isWarn
                      ? "Leve asimetria"
                      : "Simetrico";

                const dotColor =
                  isAlert
                    ? "bg-alert"
                    : isWarn
                      ? "bg-warn"
                      : "bg-ok";

                return (
                  <div
                    key={
                      entry.id ??
                      entry.date + i
                    }
                    className={`flex gap-3 ${
                      isLast
                        ? ""
                        : "pb-3"
                    }`}
                  >

                    {/* LÍNEA */}
                    <div className="w-5 flex flex-col items-center gap-1">
                      <span
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColor}`}
                      />

                      {!isLast && (
                        <span className="w-0.5 flex-1 bg-brand-100" />
                      )}
                    </div>

                    {/* FOTO */}
                    <button
                      type="button"
                      onClick={() => {
                        if (entry.image) {
                          setSelectedPhoto(
                            entry.image
                          );
                        }
                      }}
                      disabled={!entry.image}
                      className={`h-16 w-16 rounded-[12px] overflow-hidden shrink-0 bg-brand-100 flex items-center justify-center text-brand-600 border border-brand-100 ${
                        entry.image
                          ? "cursor-pointer transition-transform hover:scale-105 active:scale-95"
                          : ""
                      }`}
                      aria-label={
                        entry.image
                          ? "Ver foto del chequeo"
                          : "Este chequeo no tiene foto"
                      }
                    >
                      {entry.image ? (
                        <img
                          src={entry.image}
                          alt="Foto del chequeo facial"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <IconUserRound
                          size={28}
                        />
                      )}
                    </button>

                    {/* INFORMACIÓN */}
                    <div className="flex flex-1 flex-col gap-1.5 min-w-0">

                      <span className="text-[13px] font-semibold text-ink-900">
                        {entry.date}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <StatusChip
                          label={
                            chipLabel
                          }
                          status={
                            chipStatus
                          }
                          size="sm"
                        />

                        <span className="text-xs text-ink-500 tabular-nums">
                          Indice {idx}
                        </span>
                      </div>

                      {entry.image && (
                        <span className="text-[11px] text-brand-600">
                          Toca la foto para ampliar
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </GlassCard>

      {/* =================================================
          MODAL DE FOTO GRANDE
          ================================================= */}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() =>
            setSelectedPhoto(null)
          }
        >
          <div
            className="relative max-h-[90vh] max-w-[92vw] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={selectedPhoto}
              alt="Foto ampliada del chequeo facial"
              className="max-h-[82vh] max-w-[88vw] rounded-xl object-contain"
            />

            <button
              type="button"
              onClick={() =>
                setSelectedPhoto(null)
              }
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg font-bold text-white backdrop-blur-sm transition hover:bg-black/80"
              aria-label="Cerrar foto"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
