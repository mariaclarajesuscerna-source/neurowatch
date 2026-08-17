"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
import { useLanguage } from "@/components/LanguageProvider";

import {
  getFacialChecks,
  type StoredFacialCheck,
} from "@/lib/storage";

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

const textilePattern = `
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
`;

export default function HistorialPage() {
  const {
    recentBPMs,
    facialHistory,
  } = useNeurowatch();

  const { language } =
    useLanguage();

  const [facialChecks, setFacialChecks] =
    useState<StoredFacialCheck[]>([]);

  const [selectedPhoto, setSelectedPhoto] =
    useState<StoredFacialCheck | null>(null);

  const [range, setRange] =
    useState<"Dia" | "Semana" | "Mes">(
      "Semana"
    );

  /*
   * =====================================================
   * CARGAR CHEQUEOS CON FOTOS
   * =====================================================
   */

  useEffect(() => {
    const loadChecks = () => {
      const checks =
        getFacialChecks();

      setFacialChecks(
        checks
      );
    };

    loadChecks();
  }, [facialHistory]);

  /*
   * =====================================================
   * TENDENCIA DE PULSO
   * =====================================================
   */

  const trendBPMs: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const idx =
      recentBPMs.length -
      1 -
      i;

    trendBPMs.push(
      recentBPMs[idx] ??
        65
    );
  }

  const max =
    Math.max(
      ...trendBPMs,
      1
    );

  const barColors =
    trendBPMs.map((bpm) =>
      bpm > 90 ||
      bpm < 55
        ? "bg-warn"
        : "bg-brand-600"
    );

  /*
   * =====================================================
   * ESTADÍSTICAS FACIALES
   * =====================================================
   */

  const facialStats =
    useMemo(() => {
      if (
        facialChecks.length ===
        0
      ) {
        return {
          average: 0,
          best: 0,
          latest: 0,
        };
      }

      const values =
        facialChecks.map(
          (check) =>
            check.index
        );

      const average =
        Math.round(
          values.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
            values.length
        );

      return {
        average,
        best: Math.max(
          ...values
        ),
        latest: values[0],
      };
    }, [facialChecks]);

  /*
   * =====================================================
   * RESULTADO
   * =====================================================
   */

  const getResult = (
    index: number
  ) => {
    if (index < 70) {
      return {
        label:
          language === "qu"
            ? "Hatun mana kuska"
            : "Asimetría marcada",
        status:
          "alert" as const,
        dot: "bg-alert",
      };
    }

    if (index < 86) {
      return {
        label:
          language === "qu"
            ? "Pisi mana kuska"
            : "Leve asimetría",
        status:
          "warn" as const,
        dot: "bg-warn",
      };
    }

    return {
      label:
        language === "qu"
          ? "Kuskalla"
          : "Simétrico",
      status:
        "ok" as const,
      dot: "bg-ok",
    };
  };

  const days =
    language === "qu"
      ? daysQu
      : daysEs;

  /*
   * =====================================================
   * TEXTOS
   * =====================================================
   */

  const text = {
    title:
      language === "qu"
        ? "Kawsaypa ñawpaq qhawariyninkuna"
        : "Historial de salud",

    subtitle:
      language === "qu"
        ? "Qhawariykuna hinallataq wiñaynin"
        : "Tus registros y evolución",

    day:
      language === "qu"
        ? "P'unchay"
        : "Día",

    week:
      language === "qu"
        ? "Simana"
        : "Semana",

    month:
      language === "qu"
        ? "Killa"
        : "Mes",

    facialSummary:
      language === "qu"
        ? "Uya qhawariypa pisiyachiy"
        : "Resumen facial",

    evolution:
      language === "qu"
        ? "Ch'iqiy wiñaynin"
        : "Evolución de simetría",

    latestChecks:
      language === "qu"
        ? "Qhipa qhawariykuna"
        : "Últimos chequeos",

    checks:
      language === "qu"
        ? "Qhawariykuna"
        : "Chequeos",

    average:
      language === "qu"
        ? "Chawpi"
        : "Promedio",

    latest:
      language === "qu"
        ? "Qhipa"
        : "Último",

    today:
      language === "qu"
        ? "Kunan"
        : "Hoy",

    thisMonth:
      language === "qu"
        ? "Kay killa"
        : "Este mes",

    sevenDays:
      language === "qu"
        ? "Qhipa 7 p'unchay"
        : "Últimos 7 días",

    pulseTrend:
      language === "qu"
        ? "Sunqupa muyuriyninpa wiñaynin"
        : "Tendencia de pulso",

    log:
      language === "qu"
        ? "Uya qhawariykunapa qillqana"
        : "Bitácora de chequeos faciales",

    record:
      language === "qu"
        ? "qillqasqa"
        : "registro",

    records:
      language === "qu"
        ? "qillqakuna"
        : "registros",

    noChecks:
      language === "qu"
        ? "Manaraqmi uya qhawariykuna waqaychasqachu."
        : "No hay chequeos faciales registrados aún.",

    startFirst:
      language === "qu"
        ? "Ruwariy ñawpaq uya qhawariyta qallarinaykipaq."
        : "Realiza tu primer chequeo para comenzar.",

    seePhoto:
      language === "qu"
        ? "Rikch'ay"
        : "Ver foto",

    index:
      language === "qu"
        ? "Yupay"
        : "Índice",

    previous:
      language === "qu"
        ? "Ñawpaq"
        : "Anterior",

    current:
      language === "qu"
        ? "Kunan"
        : "Actual",

    better:
      language === "qu"
        ? "allin"
        : "mejor",

    closed:
      language === "qu"
        ? "Wisqay"
        : "Cerrar foto",

    facialCheck:
      language === "qu"
        ? "Uya qhawariy"
        : "Chequeo facial",
  };

  return (
    <>
      <div className="relative min-h-dvh overflow-hidden bg-[#f7efe0] px-4 pb-28 pt-5 md:px-8 md:pb-10">

        {/* FONDO */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#e8a33d]/10 blur-3xl" />

          <div className="absolute -right-32 top-64 h-[420px] w-[420px] rounded-full bg-[#087f83]/10 blur-3xl" />

        </div>

        {/* PATRÓN */}

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-2">
          <div
            className="h-full"
            style={{
              backgroundImage:
                textilePattern,
            }}
          />
        </div>

        {/* IMAGEN */}

        <div className="pointer-events-none absolute right-[-70px] top-20 hidden h-64 w-64 overflow-hidden rounded-full opacity-[0.12] md:block">
          <img
            src="/images/huaraz-montanas.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl">

          {/* STATUS BAR */}

          <div className="mb-4 flex items-center justify-between px-1 md:hidden">

            <span className="text-[15px] font-black text-[#3b2a1a]">
              {new Date().toLocaleTimeString(
                "es-ES",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>

            <div className="flex items-center gap-1.5 text-[#075d63]">
              <IconSignal size={16} />
              <IconWifi size={16} />
              <IconBatteryFull size={16} />
            </div>

          </div>

          {/* ENCABEZADO */}

          <div className="mb-5 overflow-hidden rounded-[28px] border border-[#dfc49a] bg-[#fff9ed] shadow-[0_14px_35px_rgba(72,48,25,0.10)]">

            <div
              className="h-2"
              style={{
                backgroundImage:
                  textilePattern,
              }}
            />

            <div className="flex items-center gap-4 p-5">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#e4f1ed] text-[#087f83]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80">
                  <IconActivity size={22} />
                </div>
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-black uppercase leading-tight text-[#075d63] sm:text-3xl">
                  {text.title}
                </h1>

                <p className="mt-1 text-xs leading-relaxed text-[#79634d] sm:text-sm">
                  {text.subtitle}
                </p>
              </div>

            </div>

          </div>

          {/* FILTROS */}

          <div className="mb-5 rounded-[22px] border border-[#dfc49a] bg-[#fff9ed]/95 p-1.5 shadow-sm">

            <div className="flex gap-1">

              {(
                [
                  {
                    key: "Dia" as const,
                    label: text.day,
                  },
                  {
                    key: "Semana" as const,
                    label: text.week,
                  },
                  {
                    key: "Mes" as const,
                    label: text.month,
                  },
                ]
              ).map(
                (item) => (
                  <button
                    key={
                      item.key
                    }
                    type="button"
                    onClick={() =>
                      setRange(
                        item.key
                      )
                    }
                    className={`flex-1 rounded-[17px] py-2.5 text-center text-[12px] transition-all ${
                      range ===
                      item.key
                        ? "bg-[#087f83] font-black text-white shadow-md"
                        : "font-bold text-[#6b5842] hover:bg-[#f1e5ce]"
                    }`}
                  >
                    {
                      item.label
                    }
                  </button>
                )
              )}

            </div>
          </div>

          {/* RESUMEN FACIAL */}

          <GlassCard className="mb-5 overflow-hidden rounded-[28px] border border-[#dfc49a] bg-[#fff9ed] p-0 shadow-[0_12px_30px_rgba(72,48,25,0.08)]">

            <div className="flex items-center justify-between border-b border-[#ead8b8] p-5">

              <div>
                <h2 className="text-base font-black text-[#263a32]">
                  {
                    text.facialSummary
                  }
                </h2>

                <p className="mt-1 text-xs text-[#8c7660]">
                  {
                    text.subtitle
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#e4f1ed] text-[#087f83]">
                <IconUserRound size={22} />
              </div>

            </div>

            <div className="grid grid-cols-3 gap-2 p-4">

              <div className="rounded-[18px] border border-[#dcebe6] bg-[#edf6f3] p-3 text-center">
                <p className="text-[10px] font-bold text-[#78634c]">
                  {
                    text.checks
                  }
                </p>

                <p className="mt-1 text-xl font-black text-[#263a32]">
                  {
                    facialChecks.length
                  }
                </p>
              </div>

              <div className="rounded-[18px] border border-[#ead8b8] bg-[#f8efd9] p-3 text-center">
                <p className="text-[10px] font-bold text-[#78634c]">
                  {
                    text.average
                  }
                </p>

                <p className="mt-1 text-xl font-black text-[#263a32]">
                  {facialStats.average ||
                    "--"}
                </p>
              </div>

              <div className="rounded-[18px] border border-[#f1d8cc] bg-[#fbede8] p-3 text-center">
                <p className="text-[10px] font-bold text-[#78634c]">
                  {
                    text.latest
                  }
                </p>

                <p className="mt-1 text-xl font-black text-[#263a32]">
                  {facialStats.latest ||
                    "--"}
                </p>
              </div>

            </div>

            {facialStats.latest >
              0 && (
              <div className="mx-4 mb-4 flex items-center gap-2 rounded-[18px] border border-[#cfe8d8] bg-[#edf8f1] px-3 py-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#2f8f5b]">
                  <IconCircleCheck size={18} />
                </div>

                <span className="text-xs font-semibold leading-relaxed text-[#3f5c4b]">
                  {facialStats.latest >=
                  86
                    ? language === "qu"
                      ? "Qhipa qhawariyqa allin kaypi kachkan."
                      : "Tu último chequeo está dentro del rango esperado."
                    : facialStats.latest >=
                        70
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

          {/* EVOLUCIÓN */}

          {facialChecks.length >
            0 && (
            <GlassCard className="mb-5 overflow-hidden rounded-[28px] border border-[#dfc49a] bg-[#fff9ed] p-5 shadow-[0_12px_30px_rgba(72,48,25,0.08)]">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h2 className="text-base font-black text-[#263a32]">
                    {
                      text.evolution
                    }
                  </h2>

                  <p className="mt-1 text-xs text-[#8c7660]">
                    {
                      text.latestChecks
                    }
                  </p>
                </div>

                <span className="rounded-full bg-[#e4f1ed] px-3 py-1.5 text-xs font-black text-[#087f83]">
                  {
                    facialStats.best
                  }{" "}
                  {
                    text.better
                  }
                </span>

              </div>

              <div className="relative h-[160px] overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffaf0] p-3">

                <div className="absolute left-3 right-3 top-3 border-t border-[#3b2a1a]/10" />

                <div className="absolute left-3 right-3 top-1/2 border-t border-[#3b2a1a]/10" />

                <div className="absolute bottom-3 left-3 right-3 border-t border-[#3b2a1a]/10" />

                <div className="absolute inset-x-3 bottom-3 top-3 flex items-end gap-2">

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

                            <span className="text-[9px] font-black text-[#6b5842]">
                              {
                                check.index
                              }
                            </span>

                            <div
                              className={`w-full max-w-[30px] rounded-t-[10px] ${result.dot}`}
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

              <div className="mt-2 flex justify-between text-[10px] font-bold text-[#9a8065]">

                <span>
                  {
                    text.previous
                  }
                </span>

                <span>
                  {
                    text.current
                  }
                </span>

              </div>

            </GlassCard>
          )}

          {/* TENDENCIA DE PULSO */}

          <GlassCard className="mb-5 overflow-hidden rounded-[28px] border border-[#dfc49a] bg-[#fff9ed] p-5 shadow-[0_12px_30px_rgba(72,48,25,0.08)]">

            <div className="mb-5 flex items-center justify-between">

              <span className="text-base font-black text-[#263a32]">
                {
                  text.pulseTrend
                }
              </span>

              <span className="rounded-full bg-[#e4f1ed] px-3 py-1.5 text-[10px] font-bold text-[#087f83]">
                {range ===
                "Dia"
                  ? text.today
                  : range ===
                      "Mes"
                    ? text.thisMonth
                    : text.sevenDays}
              </span>

            </div>

            <div className="rounded-[20px] border border-[#ead8b8] bg-[#fffaf0] p-4">

              <div className="flex h-[120px] items-end gap-2">

                {trendBPMs.map(
                  (bpm, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-[7px] ${barColors[i]}`}
                      style={{
                        height:
                          `${Math.max(
                            8,
                            (bpm /
                              max) *
                              100
                          )}%`,
                      }}
                    />
                  )
                )}

              </div>

              <div className="mt-3 flex gap-2">

                {days.map(
                  (day) => (
                    <span
                      key={day}
                      className="flex-1 text-center text-[10px] font-bold text-[#9a8065]"
                    >
                      {day}
                    </span>
                  )
                )}

              </div>

            </div>

          </GlassCard>

          {/* BITÁCORA */}

          <GlassCard className="mb-5 overflow-hidden rounded-[28px] border border-[#dfc49a] bg-[#fff9ed] p-5 shadow-[0_12px_30px_rgba(72,48,25,0.08)]">

            <div className="mb-5 flex items-center justify-between">

              <span className="text-base font-black text-[#263a32]">
                {text.log}
              </span>

              {facialChecks.length >
                0 && (
                <span className="rounded-full bg-[#f7efe0] px-3 py-1 text-[10px] font-bold text-[#8c7660]">
                  {
                    facialChecks.length
                  }{" "}
                  {facialChecks.length ===
                  1
                    ? text.record
                    : text.records}
                </span>
              )}

            </div>

            <div className="flex flex-col">

              {facialChecks.length ===
                0 && (
                <div className="rounded-[22px] border border-dashed border-[#dfc49a] bg-[#fffaf0] px-5 py-9 text-center">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e4f1ed] text-[#087f83]">
                    <IconUserRound size={26} />
                  </div>

                  <p className="text-sm font-bold text-[#6b5842]">
                    {
                      text.noChecks
                    }
                  </p>

                  <p className="mt-1 text-xs text-[#9a8065]">
                    {
                      text.startFirst
                    }
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
                          : "pb-5"
                      }`}
                    >

                      <div className="flex w-5 flex-col items-center gap-1">

                        <span
                          className={`h-3 w-3 shrink-0 rounded-full ${result.dot}`}
                        />

                        {!isLast && (
                          <span className="w-0.5 flex-1 bg-[#e5dccb]" />
                        )}

                      </div>

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
                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-[15px] border border-[#dfc49a] bg-[#f7efe0] ${
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
                            <IconUserRound size={25} />
                          </div>
                        )}

                      </button>

                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">

                        <div className="flex items-center justify-between gap-2">

                          <span className="truncate text-[13px] font-black text-[#263a32]">
                            {
                              entry.date
                            }
                          </span>

                          {entry.image && (
                            <span className="shrink-0 text-[10px] font-bold text-[#087f83]">
                              {
                                text.seePhoto
                              }
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

                          <span className="text-xs font-medium tabular-nums text-[#8c7660]">
                            {
                              text.index
                            }{" "}
                            {
                              entry.index
                            }
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
      </div>

      {/* MODAL DE FOTO */}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() =>
            setSelectedPhoto(
              null
            )
          }
        >

          <div
            className="relative max-h-[92vh] max-w-[94vw] overflow-hidden rounded-[24px] border border-[#dfc49a] bg-[#fff9ed] p-2 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div
              className="mb-2 h-2 rounded-full"
              style={{
                backgroundImage:
                  textilePattern,
              }}
            />

            <img
              src={
                selectedPhoto.image
              }
              alt={
                language === "qu"
                  ? "Uya qhawariy"
                  : "Foto ampliada del chequeo facial"
              }
              className="max-h-[78vh] max-w-[90vw] rounded-[18px] object-contain"
            />

            <div className="flex items-center justify-between gap-3 px-2 py-4">

              <div>
                <p className="text-sm font-black text-[#263a32]">
                  {
                    text.facialCheck
                  }
                </p>

                <p className="mt-0.5 text-xs text-[#8c7660]">
                  {
                    selectedPhoto.date
                  }
                </p>
              </div>

              <div className="text-right">

                <p className="text-xl font-black text-[#075d63]">
                  {
                    selectedPhoto.index
                  }
                </p>

                <p className="text-[10px] font-bold uppercase tracking-wide text-[#9a8065]">
                  {
                    text.index
                  }
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedPhoto(
                  null
                )
              }
              className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-xl font-bold text-white backdrop-blur-sm transition hover:bg-black/85"
              aria-label={
                text.closed
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
