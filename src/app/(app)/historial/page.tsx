"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconActivity,
  IconSignal,
  IconWifi,
  IconBatteryFull,
  IconUserRound,
  IconCircleCheck,
  IconTriangleAlert,
  IconRefreshCw,
} from "@/components/ui/icons";
import GlassCard from "@/components/ui/GlassCard";
import StatusChip from "@/components/ui/StatusChip";
import { useNeurowatch } from "@/components/NeurowatchProvider";
import { useLanguage } from "@/components/LanguageProvider";
import {
  getFacialChecks,
  type StoredFacialCheck,
} from "@/lib/storage";

const days = [
  "Lun",
  "Mar",
  "Miq",
  "Jue",
  "Vie",
  "Sab",
  "Dom",
];

export default function HistorialPage() {
  const {
    recentBPMs,
    facialHistory,
  } = useNeurowatch();

  const { language } = useLanguage();

  const [facialChecks, setFacialChecks] =
    useState<StoredFacialCheck[]>([]);

  const [selectedPhoto, setSelectedPhoto] =
    useState<StoredFacialCheck | null>(null);

  const [range, setRange] =
    useState<"Dia" | "Semana" | "Mes">(
      "Semana"
    );

  useEffect(() => {
    const loadChecks = () => {
      const checks = getFacialChecks();
      setFacialChecks(checks);
    };

    loadChecks();
  }, [facialHistory]);

  const trendBPMs: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const idx =
      recentBPMs.length - 1 - i;

    trendBPMs.push(
      recentBPMs[idx] ?? 65
    );
  }

  const max = Math.max(
    ...trendBPMs,
    1
  );

  const barColors = trendBPMs.map(
    (bpm) =>
      bpm > 90 || bpm < 55
        ? "bg-warn"
        : "bg-brand-600"
  );

  const facialStats = useMemo(() => {
    if (facialChecks.length === 0) {
      return {
        average: 0,
        best: 0,
        latest: 0,
      };
    }

    const values =
      facialChecks.map(
        (check) => check.index
      );

    const average = Math.round(
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      ) / values.length
    );

    return {
      average,
      best: Math.max(...values),
      latest: values[0],
    };
  }, [facialChecks]);

  const getResult = (index: number) => {
    if (index < 70) {
      return {
        label:
          language === "qu"
            ? "Hatun mana kuska"
            : "Asimetria marcada",
        status: "alert" as const,
        dot: "bg-alert",
      };
    }

    if (index < 86) {
      return {
        label:
          language === "qu"
            ? "Pisi mana kuska"
            : "Leve asimetria",
        status: "warn" as const,
        dot: "bg-warn",
      };
    }

    return {
      label:
        language === "qu"
          ? "Kuskalla"
          : "Simetrico",
      status: "ok" as const,
      dot: "bg-ok",
    };
  };

  return (
    <>
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
              {language === "qu"
                ? "Qhawariykuna hinallataq ñawpaq kawsay"
                : "Tendencias y bitacora"}
            </span>
          </div>
        </div>

        {/* FILTROS */}

        <div className="flex bg-brand-100 rounded-full p-1 gap-1">
          {[
            {
              key: "Dia" as const,
              label:
                language === "qu"
                  ? "P'unchay"
                  : "Dia",
            },
            {
              key: "Semana" as const,
              label:
                language === "qu"
                  ? "Simana"
                  : "Semana",
            },
            {
              key: "Mes" as const,
              label:
                language === "qu"
                  ? "Killa"
                  : "Mes",
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() =>
                setRange(item.key)
              }
              className={`flex-1 rounded-full py-2 text-center text-[13px] transition-colors ${
                range === item.key
                  ? "bg-brand-600 text-white font-bold"
                  : "text-ink-600 font-medium"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* RESUMEN FACIAL */}

        <GlassCard className="p-4">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-ink-900">
                {language === "qu"
                  ? "Uya qhawariypa pisiyachiy"
                  : "Resumen facial"}
              </h2>

              <p className="text-xs text-ink-500 mt-0.5">
                {language === "qu"
                  ? "Qhawariykikunapa wiñaynin"
                  : "Evolucion de tus chequeos"}
              </p>
            </div>

            <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600">
              <IconUserRound size={22} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">

            <div className="rounded-xl bg-brand-100/70 p-3 text-center">
              <p className="text-[11px] text-ink-500">
                {language === "qu"
                  ? "Qhawariykuna"
                  : "Chequeos"}
              </p>

              <p className="mt-1 text-xl font-bold text-ink-900">
                {facialChecks.length}
              </p>
            </div>

            <div className="rounded-xl bg-brand-100/70 p-3 text-center">
              <p className="text-[11px] text-ink-500">
                {language === "qu"
                  ? "Chawpi"
                  : "Promedio"}
              </p>

              <p className="mt-1 text-xl font-bold text-ink-900">
                {facialStats.average || "--"}
              </p>
            </div>

            <div className="rounded-xl bg-brand-100/70 p-3 text-center">
              <p className="text-[11px] text-ink-500">
                {language === "qu"
                  ? "Qhipa"
                  : "Ultimo"}
              </p>

              <p className="mt-1 text-xl font-bold text-ink-900">
                {facialStats.latest || "--"}
              </p>
            </div>
          </div>

          {facialStats.latest > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-ok-fill px-3 py-2.5">
              <IconCircleCheck size={19} />

              <span className="text-xs font-medium text-ink-700">
                {facialStats.latest >= 86
                  ? language === "qu"
                    ? "Qhipa qhawariyqa allin kaypi kachkan."
                    : "Tu ultimo chequeo esta dentro del rango esperado."
                  : facialStats.latest >= 70
                    ? language === "qu"
                      ? "Qhipa qhawariyqa pisi tikrayta rikuchin."
                      : "Tu ultimo chequeo muestra una variacion leve."
                    : language === "qu"
                      ? "Qhipa qhawariyqa hatun tikrayta rikuchin."
                      : "Tu ultimo resultado presenta una variacion marcada."}
              </span>
            </div>
          )}
        </GlassCard>

        {/* EVOLUCION */}

        {facialChecks.length > 0 && (
          <GlassCard className="p-4">

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-ink-900">
                  {language === "qu"
                    ? "Ch'iqiy wiñaynin"
                    : "Evolucion de simetria"}
                </h2>

                <p className="text-xs text-ink-500 mt-0.5">
                  {language === "qu"
                    ? "Qhipa qhawariykuna"
                    : "Ultimos chequeos"}
                </p>
              </div>

              <span className="text-xs font-semibold text-brand-600">
                {facialStats.best}{" "}
                {language === "qu"
                  ? "allin"
                  : "mejor"}
              </span>
            </div>

            <div className="relative h-[150px]">

              <div className="absolute left-0 right-0 top-0 border-t border-ink-900/10" />

              <div className="absolute left-0 right-0 top-1/2 border-t border-ink-900/10" />

              <div className="absolute left-0 right-0 bottom-0 border-t border-ink-900/10" />

              <div className="absolute inset-0 flex items-end gap-2 px-1">

                {facialChecks
                  .slice(
                    0,
                    Math.min(
                      facialChecks.length,
                      8
                    )
                  )
                  .reverse()
                  .map((check, i) => {
                    const height =
                      Math.max(
                        8,
                        check.index
                      );

                    const result =
                      getResult(
                        check.index
                      );

                    return (
                      <div
                        key={
                          check.id ?? i
                        }
                        className="flex-1 h-full flex flex-col justify-end items-center gap-1"
                      >
                        <span className="text-[10px] font-bold text-ink-600">
                          {check.index}
                        </span>

                        <div
                          className={`w-full max-w-[28px] rounded-t-lg ${result.dot}`}
                          style={{
                            height:
                              `${height}%`,
                            minHeight:
                              "8px",
                          }}
                        />
                      </div>
                    );
                  })}

              </div>
            </div>

            <div className="mt-2 flex justify-between text-[10px] text-ink-400">
              <span>
                {language === "qu"
                  ? "Ñawpaq"
                  : "Anterior"}
              </span>

              <span>
                {language === "qu"
                  ? "Kunan"
                  : "Actual"}
              </span>
            </div>

          </GlassCard>
        )}

        {/* TENDENCIA DE PULSO */}

        <GlassCard className="flex flex-col gap-3 p-4">

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-900">
              {language === "qu"
                ? "Sunqupa muyuriyninpa wiñaynin"
                : "Tendencia de pulso"}
            </span>

            <span className="text-xs font-normal text-ink-600">
              {range === "Dia"
                ? language === "qu"
                  ? "Kunan"
                  : "Hoy"
                : range === "Mes"
                  ? language === "qu"
                    ? "Kay killa"
                    : "Este mes"
                  : language === "qu"
                    ? "Qhipa 7 p'unchay"
                    : "Ultimos 7 dias"}
            </span>
          </div>

          <div className="h-[120px] flex items-end gap-2">
            {trendBPMs.map(
              (bpm, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-[6px] ${barColors[i]}`}
                  style={{
                    height: `${Math.max(
                      8,
                      (bpm / max) *
                        100
                    )}%`,
                  }}
                />
              )
            )}
          </div>

          <div className="flex gap-2">
            {days.map((day) => (
              <span
                key={day}
                className="flex-1 text-center text-[11px] font-normal text-ink-400"
              >
                {day}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* BITACORA */}

        <GlassCard className="flex flex-col gap-3.5 p-4">

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-900">
              {language === "qu"
                ? "Uya qhawariykunapa qillqana"
                : "Bitacora de chequeos faciales"}
            </span>

            {facialChecks.length > 0 && (
              <span className="text-[11px] text-ink-400">
                {facialChecks.length}{" "}
                {facialChecks.length === 1
                  ? language === "qu"
                    ? "qillqasqa"
                    : "registro"
                  : language === "qu"
                    ? "qillqakuna"
                    : "registros"}
              </span>
            )}
          </div>

          <div className="flex flex-col">

            {facialChecks.length === 0 && (
              <div className="py-7 text-center">

                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                  <IconUserRound size={24} />
                </div>

                <p className="text-[13px] font-medium text-ink-500">
                  {language === "qu"
                    ? "Manaraqmi uya qhawariykuna waqaychasqachu."
                    : "No hay chequeos faciales registrados aun."}
                </p>

                <p className="mt-1 text-[11px] text-ink-400">
                  {language === "qu"
                    ? "Ruwariy ñawpaq uya qhawariyta qallarinaykipaq."
                    : "Realiza tu primer chequeo para comenzar."}
                </p>

              </div>
            )}

            {facialChecks.map(
              (entry, i) => {
                const isLast =
                  i ===
                  facialChecks.length - 1;

                const result =
                  getResult(
                    entry.index
                  );

                return (
                  <div
                    key={
                      entry.id ??
                      entry.date + i
                    }
                    className={`flex gap-3 ${
                      isLast ? "" : "pb-4"
                    }`}
                  >

                    <div className="w-5 flex flex-col items-center gap-1">

                      <span
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${result.dot}`}
                      />

                      {!isLast && (
                        <span className="w-0.5 flex-1 bg-brand-100" />
                      )}

                    </div>

                    <button
                      type="button"
                      disabled={!entry.image}
                      onClick={() => {
                        if (entry.image) {
                          setSelectedPhoto(
                            entry
                          );
                        }
                      }}
                      className={`h-16 w-16 rounded-[12px] overflow-hidden shrink-0 bg-brand-100 flex items-center justify-center text-brand-600 ${
                        entry.image
                          ? "cursor-pointer transition-transform hover:scale-105 active:scale-95"
                          : ""
                      }`}
                    >
                      {entry.image ? (
                        <img
                          src={entry.image}
                          alt={
                            language === "qu"
                              ? "Uya qhawariypa rikch'aynin"
                              : "Foto del chequeo facial"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <IconUserRound size={27} />
                      )}
                    </button>

                    <div className="flex flex-1 min-w-0 flex-col gap-1.5">

                      <div className="flex items-center justify-between gap-2">

                        <span className="text-[13px] font-semibold text-ink-900">
                          {entry.date}
                        </span>

                        {entry.image && (
                          <span className="text-[10px] text-brand-600">
                            {language === "qu"
                              ? "Rikch'ay"
                              : "Ver foto"}
                          </span>
                        )}

                      </div>

                      <div className="flex flex-wrap items-center gap-2">

                        <StatusChip
                          label={
                            result.label
                          }
                          status={
                            result.status
                          }
                          size="sm"
                        />

                        <span className="text-xs text-ink-500 tabular-nums">
                          {language === "qu"
                            ? "Yupay"
                            : "Indice"}{" "}
                          {entry.index}
                        </span>

                      </div>

                    </div>
                  </div>
                );
              }
            )}

          </div>
        </GlassCard>

      </div>

      {/* MODAL DE FOTO */}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() =>
            setSelectedPhoto(null)
          }
        >

          <div
            className="relative max-h-[92vh] max-w-[94vw] rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={
                selectedPhoto.image
              }
              alt={
                language === "qu"
                  ? "Uya qhawariypa rikch'aynin"
                  : "Foto ampliada del chequeo facial"
              }
              className="max-h-[78vh] max-w-[90vw] rounded-xl object-contain"
            />

            <div className="flex items-center justify-between gap-3 px-2 py-3">

              <div>
                <p className="text-sm font-bold text-ink-900">
                  {language === "qu"
                    ? "Uya qhawariy"
                    : "Chequeo facial"}
                </p>

                <p className="text-xs text-ink-500">
                  {selectedPhoto.date}
                </p>
              </div>

              <div className="text-right">

                <p className="text-xl font-bold text-ink-900">
                  {selectedPhoto.index}
                </p>

                <p className="text-[10px] text-ink-500">
                  {language === "qu"
                    ? "Yupay"
                    : "Indice"}
                </p>

              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedPhoto(null)
              }
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-xl font-bold text-white backdrop-blur-sm transition hover:bg-black/85"
              aria-label={
                language === "qu"
                  ? "Wisqay"
                  : "Cerrar foto"
              }
            >
              ×
            </button>

          </div>
        </div>
      )}
    </>
  );
}
