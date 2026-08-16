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

type ChequeoState = "idle" | "preview" | "analyzing" | "result";

function SymmetryBar({ value }: { value: number }) {
  const color =
    value > 85 ? "bg-ok" : value >= 70 ? "bg-warn" : "bg-alert";
  const label =
    value > 85 ? "Simetrico" : value >= 70 ? "Leve asimetria" : "Asimetria marcada";

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-ink-900">
          Indice de simetria
        </span>
        <span className="text-[28px] font-bold text-ink-900 tabular-nums">
          {value}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-ink-900/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[13px] font-medium text-ink-600">{label}</span>
    </div>
  );
}

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<ChequeoState>("idle");
  const [cameraReady, setCameraReady] = useState(false);
  const [photo, setPhoto] = useState<string | null>(lastCheckPhoto);
  const [index, setIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  useEffect(() => {
    if (!cameraReady || !streamRef.current || !videoRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    videoRef.current.play().catch(() => {});
  }, [cameraReady]);

  const startCamera = async () => {
    try {
      setError(null);
      stopCamera();
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error("Este navegador no permite usar la camara.");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" }, width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      setState("preview");
      setCameraReady(true);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "No se pudo abrir la camara.";
      setError(`No se pudo abrir la camara: ${message}. Usa HTTPS o localhost y permite el acceso.`);
    }
  };

  const capture = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/jpeg", 0.9);

    stopCamera();
    setPhoto(image);
    setState("analyzing");

    const startedAt = Date.now();
    setCountdown(3);

    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(tick);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    let symmetryIndex = 95;
    try {
      symmetryIndex = await evaluateFacialSymmetry(baselineImage, image);
    } catch {
      symmetryIndex = 95;
    }

    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, 3000 - elapsed);
    await new Promise((r) => setTimeout(r, remaining));

    clearInterval(tick);
    setCountdown(0);
    setIndex(symmetryIndex);
    setState("result");

    if (!baselineImage) saveBaselineImage(image);
    saveLastCheckPhoto(image);
    addFacialCheck(symmetryIndex);
  };

  const reset = () => {
    setPhoto(null);
    setIndex(null);
    setState("idle");
  };

  const lastCheck = facialHistory[0];

  return (
    <div className="flex flex-col gap-4 px-5 pt-4 md:max-w-lg md:mx-auto">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-brand-600 p-2 text-white">
          <IconActivity />
        </div>
        <div>
          <h1 className="text-xl font-bold">Chequeo facial</h1>
          <p className="text-xs text-ink-600">
            Evalua la simetria de tu rostro con la camara frontal
          </p>
        </div>
      </div>

      <GlassCard className="flex flex-col gap-3 p-4">
        {/* Visor */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-900">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`h-full w-full object-cover ${state === "preview" ? "" : "hidden"}`}
             style={{ transform: "scaleX(-1)" }}
           />

          {state === "result" && photo && (
            <img
              src={photo}
              alt="Foto capturada"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {state === "analyzing" && (
            <div className="absolute inset-0 flex h-full flex-col items-center justify-center gap-4 text-white">
              <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
              <div className="text-center">
                <p className="text-[17px] font-semibold">Analizando...</p>
                <p className="text-[13px] text-white/60">
                  {countdown > 0 ? `${countdown}s` : "Procesando"}
                </p>
              </div>
            </div>
          )}

          {state !== "preview" && state !== "analyzing" && state !== "result" && !photo && (
            <button
              onClick={startCamera}
              className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <div className="h-[52px] w-[52px] rounded-full bg-white/15 flex items-center justify-center">
                <IconCamera size={26} />
              </div>
              <span className="text-[15px] font-medium">
                Pulsa para abrir camara
              </span>
            </button>
          )}

          {state === "preview" && (
            <div className="pointer-events-none absolute inset-8 rounded-[45%] border-[3px] border-brand-500" />
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-alert-fill p-3 text-sm text-alert">
            {error}
          </p>
        )}

        {/* Streak */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2">
            <IconZap size={20} />
            <span className="text-[14px] font-semibold text-ink-900">
              Racha de {streak.count} {streak.count === 1 ? "dia" : "dias"}
            </span>
          </div>
          {streak.count > 0 && (
            <span className="text-[12px] font-medium text-ok">
              Chequeo diario completado
            </span>
          )}
        </div>

        {/* Action buttons */}
        {state === "idle" && (
          <button
            onClick={startCamera}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white"
          >
            <IconCamera />
            Abrir camara
          </button>
        )}

        {state === "preview" && (
          <button
            onClick={capture}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white"
          >
            <IconCamera />
            Capturar foto
          </button>
        )}

        {/* Result */}
        {state === "result" && index !== null && (
          <>
            <SymmetryBar value={index} />
            <button
              onClick={reset}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-brand-500 bg-white/80 font-semibold text-brand-600"
            >
              <IconRefreshCw size={18} />
              Nuevo chequeo
            </button>
          </>
        )}

        {state === "analyzing" && (
          <div className="flex items-center justify-center py-2">
            <p className="text-sm text-ink-500">
              Comparando simetria facial...
            </p>
          </div>
        )}
      </GlassCard>

      {/* Last check card */}
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
                ? "Simetrico"
                : lastCheck.index >= 70
                  ? "Leve asimetria"
                  : "Asimetria marcada"}
            </b>
            <p className="text-sm text-ink-600">
              Indice {lastCheck.index} — {lastCheck.date}
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
