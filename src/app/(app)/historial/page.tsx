"use client";

import { useEffect, useMemo, useState } from "react";

import {
  IconActivity,
  IconSignal,
  IconWifi,
  IconBatteryFull,
  IconUserRound,
  IconCircleCheck,
} from "@/components/ui/icons";

import GlassCard from "@/components/ui/GlassCard";
import StatusChip from "@/components/ui/StatusChip";

import { useNeurowatch } from "@/components/NeurowatchProvider";

import {
  getFacialChecks,
  type StoredFacialCheck,
} from "@/lib/storage";

import { useLanguage } from "@/components/LanguageProvider";

const daysEs = [
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
  "Dom",
];

const daysQu = [
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

  /* =====================================================
     ESTADOS
  ====================================================== */

  const [facialChecks, setFacialChecks] =
    useState<StoredFacialCheck[]>([]);

  const [selectedPhoto, setSelectedPhoto] =
    useState<StoredFacialCheck | null>(null);

  const [range, setRange] =
    useState<"Dia" | "Semana" | "Mes">(
      "Semana"
    );

  /* =====================================================
     CARGAR CHEQUEOS CON FOTOS
  ====================================================== */

  useEffect(() => {
    const loadChecks = () => {
      const checks = getFacialChecks();

      setFacialChecks(checks);
    };

    loadChecks();
  }, [facialHistory]);

  /* =====================================================
     TENDENCIA DE PULSO
  ====================================================== */

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

  /* =====================================================
     ESTADÍSTICAS FACIALES
  ====================================================== */

  const facialStats = useMemo(() => {
    if (facialChecks.length === 0) {
      return {
        average: 0,
        best: 0,
        latest: 0,
      };
    }

    const values = facialChecks.map(
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

  /* =====================================================
     RESULTADO
  ====================================================== */

  const getResult = (index: number) => {
    if (index < 70) {
      return {
        label:
          language === "qu"
            ? "Hatun mana kuska"
            : "Asimetría marcada",
        status: "alert" as const,
        dot: "bg-alert",
      };
    }

    if (index < 86) {
      return {
        label:
          language === "qu"
            ? "Pisi mana kuska"
            : "Leve asimetría",
        status: "warn" as const,
        dot: "bg-warn",
      };
    }

    return {
      label:
        language === "qu"
          ? "Kuskalla"
          : "Simétrico",
      status: "ok" as const,
      dot: "bg-ok",
    };
  };

  const days =
    language === "qu"
      ? daysQu
      : daysEs;

  /* =====================================================
     TEXTOS
  ====================================================== */

  const title =
    language === "qu"
      ? "Kawsaypa ñawpaq qhawariyninkuna"
      : "Historial de salud";

  const subtitle =
    language === "qu"
      ? "Qhawariykuna hinallataq wiñaynin"
      : "Tus registros y evolución";

  const rangeLabels = {
    Dia:
      language === "qu"
        ? "P'unchay"
        : "Día",

    Semana:
      language === "qu"
        ? "Simana"
        : "Semana",

    Mes:
      language === "qu"
        ? "Killa"
        : "Mes",
  };

  /* =====================================================
     RENDER
  ====================================================== */

  return (
    <>
      <div className="flex flex-col gap-4 px-5 pt-3.5 md:pt-6 md:max-w-lg md:mx-auto">

        {/* STATUS BAR */}

        <div className="flex items-center justify-between px-1 md:hidden">
          <span className="text-[15px] font-semibold text-ink-900">
            {new Date().toLocaleTimeString(
              "es-ES",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </span>

          <div className="flex items-center gap-1.5 text-ink-900">
            <IconSignal size={16} />
            <IconWifi size={16} />
            <IconBatteryFull size={16} />
          </div>
        </div>

        {/* ENCABEZADO */}

        <div className="overflow-hidden rounded-[28px] border border-[#dfc49a] bg-[#fff9ed] shadow-[0_12px_30px_rgba(72,48,25,0.08)]">

          <div
            className="h-2"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  #c94a20 0px,
                  #c94a20 8px,
                  #e8a33d 8px,
                  #e8a33d 16px,
                  #2f8f5b 16px,
                  #2f8f5b 24px,
                  #087f83 24px,
                  #087f83 32px
                )
              `,
            }}
          />

          <div className="flex items-center gap-3 p-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#087f83] text-white shadow-[0_6px_16px_rgba(8,127,131,0.20)]">
              <IconActivity size={22} />
            </div>

            <div className="min-w-0">

              <h1 className="text-[22px] font-black leading-tight text-[#075d63]">
                {title}
              </h1>

              <p className="mt-1 text-[13px] text-[#79634d]">
                {subtitle}
              </p>

            </div>
          </div>
        </div>

        {/* FILTROS */}

        <div className="flex gap-1 rounded-full bg-[#f1e5ce] p-1">

          {(
            ["Dia", "Semana", "Mes"] as const
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setRange(item)
              }
              className={`flex-1 rounded-full py-2 text-center text-[13px] transition-colors ${
                range === item
                  ? "bg-[#087f83] font-bold text-white"
                  : "font-medium text-[#6b5842]"
              }`}
            >
              {rangeLabels[item]}
            </button>
          ))}

        </div>

        {/* RESUMEN FACIAL */}

        <GlassCard className="rounded-[24px] border border-[#dfc49a] bg-[#fff9ed] p-4">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#263a32]">
                {language === "qu"
                  ? "Uya qhawariypa pisiyachiy"
                  : "Resumen facial"}
              </h2>

              <p className="mt-0.5 text-xs text-[#8c7660]">
                {language === "qu"
                  ? "Qhawariykikunapa wiñaynin"
                  : "Evolución de tus chequeos"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e4f1ed] text-[#087f83]">
              <IconUserRound size={22} />
            </div>

          </div>

          <div className="grid grid-cols-3 gap-2">

            <div className="rounded-xl bg-[#edf6f3] p-3 text-center">
              <p className="text-[11px] text-[#78634c]">
                {language === "qu"
                  ? "Qhawariykuna"
                  : "Chequeos"}
              </p>

              <p className="mt-1 text-xl font-bold text-[#263a32]">
                {facialChecks.length}
              </p>
            </div>

            <div className="rounded-xl bg-[#f8efd9] p-3 text-center">
              <p className="text-[11px] text-[#78634c]">
                {language === "qu"
                  ? "Chawpi"
                  : "Promedio"}
              </p>

              <p className="mt-1 text-xl font-bold text-[#263a32]">
                {facialStats.average ||
                  "--"}
              </p>
            </div>

            <div className="rounded-xl bg-[#fbede8] p-3 text-center">
              <p className="text-[11px] text-[#78634c]">
                {language === "qu"
                  ? "Qhipa"
                  : "Último"}
              </p>

              <p className="mt-1 text-xl font-bold text-[#263a32]">
                {facialStats.latest ||
                  "--"}
              </p>
            </div>

          </div>

          {/* ESTADO ACTUAL */}

          {facialStats.latest > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#edf8f1] px-3 py-2.5">

              <IconCircleCheck size={19} />

              <span className="text-xs font-medium text-[#3f5c4b]">
                {facialStats.latest >= 86
                  ? language === "qu"
                    ? "Qhipa qhawariyqa allin kaypi kachkan."
                    : "Tu último chequeo está dentro del rango esperado."
                  : facialStats.latest >= 70
                    ? language === "qu"
                      ? "Qhipa qhawariyqa pisi tikrayta rikuchin."
                      : "Tu último chequeo muestra una variación leve."
                    : language === "qu"
                      ? "Qhipa qhawariyqa hatun tikrayta rikuchin."
                      : "Tu último resultado presenta una variación marcada."}
              </span>

            </div>
          )}

        </GlassCard>

        {/* EVOLUCIÓN DE SIMETRÍA */}

        {facialChecks.length > 0 && (
          <GlassCard className="rounded-[24px] border border-[#dfc49a] bg-[#fff9ed] p-4">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h2 className="text-sm font-bold text-[#263a32]">
                  {language === "qu"
                    ? "Ch'iqiy wiñaynin"
                    : "Evolución de simetría"}
                </h2>

                <p className="mt-0.5 text-xs text-[#8c7660]">
                  {language === "qu"
                    ? "Qhipa qhawariykuna"
                    : "Últimos chequeos"}
                </p>
              </div>

              <span className="text-xs font-semibold text-[#087f83]">
                {facialStats.best}{" "}
                {language === "qu"
                  ? "allin"
                  : "mejor"}
              </span>

            </div>

            <div className="relative h-[150px]">

              <div className="absolute left-0 right-0 top-0 border-t border-ink-900/10" />

              <div className="absolute left-0 right-0 top-1/2 border-t border-ink-900/10" />

              <div className="absolute bottom-0 left-0 right-0 border-t border-ink-900/10" />

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
                  .map(
                    (
                      check,
                      i
                    ) => {

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
                            check.id ??
                            i
                          }
                          className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                        >

                          <span className="text-[10px] font-bold text-[#6b5842]">
                            {
                              check.index
                            }
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
                    }
                  )}

              </div>
            </div>

            <div className="mt-2 flex justify-between text-[10px] text-[#9a8065]">

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

        <GlassCard className="rounded-[24px] border border-[#dfc49a] bg-[#fff9ed] p-4">

          <div className="flex items-center justify-between">

            <span className="text-sm font-semibold text-[#263a32]">
              {language === "qu"
                ? "Sunqupa muyuriyninpa wiñaynin"
                : "Tendencia de pulso"}
            </span>

            <span className="text-xs font-normal text-[#6b5842]">
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
                    : "Últimos 7 días"}
            </span>

          </div>

          <div className="mt-4 h-[120px] flex items-end gap-2">

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

          <div className="mt-2 flex gap-2">

            {days.map(
              (day) => (
                <span
                  key={day}
                  className="flex-1 text-center text-[11px] font-normal text-[#9a8065]"
                >
                  {day}
                </span>
              )
            )}

          </div>

        </GlassCard>

        {/* BITÁCORA */}

        <GlassCard className="rounded-[24px] border border-[#dfc49a] bg-[#fff9ed] p-4">

          <div className="flex items-center justify-between">

            <span className="text-sm font-semibold text-[#263a32]">
              {language === "qu"
                ? "Uya qhawariykunapa qillqana"
                : "Bitácora de chequeos faciales"}
            </span>

            {facialChecks.length > 0 && (
              <span className="text-[11px] text-[#9a8065]">
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

          <div className="mt-4 flex flex-col">

            {facialChecks.length === 0 && (
              <div className="py-7 text-center">

                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e4f1ed] text-[#087f83]">
                  <IconUserRound size={24} />
                </div>

                <p className="text-[13px] font-medium text-[#78634c]">
                  {language === "qu"
                    ? "Manaraqmi uya qhawariykuna waqaychasqachu."
                    : "No hay chequeos faciales registrados aún."}
                </p>

                <p className="mt-1 text-[11px] text-[#9a8065]">
                  {language === "qu"
                    ? "Ruwariy ñawpaq uya qhawariyta qallarinaykipaq."
                    : "Realiza tu primer chequeo para comenzar."}
                </p>

              </div>
            )}

            {facialChecks.map(
              (
                entry,
                i
              ) => {

                const isLast =
                  i ===
                  facialChecks.length -
                    1;

                const result =
                  getResult(
                    entry.index
                  );

                return (
                  <div
                    key={
                      entry.id ??
                      entry.date +
                        i
                    }
                    className={`flex gap-3 ${
                      isLast
                        ? ""
                        : "pb-4"
                    }`}
                  >

                    {/* LÍNEA */}

                    <div className="flex w-5 flex-col items-center gap-1">

                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${result.dot}`}
                      />

                      {!isLast && (
                        <span className="w-0.5 flex-1 bg-[#e5dccb]" />
                      )}

                    </div>

                    {/* FOTO */}

                    <button
                      type="button"
                      disabled={!entry.image}
                      onClick={() => {
                        if (
                          entry.image
                        ) {
                          setSelectedPhoto(
                            entry
                          );
                        }
                      }}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-[#f7efe0] ${
                        entry.image
                          ? "cursor-pointer transition-transform hover:scale-105 active:scale-95"
                          : ""
                      }`}
                    >

                      {entry.image ? (
                        <img
                          src={
                            entry.image
                          }
                          alt={
                            language === "qu"
                              ? "Uya qhawariypa rikch'aynin"
                              : "Foto del chequeo facial"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#087f83]">
                          <IconUserRound size={27} />
                        </div>
                      )}

                    </button>

                    {/* INFORMACIÓN */}

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">

                      <div className="flex items-center justify-between gap-2">

                        <span className="text-[13px] font-semibold text-[#263a32]">
                          {entry.date}
                        </span>

                        {entry.image && (
                          <span className="text-[10px] text-[#087f83]">
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

                        <span className="text-xs tabular-nums text-[#8c7660]">
                          {language === "qu"
                            ? "Yupay"
                            : "Índice"}{" "}
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

                <p className="text-sm font-bold text-[#263a32]">
                  {language === "qu"
                    ? "Uya qhawariy"
                    : "Chequeo facial"}
                </p>

                <p className="text-xs text-[#8c7660]">
                  {
                    selectedPhoto.date
                  }
                </p>

              </div>

              <div className="text-right">

                <p className="text-xl font-bold text-[#075d63]">
                  {
                    selectedPhoto.index
                  }
                </p>

                <p className="text-[10px] text-[#8c7660]">
                  {language === "qu"
                    ? "Yupay"
                    : "Índice"}
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
