```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconActivity,
  IconSignal,
  IconWifi,
  IconBatteryFull,
  IconBluetooth,
} from "@/components/ui/icons";
import StatusChip from "@/components/ui/StatusChip";
import HeroStatus from "@/components/dashboard/HeroStatus";
import PulseCard from "@/components/dashboard/PulseCard";
import DeviceCard from "@/components/dashboard/DeviceCard";
import AlertModal from "@/components/alert/AlertModal";
import { useNeurowatch } from "@/components/NeurowatchProvider";

export default function DashboardPage() {
  const router = useRouter();

  const {
    bleData,
    bleError,
    connectBLE,
    status,
    pulseBars,
    contacts,
    alertOpen,
    countdownSeconds,
    settings,
    cancelAlert,
    disconnectedSince,
  } = useNeurowatch();

  useEffect(() => {
    if (disconnectedSince) {
      router.replace("/desconectado");
    }
  }, [router, disconnectedSince]);

  const connStatus = bleData.connected
    ? ("ok" as const)
    : ("muted" as const);

  const connLabel = bleData.connected
    ? "Conectado"
    : "Desconectado";

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* =====================================================
          DECORACIÓN ANDINA DE FONDO
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -left-32 top-[420px] h-72 w-72 rounded-full bg-brand-400/10 blur-3xl" />

        {/* Montañas decorativas */}
        <div className="absolute bottom-0 left-0 right-0 h-28 opacity-[0.045]">
          <svg
            viewBox="0 0 800 180"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 180 L0 135 L100 55 L180 125 L275 35 L390 145 L500 70 L610 130 L710 40 L800 110 L800 180 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 px-5 pb-6 pt-3.5 md:mx-auto md:max-w-lg md:pt-6">

        {/* =====================================================
            BARRA SUPERIOR
        ===================================================== */}

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

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-brand-600 text-white shadow-[0_7px_18px_rgba(79,70,229,0.28)]">
              <IconActivity size={22} />
            </div>

            <div className="flex flex-col">
              <span className="text-[22px] font-bold leading-tight text-ink-900">
                Neurowatch
              </span>

              <span className="text-[12px] leading-tight text-ink-600">
                Tecnología que cuida desde los Andes
              </span>
            </div>
          </div>

          <StatusChip
            label={connLabel}
            status={connStatus}
          />
        </div>

        {/* =====================================================
            HERO ANDINO
        ===================================================== */}

        <div className="relative overflow-hidden rounded-[26px] border border-white/70 bg-white/65 p-5 shadow-[0_12px_35px_rgba(30,27,75,0.08)] backdrop-blur-xl">

          {/* Decoración */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[20px]">🏔️</span>

              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
                Monitoreo inteligente
              </span>
            </div>

            <h1 className="max-w-[320px] text-[27px] font-extrabold leading-[1.08] tracking-tight text-ink-900">
              Tu salud,
              <br />
              siempre contigo.
            </h1>

            <p className="mt-2 max-w-[330px] text-[13px] leading-relaxed text-ink-600">
              NeuroWatch integra sensores y tecnología inteligente
              para ayudarte a vigilar tus signos vitales en tiempo real.
            </p>

            {/* Mini indicadores */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-[15px] bg-brand-500/10 p-3">
                <p className="text-[10px] font-medium text-ink-500">
                  Pulso
                </p>

                <p className="mt-1 text-[18px] font-bold text-ink-900">
                  {bleData.bpm > 0
                    ? `${bleData.bpm}`
                    : "--"}
                </p>

                <p className="text-[9px] text-ink-500">
                  BPM
                </p>
              </div>

              <div className="rounded-[15px] bg-brand-500/10 p-3">
                <p className="text-[10px] font-medium text-ink-500">
                  Batería
                </p>

                <p className="mt-1 text-[18px] font-bold text-ink-900">
                  {bleData.connected
                    ? `${Math.round(bleData.batteryPercent)}%`
                    : "--"}
                </p>

                <p className="text-[9px] text-ink-500">
                  reloj
                </p>
              </div>

              <div className="rounded-[15px] bg-brand-500/10 p-3">
                <p className="text-[10px] font-medium text-ink-500">
                  Estado
                </p>

                <p className="mt-1 text-[13px] font-bold text-ink-900">
                  {bleData.connected
                    ? "Activo"
                    : "Listo"}
                </p>

                <p className="text-[9px] text-ink-500">
                  sistema
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CONECTAR RELOJ
        ===================================================== */}

        {!bleData.connected && (
          <button
            onClick={connectBLE}
            type="button"
            className="group flex w-full items-center justify-center gap-2.5 rounded-[18px] bg-brand-600 py-4 text-white shadow-[0_9px_24px_rgba(79,70,229,0.25)] transition-all hover:opacity-95 active:scale-[0.98]"
          >
            <IconBluetooth
              size={22}
              className="transition-transform group-hover:scale-110"
            />

            <span className="text-base font-bold">
              Conectar reloj
            </span>
          </button>
        )}

        {/* =====================================================
            ERROR BLUETOOTH
        ===================================================== */}

        {bleError && (
          <div className="rounded-[16px] border border-alert-border bg-alert-fill p-3.5">
            <p className="text-[13px] font-medium text-alert">
              {bleError}
            </p>
          </div>
        )}

        {/* =====================================================
            ESTADO PRINCIPAL
        ===================================================== */}

        {bleData.connected && bleData.bpm > 0 && (
          <HeroStatus state={status} />
        )}

        {/* =====================================================
            ESPERANDO DATOS
        ===================================================== */}

        {bleData.connected && bleData.bpm === 0 && (
          <div className="relative overflow-hidden rounded-[22px] border border-white/70 bg-white/60 p-6 text-center shadow-[0_8px_25px_rgba(30,27,75,0.06)] backdrop-blur-xl">

            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10">
              <IconActivity
                size={27}
              />
            </div>

            <p className="text-[15px] font-semibold text-ink-900">
              Reloj conectado
            </p>

            <p className="mx-auto mt-1 max-w-[280px] text-[12px] leading-relaxed text-ink-600">
              Coloca el dedo en el sensor para comenzar
              a recibir tus datos de pulso.
            </p>
          </div>
        )}

        {/* =====================================================
            PULSO
        ===================================================== */}

        <PulseCard
          bpm={bleData.bpm}
          bars={pulseBars}
        />

        {/* =====================================================
            DISPOSITIVO
        ===================================================== */}

        <DeviceCard
          connected={bleData.connected}
          signalStatus={
            bleData.connected
              ? "Señal estable"
              : "Sin conectar"
          }
          batteryPercent={Math.round(
            bleData.batteryPercent
          )}
        />

        {/* =====================================================
            FRASE ANDINA
        ===================================================== */}

        <div className="relative overflow-hidden rounded-[20px] bg-brand-600 p-5 text-white shadow-[0_10px_25px_rgba(79,70,229,0.2)]">
          <div className="absolute -right-5 -top-8 text-[100px] opacity-[0.08]">
            ✦
          </div>

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60">
              NeuroWatch
            </p>

            <p className="mt-2 max-w-[300px] text-[17px] font-semibold leading-snug">
              Tecnología para cuidar lo más importante:
              tu vida.
            </p>

            <p className="mt-2 text-[11px] text-white/60">
              Innovación nacida desde Áncash.
            </p>
          </div>
        </div>

        {/* =====================================================
            ALERTA
        ===================================================== */}

        <AlertModal
          open={alertOpen}
          remainingSeconds={countdownSeconds}
          totalSeconds={settings.countdownSeconds}
          contacts={contacts.map((c) => c.name)}
          onCancel={cancelAlert}
        />
      </div>
    </div>
  );
}
```
