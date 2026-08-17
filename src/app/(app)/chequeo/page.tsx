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

type ChequeoState =
  | "idle"
  | "preview"
  | "analyzing"
  | "result";

/*
 * =========================================================
 * FACE DETECTOR
 * =========================================================
 *
 * FaceDetector existe en algunos navegadores modernos,
 * pero TypeScript no siempre incluye su definición.
 */

declare global {
  interface Window {
    FaceDetector?: new (options?: {
      fastMode?: boolean;
      maxDetectedFaces?: number;
    }) => {
      detect(
        source: HTMLVideoElement
      ): Promise<
        {
          boundingBox: DOMRectReadOnly;
        }[]
      >;
    };
  }
}

/*
 * =========================================================
 * BARRA DE SIMETRÍA
 * =========================================================
 */

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
      ? "Simetrico"
      : value >= 70
        ? "Leve asimetria"
        : "Asimetria marcada";

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-ink-900">
          Indice de simetria
        </span>

        <span className="text-[28px] font-bold tabular-nums text-ink-900">
          {value}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-ink-900/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{
            width: `${value}%`,
          }}
        />
      </div>

      <span className="text-[13px] font-medium text-ink-600">
        {label}
      </span>
    </div>
  );
}

/*
 * =========================================================
 * PÁGINA
 * =========================================================
 */

export default function ChequeoPage() {
  const {
    facialHistory,
    addFacialCheck,
    baselineImage,
    saveBaselineImage,
    lastCheckPhoto,
    saveLastCheckPhoto,
    streak,
  } = useNeurowatch();

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  /*
   * Detector facial
   */
  const faceDetectorRef =
    useRef<
      InstanceType<
        NonNullable<typeof window.FaceDetector>
      > | null
    >(null);

  /*
   * Animation frame para revisar rostro.
   */
  const detectionFrameRef =
    useRef<number | null>(null);

  /*
   * Momento en que comenzó a estar
   * correctamente colocado.
   */
  const faceStableSinceRef =
    useRef<number | null>(null);

  /*
   * Evita tomar varias fotos.
   */
  const autoCaptureTriggeredRef =
    useRef(false);

  const [state, setState] =
    useState<ChequeoState>("idle");

  const [cameraReady, setCameraReady] =
    useState(false);

  const [photo, setPhoto] =
    useState<string | null>(
      lastCheckPhoto
    );

  const [index, setIndex] =
    useState<number | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [countdown, setCountdown] =
    useState(0);

  /*
   * Estado visual de detección.
   */
  const [faceDetected, setFaceDetected] =
    useState(false);

  const [faceCentered, setFaceCentered] =
    useState(false);

  const [autoCaptureProgress, setAutoCaptureProgress] =
    useState(0);

  /*
   * =========================================================
   * DETENER DETECCIÓN
   * =========================================================
   */

  const stopFaceDetection =
    useCallback(() => {
      if (
        detectionFrameRef.current !== null
      ) {
        cancelAnimationFrame(
          detectionFrameRef.current
        );

        detectionFrameRef.current = null;
      }

      faceStableSinceRef.current =
        null;

      setFaceDetected(false);
      setFaceCentered(false);
      setAutoCaptureProgress(0);
    }, []);

  /*
   * =========================================================
   * DETENER CÁMARA
   * =========================================================
   */

  const stopCamera =
    useCallback(() => {
      stopFaceDetection();

      streamRef.current
        ?.getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;

      setCameraReady(false);
    }, [stopFaceDetection]);

  /*
   * Limpiar al salir.
   */

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  /*
   * =========================================================
   * CONECTAR STREAM AL VIDEO
   * =========================================================
   */

  useEffect(() => {
    if (
      !cameraReady ||
      !streamRef.current ||
      !videoRef.current
    ) {
      return;
    }

    videoRef.current.srcObject =
      streamRef.current;

    videoRef.current
      .play()
      .catch(() => {});
  }, [cameraReady]);

  /*
   * =========================================================
   * CAPTURAR FOTO
   * =========================================================
   */

  const capture =
    useCallback(async () => {
      if (
        autoCaptureTriggeredRef.current
      ) {
        return;
      }

      const video =
        videoRef.current;

      if (
        !video ||
        video.readyState < 2 ||
        !video.videoWidth ||
        !video.videoHeight
      ) {
        return;
      }

      autoCaptureTriggeredRef.current =
        true;

      stopFaceDetection();

      /*
       * Canvas con orientación REAL.
       *
       * NO usamos espejo aquí.
       */
      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;

      const context =
        canvas.getContext("2d");

      if (!context) {
        autoCaptureTriggeredRef.current =
          false;

        return;
      }

      /*
       * Restablecer cualquier transformación.
       */
      context.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
      );

      /*
       * FOTO SIN ESPEJO.
       */
      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const image =
        canvas.toDataURL(
          "image/jpeg",
          0.92
        );

      stopCamera();

      setPhoto(image);

      setState("analyzing");

      const startedAt =
        Date.now();

      setCountdown(3);

      const tick =
        setInterval(() => {
          setCountdown(
            (prev) => {
              if (prev <= 1) {
                clearInterval(tick);
                return 0;
              }

              return prev - 1;
            }
          );
        }, 1000);

      /*
       * ANALIZAR SIMETRÍA
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
       * Mantener la animación
       * aproximadamente 3 segundos.
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
          setTimeout(
            resolve,
            remaining
          );
        }
      );

      clearInterval(tick);

      setCountdown(0);

      setIndex(symmetryIndex);

      setState("result");

      /*
       * Primera foto = línea base.
       */
      if (!baselineImage) {
        saveBaselineImage(image);
      }

      /*
       * Última foto.
       */
      saveLastCheckPhoto(image);

      /*
       * Historial.
       */
      addFacialCheck(
        symmetryIndex,
        image
      );

      /*
       * Permitir nuevo chequeo.
       */
      autoCaptureTriggeredRef.current =
        false;
    }, [
      baselineImage,
      saveBaselineImage,
      saveLastCheckPhoto,
      addFacialCheck,
      stopCamera,
      stopFaceDetection,
    ]);

  /*
   * =========================================================
   * DETECCIÓN AUTOMÁTICA DEL ROSTRO
   * =========================================================
   */

  const detectFace =
    useCallback(async () => {
      const video =
        videoRef.current;

      if (
        !video ||
        state !== "preview" ||
        !cameraReady
      ) {
        return;
      }

      /*
       * Si el navegador no tiene FaceDetector,
       * no intentamos inventar una detección.
       */
      if (!window.FaceDetector) {
        setFaceDetected(false);
        setFaceCentered(false);
        setAutoCaptureProgress(0);

        detectionFrameRef.current =
          requestAnimationFrame(
            () => {
              void detectFace();
            }
          );

        return;
      }

      try {
        /*
         * Crear detector una sola vez.
         */
        if (!faceDetectorRef.current) {
          faceDetectorRef.current =
            new window.FaceDetector({
              fastMode: true,
              maxDetectedFaces: 1,
            });
        }

        const faces =
          await faceDetectorRef.current.detect(
            video
          );

        if (
          faces.length === 0
        ) {
          faceStableSinceRef.current =
            null;

          setFaceDetected(false);
          setFaceCentered(false);
          setAutoCaptureProgress(0);

          detectionFrameRef.current =
            requestAnimationFrame(
              () => {
                void detectFace();
              }
            );

          return;
        }

        const face =
          faces[0].boundingBox;

        setFaceDetected(true);

        /*
         * Centro del rostro.
         */
        const faceCenterX =
          face.x +
          face.width / 2;

        const faceCenterY =
          face.y +
          face.height / 2;

        const videoCenterX =
          video.videoWidth / 2;

        const videoCenterY =
          video.videoHeight / 2;

        /*
         * Permitimos cierta tolerancia
         * para que no tengas que estar
         * perfectamente inmóvil.
         */
        const horizontalTolerance =
          video.videoWidth * 0.14;

        const verticalTolerance =
          video.videoHeight * 0.14;

        const centered =
          Math.abs(
            faceCenterX -
              videoCenterX
          ) <
            horizontalTolerance &&
          Math.abs(
            faceCenterY -
              videoCenterY
          ) <
            verticalTolerance;

        /*
         * También comprobamos que el rostro
         * tenga un tamaño razonable.
         */
        const faceWidthRatio =
          face.width /
          video.videoWidth;

        const faceHeightRatio =
          face.height /
          video.videoHeight;

        const correctSize =
          faceWidthRatio > 0.18 &&
          faceWidthRatio < 0.75 &&
          faceHeightRatio > 0.18 &&
          faceHeightRatio < 0.85;

        const ready =
          centered &&
          correctSize;

        setFaceCentered(ready);

        /*
         * Si está bien colocado,
         * comienza el contador de estabilidad.
         */
        if (ready) {
          if (
            faceStableSinceRef.current ===
            null
          ) {
            faceStableSinceRef.current =
              Date.now();
          }

          const stableTime =
            Date.now() -
            faceStableSinceRef.current;

          /*
           * 1000 ms correctamente colocado.
           */
          const progress =
            Math.min(
              100,
              (stableTime / 1000) *
                100
            );

          setAutoCaptureProgress(
            progress
          );

          if (
            stableTime >=
              1000 &&
            !autoCaptureTriggeredRef.current
          ) {
            await capture();

            return;
          }
        } else {
          faceStableSinceRef.current =
            null;

          setAutoCaptureProgress(0);
        }
      } catch {
        /*
         * Si ocurre algún error durante
         * la detección, seguimos mostrando
         * la cámara.
         */
        setFaceDetected(false);
        setFaceCentered(false);
        setAutoCaptureProgress(0);
      }

      detectionFrameRef.current =
        requestAnimationFrame(
          () => {
            void detectFace();
          }
        );
    }, [
      state,
      cameraReady,
      capture,
    ]);

  /*
   * =========================================================
   * INICIAR DETECCIÓN CUANDO SE ABRE LA CÁMARA
   * =========================================================
   */

  useEffect(() => {
    if (
      state !== "preview" ||
      !cameraReady
    ) {
      stopFaceDetection();
      return;
    }

    autoCaptureTriggeredRef.current =
      false;

    faceStableSinceRef.current =
      null;

    detectionFrameRef.current =
      requestAnimationFrame(
        () => {
          void detectFace();
        }
      );

    return () => {
      if (
        detectionFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          detectionFrameRef.current
        );

        detectionFrameRef.current =
          null;
      }
    };
  }, [
    state,
    cameraReady,
    detectFace,
    stopFaceDetection,
  ]);

  /*
   * =========================================================
   * ABRIR CÁMARA
   * =========================================================
   */

  const startCamera =
    async () => {
      try {
        setError(null);

        autoCaptureTriggeredRef.current =
          false;

        stopCamera();

        if (
          !navigator.mediaDevices
            ?.getUserMedia
        ) {
          throw new Error(
            "Este navegador no permite usar la camara."
          );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
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
            }
          );

        streamRef.current =
          stream;

        setState("preview");

        setCameraReady(true);
      } catch (cause) {
        const message =
          cause instanceof Error
            ? cause.message
            : "No se pudo abrir la camara.";

        setError(
          `No se pudo abrir la camara: ${message}. Usa HTTPS o localhost y permite el acceso.`
        );
      }
    };

  /*
   * =========================================================
   * NUEVO CHEQUEO
   * =========================================================
   */

  const reset = () => {
    stopCamera();

    setPhoto(null);

    setIndex(null);

    setCountdown(0);

    setError(null);

    setFaceDetected(false);

    setFaceCentered(false);

    setAutoCaptureProgress(0);

    autoCaptureTriggeredRef.current =
      false;

    setState("idle");
  };

  const lastCheck =
    facialHistory[0];

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="flex flex-col gap-4 px-5 pt-4 md:mx-auto md:max-w-lg">

      {/* ENCABEZADO */}
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-brand-600 p-2 text-white">
          <IconActivity />
        </div>

        <div>
          <h1 className="text-xl font-bold">
            Chequeo facial
          </h1>

          <p className="text-xs text-ink-600">
            Coloca tu rostro dentro del cuadro
          </p>
        </div>
      </div>

      <GlassCard className="flex flex-col gap-3 p-4">

        {/* VISOR */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-900">

          {/* CÁMARA */}
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
            style={{
              /*
               * Vista previa natural.
               */
              transform:
                "scaleX(-1)",
            }}
          />

          {/* FOTO CAPTURADA */}
          {state === "result" &&
            photo && (
              <img
                src={photo}
                alt="Foto capturada"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

          {/* ANALIZANDO */}
          {state === "analyzing" && (
            <div className="absolute inset-0 flex h-full flex-col items-center justify-center gap-4 bg-ink-900/80 text-white">

              <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />

              <div className="text-center">
                <p className="text-[17px] font-semibold">
                  Analizando...
                </p>

                <p className="text-[13px] text-white/60">
                  {countdown > 0
                    ? `${countdown}s`
                    : "Procesando"}
                </p>
              </div>
            </div>
          )}

          {/* GUÍA FACIAL */}
          {state === "preview" && (
            <>
              <div
                className={`pointer-events-none absolute inset-8 rounded-[45%] border-[3px] transition-all duration-300 ${
                  faceCentered
                    ? "border-ok shadow-[0_0_25px_rgba(16,185,129,0.45)]"
                    : faceDetected
                      ? "border-warn"
                      : "border-brand-500"
                }`}
              />

              {/* MENSAJE */}
              <div className="pointer-events-none absolute bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-xl bg-black/45 px-4 py-3 text-center text-white backdrop-blur-sm">

                {!faceDetected && (
                  <p className="text-sm font-medium">
                    Coloca tu rostro dentro del cuadro
                  </p>
                )}

                {faceDetected &&
                  !faceCentered && (
                    <p className="text-sm font-medium">
                      Centra tu rostro
                    </p>
                  )}

                {faceCentered && (
                  <>
                    <p className="text-sm font-semibold text-white">
                      ¡Perfecto! No te muevas
                    </p>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-ok transition-all duration-100"
                        style={{
                          width: `${autoCaptureProgress}%`,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ABRIR CÁMARA */}
          {state !== "preview" &&
            state !== "analyzing" &&
            state !== "result" &&
            !photo && (
              <button
                onClick={startCamera}
                className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 text-white/80 transition-colors hover:text-white"
              >
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/15">
                  <IconCamera size={26} />
                </div>

                <span className="text-[15px] font-medium">
                  Pulsa para abrir camara
                </span>
              </button>
            )}
        </div>

        {/* ERROR */}
        {error && (
          <p className="rounded-lg bg-alert-fill p-3 text-sm text-alert">
            {error}
          </p>
        )}

        {/* RACHA */}
        <div className="flex items-center justify-between px-2 py-1">

          <div className="flex items-center gap-2">
            <IconZap size={20} />

            <span className="text-[14px] font-semibold text-ink-900">
              Racha de {streak.count}{" "}
              {streak.count === 1
                ? "dia"
                : "dias"}
            </span>
          </div>

          {streak.count > 0 && (
            <span className="text-[12px] font-medium text-ok">
              Chequeo diario completado
            </span>
          )}
        </div>

        {/* BOTÓN ABRIR */}
        {state === "idle" && (
          <button
            onClick={startCamera}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white"
          >
            <IconCamera />
            Abrir camara
          </button>
        )}

        {/* INFORMACIÓN DURANTE PREVIEW */}
        {state === "preview" && (
          <div className="rounded-xl bg-brand-100 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-brand-600">
              Captura automática activada
            </p>

            <p className="mt-1 text-xs text-ink-600">
              Cuando tu rostro esté centrado,
              la foto se tomará automáticamente.
            </p>
          </div>
        )}

        {/* RESULTADO */}
        {state === "result" &&
          index !== null && (
            <>
              <SymmetryBar
                value={index}
              />

              <button
                onClick={reset}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-brand-500 bg-white/80 font-semibold text-brand-600"
              >
                <IconRefreshCw size={18} />
                Nuevo chequeo
              </button>
            </>
          )}

        {/* ANALIZANDO */}
        {state === "analyzing" && (
          <div className="flex items-center justify-center py-2">
            <p className="text-sm text-ink-500">
              Comparando simetria facial...
            </p>
          </div>
        )}

      </GlassCard>

      {/* ÚLTIMO CHEQUEO */}
      {lastCheck && (
        <GlassCard className="flex items-center gap-3 p-4">

          {lastCheck.index > 85 ? (
            <IconCircleCheck
              size={24}
            />
          ) : (
            <IconTriangleAlert
              size={24}
            />
          )}

          <div>
            <b>
              {lastCheck.index > 85
                ? "Simetrico"
                : lastCheck.index >= 70
                  ? "Leve asimetria"
                  : "Asimetria marcada"}
            </b>

            <p className="text-sm text-ink-600">
              Indice{" "}
              {lastCheck.index} —{" "}
              {lastCheck.date}
            </p>
          </div>

        </GlassCard>
      )}

    </div>
  );
}
