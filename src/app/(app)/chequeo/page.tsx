"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  IconActivity,
  IconCamera,
  IconCircleCheck,
  IconTriangleAlert,
  IconRefreshCw,
  IconZap,
} from "@/components/ui/icons";

import GlassCard from "@/components/ui/GlassCard";
import { useNeurowatch } from "@/components/NeurowatchProvider";
import { evaluateFacialSymmetry } from "@/lib/detection";
import { useLanguage } from "@/components/LanguageProvider";

type ChequeoState =
  | "idle"
  | "preview"
  | "analyzing"
  | "result";

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

function SymmetryBar({
  value,
  language,
}: {
  value: number;
  language: "es" | "qu";
}) {
  const color =
    value > 85
      ? "bg-ok"
      : value >= 70
        ? "bg-warn"
        : "bg-alert";

  const label =
    value > 85
      ? language === "qu"
        ? "Kuskalla"
        : "Simétrico"
      : value >= 70
        ? language === "qu"
          ? "Pisi mana kuska"
          : "Leve asimetría"
        : language === "qu"
          ? "Hatun mana kuska"
          : "Asimetría marcada";

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold text-[#263a32]">
          {language === "qu"
            ? "Ch'iqiypa yupaynin"
            : "Índice de simetría"}
        </span>

        <span className="text-[30px] font-black tabular-nums text-[#075d63]">
          {value}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-[#263a32]/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{
            width: `${Math.min(
              100,
              Math.max(0, value)
            )}%`,
          }}
        />
      </div>

      <span className="text-[13px] font-semibold text-[#6b5842]">
        {label}
      </span>
    </div>
  );
}

export default function ChequeoPage() {
  const {
    facialHistory,
    addFacialCheck,
    baselineImage,
    saveBaselineImage,
    saveLastCheckPhoto,
    streak,
  } = useNeurowatch();

  const { language } = useLanguage();

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  // Evita que capture() pueda ejecutarse más de una vez
  // mientras se está realizando un chequeo.
  const capturingRef =
    useRef(false);

  const [state, setState] =
    useState<ChequeoState>("idle");

  const [cameraReady, setCameraReady] =
    useState(false);

  // La foto solo aparece después de presionar "Capturar foto".
  const [photo, setPhoto] =
    useState<string | null>(null);

  const [index, setIndex] =
    useState<number | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [countdown, setCountdown] =
    useState(0);

  /*
   * ======================================================
   * DETENER CÁMARA
   * ======================================================
   */

  const stopCamera = useCallback(() => {
    const stream =
      streamRef.current;

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
  }, []);

  /*
   * ======================================================
   * LIMPIAR AL SALIR
   * ======================================================
   */

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  /*
   * ======================================================
   * CONECTAR STREAM AL VIDEO
   * ======================================================
   */

  useEffect(() => {
    if (
      !cameraReady ||
      !streamRef.current ||
      !videoRef.current
    ) {
      return;
    }

    const video =
      videoRef.current;

    video.srcObject =
      streamRef.current;
    video.muted = true;
    video.playsInline = true;

    video.play().catch(() => {});
  }, [cameraReady]);

  /*
   * ======================================================
   * ABRIR CÁMARA
   * ======================================================
   */

  const startCamera = async () => {
    try {
      setError(null);

      stopCamera();

      capturingRef.current = false;

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          language === "qu"
            ? "Kay navegadorqa cámarata mana llamk'achiyta atinchu."
            : "Este navegador no permite usar la cámara."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "user",
            },
            width: {
              ideal: 720,
            },
            height: {
              ideal: 960,
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      setPhoto(null);
      setIndex(null);
      setCountdown(0);

      setState("preview");
      setCameraReady(true);
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : language === "qu"
            ? "Cámarata kichayta mana atinchu."
            : "No se pudo abrir la cámara.";

      setError(
        language === "qu"
          ? `Cámarata mana kichayta atikunchu: ${message}. Cámarapa permisonta qhawariy.`
          : `No se pudo abrir la cámara: ${message}. Verifica los permisos de cámara y utiliza HTTPS o localhost.`
      );

      setState("idle");
      capturingRef.current = false;
    }
  };

  /*
   * ======================================================
   * CAPTURAR FOTO
   * ======================================================
   */

  const capture = async () => {
    if (capturingRef.current) {
      return;
    }

    capturingRef.current = true;

    const video =
      videoRef.current;

    if (
      !video ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      capturingRef.current = false;

      setError(
        language === "qu"
          ? "Cámara manaraqmi listachu. Pisi suyay hinaspa musuqmanta ruray."
          : "La cámara todavía no está lista. Espera un momento e inténtalo nuevamente."
      );

      return;
    }

    const canvas =
      document.createElement("canvas");

    canvas.width =
      video.videoWidth;
    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      capturingRef.current = false;

      setError(
        language === "qu"
          ? "Rikch'ayta ruwanata mana atinchu."
          : "No se pudo procesar la fotografía."
      );

      return;
    }

    /*
     * Mantiene la orientación de la captura original.
     */

    context.save();

    context.translate(
      canvas.width,
      0
    );

    context.scale(-1, 1);

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.restore();

    const image =
      canvas.toDataURL(
        "image/jpeg",
        0.92
      );

    stopCamera();

    setPhoto(image);
    setState("analyzing");

    /*
     * ==================================================
     * ANIMACIÓN DE ANÁLISIS
     * ==================================================
     */

    const startedAt =
      Date.now();

    setCountdown(3);

    const tick =
      window.setInterval(() => {
        setCountdown((previous) => {
          if (previous <= 1) {
            window.clearInterval(tick);
            return 0;
          }

          return previous - 1;
        });
      }, 1000);

    /*
     * ==================================================
     * ANALIZAR ROSTRO
     * ==================================================
     */

    let symmetryIndex = 95;

    try {
      symmetryIndex =
        await evaluateFacialSymmetry(
          baselineImage,
          image
        );
    } catch {
      symmetryIndex = 95;
    }

    const elapsed =
      Date.now() - startedAt;

    const remaining =
      Math.max(
        0,
        3000 - elapsed
      );

    await new Promise<void>((resolve) => {
      window.setTimeout(
        resolve,
        remaining
      );
    });

    window.clearInterval(tick);

    setCountdown(0);

    setIndex(symmetryIndex);
    setState("result");

    /*
     * PRIMERA FOTO = LÍNEA BASE
     */

    if (!baselineImage) {
      saveBaselineImage(image);
    }

    /*
     * GUARDAR ÚLTIMA FOTO
     */

    saveLastCheckPhoto(image);

    /*
     * GUARDAR CHEQUEO EN HISTORIAL
     */

    addFacialCheck(
      symmetryIndex,
      image
    );

    capturingRef.current = false;
  };

  /*
   * ======================================================
   * NUEVO CHEQUEO
   * ======================================================
   */

  const reset = () => {
    stopCamera();

    capturingRef.current = false;

    setPhoto(null);
    setIndex(null);
    setCountdown(0);
    setError(null);

    setState("idle");
  };

  const lastCheck =
    facialHistory[0];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7efe0] px-4 pb-28 pt-5 md:px-8 md:pb-10">

      {/* DECORACIÓN TEXTIL */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-2">
        <div
          className="h-full"
          style={{
            backgroundImage:
              textilePattern,
          }}
        />
      </div>

      {/* IMAGEN DECORATIVA */}

      <div className="pointer-events-none absolute right-[-70px] top-20 hidden h-64 w-64 overflow-hidden rounded-full opacity-[0.12] md:block">
        <img
          src="/images/huaraz-montanas.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">

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

            <div>
              <h1 className="text-2xl font-black uppercase text-[#075d63]">
                {language === "qu"
                  ? "Uya qhawariy"
                  : "Chequeo facial"}
              </h1>

              <p className="mt-1 text-xs leading-relaxed text-[#79634d]">
                {language === "qu"
                  ? "Uyayki ch'iqiyta qhawariy"
                  : "Evalúa la simetría de tu rostro con la cámara frontal"}
              </p>
            </div>

          </div>
        </div>

        {/* TARJETA PRINCIPAL */}

        <GlassCard className="overflow-hidden rounded-[30px] border border-[#dfc49a] bg-[#fff9ed] p-0 shadow-[0_16px_40px_rgba(72,48,25,0.10)]">

          <div className="p-4 sm:p-5">

            {/* VISOR */}

            <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-[#263a32]">

              {/* CÁMARA */}

              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`h-full w-full object-cover ${
                  state === "preview"
                    ? "scale-x-[-1]"
                    : "hidden"
                }`}
              />

              {/* FOTO CAPTURADA */}

              {state === "result" &&
                photo && (
                  <img
                    src={photo}
                    alt={
                      language === "qu"
                        ? "Uya qhawariypa rikch'aynin"
                        : "Foto capturada del chequeo facial"
                    }
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

              {/* ANÁLISIS */}

              {state === "analyzing" && (
                <>
                  {photo && (
                    <img
                      src={photo}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/35 text-white">

                    <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />

                    <div className="text-center">

                      <p className="text-[17px] font-black">
                        {language === "qu"
                          ? "Qhawarichkan..."
                          : "Analizando..."}
                      </p>

                      <p className="mt-1 text-[13px] text-white/70">
                        {countdown > 0
                          ? `${countdown}s`
                          : language === "qu"
                            ? "Ruwachkan"
                            : "Procesando"}
                      </p>

                    </div>
                  </div>
                </>
              )}

              {/* INICIO */}

              {state === "idle" &&
                !photo && (
                  <button
                    onClick={startCamera}
                    type="button"
                    className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4 text-white/85 transition-colors hover:text-white"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/15 backdrop-blur-sm">
                      <IconCamera size={28} />
                    </div>

                    <span className="text-[15px] font-bold">
                      {language === "qu"
                        ? "Cámarata kichay"
                        : "Pulsa para abrir cámara"}
                    </span>
                  </button>
                )}

              {/* GUÍA */}

              {state === "preview" && (
                <>
                  <div className="pointer-events-none absolute inset-8 rounded-[45%] border-[3px] border-white/80" />

                  <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                    {language === "qu"
                      ? "Uyaykita churay"
                      : "Coloca tu rostro"}
                  </div>
                </>
              )}

            </div>

            {/* MENSAJE */}

            {state === "preview" && (
              <div className="mt-3 rounded-[17px] border border-[#dcebe6] bg-[#edf6f3] px-4 py-3 text-center">
                <p className="text-xs font-semibold leading-relaxed text-[#3f5c4b]">
                  {language === "qu"
                    ? "Uyaykita guía ukuman churay, umaqa allin chiqlla kachun."
                    : "Coloca tu rostro dentro de la guía y mantén la cabeza recta."}
                </p>
              </div>
            )}

            {/* ERROR */}

            {error && (
              <p className="mt-3 rounded-[16px] border border-[#efc8bc] bg-[#fff0eb] p-3 text-sm font-semibold text-alert">
                {error}
              </p>
            )}

            {/* RACHA */}

            <div className="mt-4 flex items-center justify-between gap-3 rounded-[18px] border border-[#ead8b8] bg-[#fffaf0] px-3 py-3">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8efd9]">
                  <IconZap size={18} />
                </div>

                <span className="text-[13px] font-black text-[#263a32]">
                  {language === "qu"
                    ? "Racha"
                    : "Racha de"}{" "}
                  {streak.count}{" "}
                  {streak.count === 1
                    ? language === "qu"
                      ? "p'unchay"
                      : "día"
                    : language === "qu"
                      ? "p'unchaykuna"
                      : "días"}
                </span>

              </div>

              {streak.count > 0 && (
                <span className="text-right text-[10px] font-bold text-[#2f8f5b]">
                  {language === "qu"
                    ? "Sapa p'unchay qhawariy tukusqa"
                    : "Chequeo diario completado"}
                </span>
              )}

            </div>

            {/* ABRIR CÁMARA */}

            {state === "idle" && (
              <button
                onClick={startCamera}
                type="button"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[17px] bg-[#087f83] font-black text-white shadow-[0_8px_22px_rgba(8,127,131,0.22)] transition-all hover:bg-[#076f74] active:scale-[0.98]"
              >
                <IconCamera size={19} />

                {language === "qu"
                  ? "Cámarata kichay"
                  : "Abrir cámara"}
              </button>
            )}

            {/* CAPTURAR */}

            {state === "preview" && (
              <button
                onClick={capture}
                type="button"
                disabled={!cameraReady}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[17px] bg-[#c1440c] font-black text-white shadow-[0_8px_22px_rgba(193,68,12,0.22)] transition-all hover:bg-[#aa3b0b] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconCamera size={19} />

                {language === "qu"
                  ? "Rikch'ayta hap'iy"
                  : "Capturar foto"}
              </button>
            )}

            {/* RESULTADO */}

            {state === "result" &&
              index !== null && (
                <div className="mt-5 flex flex-col gap-4">

                  <div className="rounded-[22px] border border-[#dfc49a] bg-[#fffaf0] p-4">
                    <SymmetryBar
                      value={index}
                      language={language}
                    />
                  </div>

                  <button
                    onClick={reset}
                    type="button"
                    className="flex h-12 items-center justify-center gap-2 rounded-[17px] border-[1.5px] border-[#087f83] bg-white font-black text-[#087f83] transition-all hover:bg-[#edf6f3] active:scale-[0.98]"
                  >
                    <IconRefreshCw size={18} />

                    {language === "qu"
                      ? "Musuq qhawariy"
                      : "Nuevo chequeo"}
                  </button>

                </div>
              )}

            {/* ANALIZANDO */}

            {state === "analyzing" && (
              <div className="flex items-center justify-center pt-3">
                <p className="text-sm font-semibold text-[#6b5842]">
                  {language === "qu"
                    ? "Uyaykipa ch'iqiynta tupachkan..."
                    : "Comparando simetría facial..."}
                </p>
              </div>
            )}

          </div>

          <div
            className="h-2"
            style={{
              backgroundImage:
                textilePattern,
            }}
          />

        </GlassCard>

        {/* ÚLTIMO CHEQUEO */}

        {lastCheck && (
          <GlassCard className="mt-5 overflow-hidden rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-0 shadow-[0_10px_28px_rgba(72,48,25,0.08)]">

            <div className="flex items-center gap-3 p-4">

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  lastCheck.index > 85
                    ? "bg-[#edf8f1] text-[#2f8f5b]"
                    : "bg-[#fff0eb] text-alert"
                }`}
              >
                {lastCheck.index > 85 ? (
                  <IconCircleCheck size={23} />
                ) : (
                  <IconTriangleAlert size={23} />
                )}
              </div>

              <div className="min-w-0">

                <b className="block text-[14px] font-black text-[#263a32]">
                  {lastCheck.index > 85
                    ? language === "qu"
                      ? "Kuskalla"
                      : "Simétrico"
                    : lastCheck.index >= 70
                      ? language === "qu"
                        ? "Pisi mana kuska"
                        : "Leve asimetría"
                      : language === "qu"
                        ? "Hatun mana kuska"
                        : "Asimetría marcada"}
                </b>

                <p className="mt-1 text-xs text-[#8c7660]">
                  {language === "qu"
                    ? "Yupay"
                    : "Índice"}{" "}
                  {lastCheck.index}{" "}
                  —{" "}
                  {lastCheck.date}
                </p>

              </div>

            </div>

            <div
              className="h-1.5"
              style={{
                backgroundImage:
                  textilePattern,
              }}
            />

          </GlassCard>
        )}

      </div>
    </div>
  );
}
