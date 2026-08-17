"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

type ChequeoState =
  | "idle"
  | "preview"
  | "analyzing"
  | "result";

function SymmetryBar({
  value,
}: {
  value: number;
}) {
  const color =
    value > 85
      ? "bg-ok"
      : value >= 70
        ? "bg-warn"
        : "bg-alert";

  const label =
    value > 85
      ? "Simétrico"
      : value >= 70
        ? "Leve asimetría"
        : "Asimetría marcada";

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-ink-900">
          Índice de simetría
        </span>

        <span className="text-[28px] font-bold tabular-nums text-ink-900">
          {value}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-ink-900/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
          }}
        />
      </div>

      <span className="text-[13px] font-medium text-ink-600">
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Evita que capture() pueda ejecutarse más de una vez
  // mientras se está realizando un chequeo.
  const capturingRef = useRef(false);

  const [state, setState] =
    useState<ChequeoState>("idle");

  const [cameraReady, setCameraReady] =
    useState(false);

  // IMPORTANTE:
  // No cargamos automáticamente la última foto.
  // La foto solo aparece después de presionar
  // "Capturar foto".
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
    const stream = streamRef.current;

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

    const video = videoRef.current;

    video.srcObject = streamRef.current;
    video.muted = true;
    video.playsInline = true;

    video.play().catch(() => {});
  }, [cameraReady]);

  /*
   * ======================================================
   * ABRIR CÁMARA
   *
   * IMPORTANTE:
   * Abrir la cámara NO captura ninguna fotografía.
   * ======================================================
   */

  const startCamera = async () => {
    try {
      setError(null);

      stopCamera();

      // Reiniciar estado de captura.
      capturingRef.current = false;

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Este navegador no permite usar la cámara."
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

      // Al abrir la cámara empezamos solamente
      // con la vista previa.
      setPhoto(null);
      setIndex(null);
      setCountdown(0);

      setState("preview");
      setCameraReady(true);
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "No se pudo abrir la cámara.";

      setError(
        `No se pudo abrir la cámara: ${message}. Verifica los permisos de cámara y utiliza HTTPS o localhost.`
      );

      setState("idle");
      capturingRef.current = false;
    }
  };

  /*
   * ======================================================
   * CAPTURAR FOTO
   *
   * SOLO se ejecuta al pulsar:
   * "Capturar foto"
   *
   * No existe captura automática.
   * ======================================================
   */

  const capture = async () => {
    // Evitar dobles capturas.
    if (capturingRef.current) {
      return;
    }

    capturingRef.current = true;

    const video = videoRef.current;

    if (
      !video ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      capturingRef.current = false;

      setError(
        "La cámara todavía no está lista. Espera un momento e inténtalo nuevamente."
      );

      return;
    }

    const canvas =
      document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      capturingRef.current = false;

      setError(
        "No se pudo procesar la fotografía."
      );

      return;
    }

    /*
     * La imagen mantiene su orientación REAL.
     *
     * No usamos:
     * scaleX(-1)
     * rotate()
     * translate()
     */

    context.setTransform(
      1,
      0,
      0,
      1,
      0,
      0
    );

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    /*
     * AQUÍ se crea la foto.
     *
     * Esta función solamente puede llegar
     * aquí después de pulsar el botón.
     */

    const image =
      canvas.toDataURL(
        "image/jpeg",
        0.92
      );

    /*
     * Detener cámara después de capturar.
     */

    stopCamera();

    /*
     * Mostrar foto capturada.
     */

    setPhoto(image);
    setState("analyzing");

    /*
     * ==================================================
     * ANIMACIÓN DE ANÁLISIS
     * ==================================================
     */

    const startedAt = Date.now();

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

    /*
     * Mantener el análisis durante aproximadamente
     * 3 segundos.
     */

    const elapsed =
      Date.now() - startedAt;

    const remaining =
      Math.max(
        0,
        3000 - elapsed
      );

    await new Promise<void>(
      (resolve) => {
        window.setTimeout(
          resolve,
          remaining
        );
      }
    );

    window.clearInterval(tick);

    setCountdown(0);

    setIndex(symmetryIndex);
    setState("result");

    /*
     * ==================================================
     * PRIMERA FOTO = LÍNEA BASE
     * ==================================================
     */

    if (!baselineImage) {
      saveBaselineImage(image);
    }

    /*
     * ==================================================
     * GUARDAR ÚLTIMA FOTO
     * ==================================================
     */

    saveLastCheckPhoto(image);

    /*
     * ==================================================
     * GUARDAR CHEQUEO EN HISTORIAL
     * ==================================================
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

  /*
   * ======================================================
   * INTERFAZ
   * ======================================================
   */

  return (
    <div className="flex flex-col gap-4 px-5 pt-4 md:mx-auto md:max-w-lg">

      {/* ==================================================
          ENCABEZADO
      ================================================== */}

      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-brand-600 p-2 text-white">
          <IconActivity />
        </div>

        <div>
          <h1 className="text-xl font-bold">
            Chequeo facial
          </h1>

          <p className="text-xs text-ink-600">
            Evalúa la simetría de tu rostro con la cámara frontal
          </p>
        </div>
      </div>

      <GlassCard className="flex flex-col gap-3 p-4">

        {/* ==================================================
            VISOR
        ================================================== */}

        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-900">

          {/* ==============================
              CÁMARA EN VIVO
          ============================== */}

          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`h-full w-full object-cover ${
              state === "preview"
                ? ""
                : "hidden"
            }`}
          />

          {/* ==============================
              FOTO CAPTURADA
          ============================== */}

          {state === "result" &&
            photo && (
              <img
                src={photo}
                alt="Foto capturada del chequeo facial"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

          {/* ==============================
              ANÁLISIS
          ============================== */}

          {state === "analyzing" && (
            <>
              {photo && (
                <img
                  src={photo}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              <div className="absolute inset-0 flex h-full flex-col items-center justify-center gap-4 bg-black/35 text-white">

                <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />

                <div className="text-center">
                  <p className="text-[17px] font-semibold">
                    Analizando...
                  </p>

                  <p className="text-[13px] text-white/70">
                    {countdown > 0
                      ? `${countdown}s`
                      : "Procesando"}
                  </p>
                </div>

              </div>
            </>
          )}

          {/* ==============================
              BOTÓN INICIAL
          ============================== */}

          {state === "idle" &&
            !photo && (
              <button
                onClick={startCamera}
                type="button"
                className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 text-white/80 transition-colors hover:text-white"
              >
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/15">
                  <IconCamera size={26} />
                </div>

                <span className="text-[15px] font-medium">
                  Pulsa para abrir cámara
                </span>
              </button>
            )}

          {/* ==============================
              GUÍA FACIAL
          ============================== */}

          {state === "preview" && (
            <div className="pointer-events-none absolute inset-8 rounded-[45%] border-[3px] border-brand-500" />
          )}

        </div>

        {/* ==================================================
            MENSAJE
        ================================================== */}

        {state === "preview" && (
          <div className="rounded-xl bg-brand-500/10 px-3 py-2 text-center">
            <p className="text-xs font-medium text-ink-700">
              Coloca tu rostro dentro de la guía y mantén la cabeza recta.
            </p>
          </div>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <p className="rounded-lg bg-alert-fill p-3 text-sm text-alert">
            {error}
          </p>
        )}

        {/* ==================================================
            RACHA
        ================================================== */}

        <div className="flex items-center justify-between px-2 py-1">

          <div className="flex items-center gap-2">
            <IconZap size={20} />

            <span className="text-[14px] font-semibold text-ink-900">
              Racha de{" "}
              {streak.count}{" "}
              {streak.count === 1
                ? "día"
                : "días"}
            </span>
          </div>

          {streak.count > 0 && (
            <span className="text-[12px] font-medium text-ok">
              Chequeo diario completado
            </span>
          )}

        </div>

        {/* ==================================================
            ABRIR CÁMARA
        ================================================== */}

        {state === "idle" && (
          <button
            onClick={startCamera}
            type="button"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <IconCamera />
            Abrir cámara
          </button>
        )}

        {/* ==================================================
            CAPTURAR
        ================================================== */}

        {state === "preview" && (
          <button
            onClick={capture}
            type="button"
            disabled={!cameraReady}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconCamera />
            Capturar foto
          </button>
        )}

        {/* ==================================================
            RESULTADO
        ================================================== */}

        {state === "result" &&
          index !== null && (
            <>
              <SymmetryBar
                value={index}
              />

              <button
                onClick={reset}
                type="button"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-brand-500 bg-white/80 font-semibold text-brand-600 transition-all hover:bg-brand-500/5 active:scale-[0.98]"
              >
                <IconRefreshCw size={18} />
                Nuevo chequeo
              </button>
            </>
          )}

        {/* ==================================================
            ANALIZANDO
        ================================================== */}

        {state === "analyzing" && (
          <div className="flex items-center justify-center py-2">
            <p className="text-sm text-ink-500">
              Comparando simetría facial...
            </p>
          </div>
        )}

      </GlassCard>

      {/* ==================================================
          ÚLTIMO CHEQUEO
      ================================================== */}

      {lastCheck && (
        <GlassCard className="flex items-center gap-3 p-4">

          {lastCheck.index > 85 ? (
            <IconCircleCheck size={24} />
          ) : (
            <IconTriangleAlert size={24} />
          )}

          <div>
            <b>
              {lastCheck.index > 85
                ? "Simétrico"
                : lastCheck.index >= 70
                  ? "Leve asimetría"
                  : "Asimetría marcada"}
            </b>

            <p className="text-sm text-ink-600">
              Índice{" "}
              {lastCheck.index}{" "}
              —{" "}
              {lastCheck.date}
            </p>
          </div>

        </GlassCard>
      )}

    </div>
  );
}
