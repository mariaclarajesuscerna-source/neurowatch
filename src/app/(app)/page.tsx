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

  /* =========================================================
     LÓGICA ORIGINAL — NO TOCAR
  ========================================================= */

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
    <div className="relative min-h-screen overflow-hidden bg-[#FBF3E7] text-[#3B2A1A]">

      {/* =====================================================
          FONDO ANDINO
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* manchas decorativas */}
        <div className="absolute -left-28 top-40 h-72 w-72 rounded-full bg-[#DD5F1F]/10 blur-3xl" />
        <div className="absolute -right-32 top-[500px] h-80 w-80 rounded-full bg-[#2F8F5B]/10 blur-3xl" />

        {/* montañas */}
        <div className="absolute bottom-0 left-0 right-0 h-[180px] opacity-[0.07]">
          <svg
            viewBox="0 0 1000 220"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 220 L0 150 L110 75 L185 145 L285 45 L400 155 L510 65 L620 150 L735 35 L850 135 L930 75 L1000 120 L1000 220 Z"
              fill="#C1440C"
            />

            <path
              d="M0 220 L0 180 L150 110 L250 170 L360 90 L470 180 L600 105 L710 175 L820 80 L930 165 L1000 125 L1000 220 Z"
              fill="#2F8F5B"
            />
          </svg>
        </div>
      </div>

      {/* =====================================================
          CONTENEDOR PRINCIPAL
      ===================================================== */}

      <div className="relative mx-auto w-full max-w-[520px] px-4 pb-24 pt-3 md:px-5 md:pt-6">

        {/* ===================================================
            STATUS BAR
        =================================================== */}

        <div className="mb-3 flex items-center justify-between px-1 md:hidden">
          <span className="text-[15px] font-semibold">
            {new Date().toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <div className="flex items-center gap-1.5">
            <IconSignal size={16} />
            <IconWifi size={16} />
            <IconBatteryFull size={16} />
          </div>
        </div>

        {/* ===================================================
            FRANJA TEXTIL SUPERIOR
        =================================================== */}

        <div
          className="mb-4 h-[28px] overflow-hidden rounded-b-[14px] shadow-sm"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                #C1440C 0px,
                #C1440C 8px,
                #E8A33D 8px,
                #E8A33D 16px,
                #2F8F5B 16px,
                #2F8F5B 24px,
                #087F83 24px,
                #087F83 32px
              )
            `,
          }}
        />

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="mb-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            {/* logo */}
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#087F83] text-white shadow-[0_8px_20px_rgba(8,127,131,0.25)]">
              <IconActivity size={25} />
            </div>

            <div>
              <div className="font-display text-[25px] font-extrabold uppercase leading-none tracking-tight text-[#075D63]">
                NeuroWatch
              </div>

              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#C1440C]">
                Huaraz · Perú
              </div>
            </div>

          </div>

          <div className="flex items-center gap-2">

            {/* menú */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-[13px] border border-[#E8CBA5] bg-white/70 text-xl shadow-sm"
            >
              ☰
            </button>

            {/* campana visual */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-[13px] border border-[#E8CBA5] bg-white/70 text-xl shadow-sm"
            >
              🔔
              <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-[#C1272D]" />
            </button>

          </div>
        </header>

        {/* ===================================================
            SELECTOR ESPAÑOL / QUECHUA
        =================================================== */}

        <div className="mb-4 flex justify-center">

          <div className="flex w-full max-w-[330px] overflow-hidden rounded-[16px] border border-[#E6C89E] bg-[#FFF9EE] p-1 shadow-sm">

            <button
              type="button"
              className="flex-1 rounded-[12px] bg-[#087F83] py-2.5 text-[12px] font-extrabold text-white"
            >
              ESPAÑOL
            </button>

            <button
              type="button"
              className="flex-1 rounded-[12px] py-2.5 text-[12px] font-extrabold text-[#704A2D]"
            >
              QUECHUA
            </button>

          </div>
        </div>

        {/* ===================================================
            HERO HUARAZ
        =================================================== */}

        <section className="relative mb-4 overflow-hidden rounded-[27px] border border-[#E7C99E] bg-[#FFF8E9] shadow-[0_12px_35px_rgba(72,48,25,0.12)]">

          {/* patrón superior */}
          <div
            className="h-[26px]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  #C1440C 0px,
                  #C1440C 7px,
                  #E8A33D 7px,
                  #E8A33D 14px,
                  #087F83 14px,
                  #087F83 21px,
                  #2F8F5B 21px,
                  #2F8F5B 28px
                )
              `,
            }}
          />

          <div className="relative p-5">

            <div className="absolute right-3 top-2 text-[54px] opacity-20">
              ☀️
            </div>

            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#C1440C]">
              Tecnología que cuida tu vida
            </div>

            <h1 className="max-w-[340px] font-display text-[31px] font-extrabold uppercase leading-[1.02] text-[#075D63]">
              Tu bienestar,
              <br />
              nuestra misión.
            </h1>

            <p className="mt-3 max-w-[350px] text-[13px] leading-relaxed text-[#6B5842]">
              Monitorea tus signos vitales en tiempo real
              con tecnología creada pensando en nuestra gente.
            </p>

            {/* paisaje decorativo */}
            <div className="mt-4 flex items-end justify-between">

              <div className="flex items-end gap-[-5px]">

                <div className="text-[55px] leading-none">
                  🏔️
                </div>

                <div className="text-[40px] leading-none">
                  ⛰️
                </div>

              </div>

              <div className="text-[48px]">
                🌺
              </div>

            </div>

          </div>
        </section>

        {/* ===================================================
            FRECUENCIA CARDÍACA
        =================================================== */}

        <section className="relative mb-4 overflow-hidden rounded-[28px] border border-[#E5C59B] bg-[#FFF9ED] p-5 shadow-[0_12px_30px_rgba(72,48,25,0.10)]">

          <div className="mb-2 flex items-center justify-between">

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#087F83]">
                Monitoreo en vivo
              </p>

              <h2 className="mt-1 font-display text-[24px] font-extrabold uppercase leading-none text-[#3B2A1A]">
                Frecuencia
                <br />
                cardíaca
              </h2>
            </div>

            <div className="text-[38px]">
              ❤️
            </div>

          </div>

          {/* corazón principal */}
          <div className="relative my-5 flex justify-center">

            <div className="relative flex h-[170px] w-[185px] items-center justify-center">

              <div className="absolute inset-0 flex items-center justify-center text-[155px] leading-none drop-shadow-[0_10px_15px_rgba(193,68,12,0.20)]">
                ❤️
              </div>

              <div className="relative z-10 mt-2 text-center text-white">

                <div className="text-[48px] font-black leading-none">
                  {bleData.bpm > 0 ? bleData.bpm : "--"}
                </div>

                <div className="text-[13px] font-bold">
                  ppm
                </div>

              </div>

            </div>
          </div>

          {/* electrocardiograma */}
          <div className="flex items-center gap-2">

            <div className="h-[2px] flex-1 bg-[#2F8F5B]/50" />

            <div className="text-[30px] font-bold leading-none text-[#2F8F5B]">
              ─╲╱╲╱╲╱─
            </div>

            <div className="h-[2px] flex-1 bg-[#2F8F5B]/50" />

          </div>

          {/* estado */}
          <div className="mt-4 rounded-[18px] border border-[#E7D0AA] bg-white/75 p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[11px] font-black uppercase">
                  Estado actual
                </p>

                <p className="mt-1 text-[16px] font-black text-[#2F8F5B]">
                  {bleData.connected
                    ? "MONITOREO ACTIVO"
                    : "ESPERANDO CONEXIÓN"}
                </p>
              </div>

              <span
                className={`h-3 w-3 rounded-full ${
                  bleData.connected
                    ? "bg-[#2F8F5B]"
                    : "bg-[#A9967D]"
                }`}
              />

            </div>
          </div>

        </section>

        {/* ===================================================
            CONECTAR RELOJ — FUNCIÓN ORIGINAL
        =================================================== */}

        {!bleData.connected && (
          <button
            onClick={connectBLE}
            type="button"
            className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-[19px] bg-[#087F83] py-4 text-white shadow-[0_9px_24px_rgba(8,127,131,0.25)] transition-transform active:scale-[0.98]"
          >
            <IconBluetooth size={22} />

            <span className="text-base font-bold">
              Conectar reloj NeuroWatch
            </span>
          </button>
        )}

        {/* ===================================================
            ERROR BLE — FUNCIÓN ORIGINAL
        =================================================== */}

        {bleError && (
          <div className="mb-4 rounded-[16px] border border-[#C1272D]/30 bg-[#C1272D]/10 p-4">
            <p className="text-[13px] font-medium text-[#C1272D]">
              {bleError}
            </p>
          </div>
        )}

        {/* ===================================================
            HERO STATUS — FUNCIÓN ORIGINAL
        =================================================== */}

        {bleData.connected && bleData.bpm > 0 && (
          <div className="mb-4">
            <HeroStatus state={status} />
          </div>
        )}

        {/* ===================================================
            SIGNOS EN VIVO
        =================================================== */}

        <section className="mb-4">

          <div className="mb-3 flex items-center justify-between">

            <h2 className="font-display text-[20px] font-extrabold uppercase text-[#075D63]">
              Signos en vivo
            </h2>

            <span className="text-[11px] font-bold text-[#2F8F5B]">
              ● EN VIVO
            </span>

          </div>

          <div className="grid grid-cols-2 gap-3">

            {/* BPM */}
            <div className="rounded-[21px] border border-[#E8D0A8] bg-[#FFF9ED] p-4 shadow-sm">

              <div className="mb-2 text-[27px]">
                ❤️
              </div>

              <p className="text-[11px] font-bold text-[#6B5842]">
                Frecuencia cardíaca
              </p>

              <p className="mt-1 text-[25px] font-black text-[#3B2A1A]">
                {bleData.bpm > 0 ? bleData.bpm : "--"}
              </p>

              <p className="text-[10px] font-bold text-[#A9967D]">
                ppm
              </p>

            </div>

            {/* RESPIRACIÓN */}
            <div className="rounded-[21px] border border-[#E8D0A8] bg-[#FFF9ED] p-4 shadow-sm">

              <div className="mb-2 text-[27px]">
                🫁
              </div>

              <p className="text-[11px] font-bold text-[#6B5842]">
                Respiración
              </p>

              <p className="mt-1 text-[25px] font-black text-[#3B2A1A]">
                --
              </p>

              <p className="text-[10px] font-bold text-[#A9967D]">
                rpm
              </p>

            </div>

            {/* SPO2 */}
            <div className="rounded-[21px] border border-[#E8D0A8] bg-[#FFF9ED] p-4 shadow-sm">

              <div className="mb-2 text-[27px]">
                🩸
              </div>

              <p className="text-[11px] font-bold text-[#6B5842]">
                Oxígeno
              </p>

              <p className="mt-1 text-[25px] font-black text-[#3B2A1A]">
                --
              </p>

              <p className="text-[10px] font-bold text-[#A9967D]">
                SpO₂
              </p>

            </div>

            {/* TEMPERATURA */}
            <div className="rounded-[21px] border border-[#E8D0A8] bg-[#FFF9ED] p-4 shadow-sm">

              <div className="mb-2 text-[27px]">
                🌡️
              </div>

              <p className="text-[11px] font-bold text-[#6B5842]">
                Temperatura
              </p>

              <p className="mt-1 text-[25px] font-black text-[#3B2A1A]">
                --
              </p>

              <p className="text-[10px] font-bold text-[#A9967D]">
                °C
              </p>

            </div>

          </div>
        </section>

        {/* ===================================================
            ESPERANDO DATOS — FUNCIÓN ORIGINAL
        =================================================== */}

        {bleData.connected && bleData.bpm === 0 && (
          <div className="mb-4 rounded-[20px] border border-[#E7C99E] bg-white/65 p-6 text-center shadow-sm backdrop-blur-xl">

            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#087F83]/10 text-2xl">
              ❤️
            </div>

            <p className="text-[15px] font-medium text-[#6B5842]">
              Conectado al reloj.
            </p>

            <p className="mx-auto mt-1 max-w-[300px] text-[12px] leading-relaxed text-[#8C7660]">
              Coloca el dedo en el sensor para comenzar
              a recibir tus datos de pulso.
            </p>

          </div>
        )}

        {/* ===================================================
            PULSE CARD ORIGINAL
        =================================================== */}

        <div className="mb-4">
          <PulseCard
            bpm={bleData.bpm}
            bars={pulseBars}
          />
        </div>

        {/* ===================================================
            DEVICE CARD ORIGINAL
        =================================================== */}

        <div className="mb-4">
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
        </div>

        {/* ===================================================
            TARJETA CONECTADO CONTIGO
        =================================================== */}

        <section className="mb-4 overflow-hidden rounded-[23px] border border-[#E7C99E] bg-[#FFF9ED] shadow-sm">

          <div className="p-5">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#087F83] text-2xl">
                🛡️
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#087F83]">
                  NeuroWatch
                </p>

                <h3 className="font-display text-[19px] font-extrabold uppercase">
                  Conectado contigo
                </h3>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-[15px] bg-[#087F83]/10 p-3">
                <p className="text-[10px] font-bold text-[#6B5842]">
                  Estado
                </p>

                <p className="mt-1 text-[14px] font-black text-[#2F8F5B]">
                  {bleData.connected
                    ? "ACTIVO"
                    : "LISTO"}
                </p>
              </div>

              <div className="rounded-[15px] bg-[#C1440C]/10 p-3">
                <p className="text-[10px] font-bold text-[#6B5842]">
                  Batería
                </p>

                <p className="mt-1 text-[14px] font-black">
                  {bleData.connected
                    ? `${Math.round(
                        bleData.batteryPercent
                      )}%`
                    : "--"}
                </p>
              </div>

            </div>
          </div>

          {/* franja */}
          <div
            className="h-[18px]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  #C1440C 0px,
                  #C1440C 6px,
                  #E8A33D 6px,
                  #E8A33D 12px,
                  #2F8F5B 12px,
                  #2F8F5B 18px,
                  #087F83 18px,
                  #087F83 24px
                )
              `,
            }}
          />

        </section>

        {/* ===================================================
            HUARAZ
        =================================================== */}

        <section className="mb-4 overflow-hidden rounded-[25px] bg-[#087F83] text-white shadow-[0_12px_30px_rgba(8,127,131,0.20)]">

          <div className="relative p-5">

            <div className="absolute right-3 top-2 text-[65px] opacity-30">
              ☀️
            </div>

            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
              Nuestra tierra
            </p>

            <h2 className="mt-1 font-display text-[29px] font-extrabold uppercase">
              Huaraz
            </h2>

            <p className="mt-1 max-w-[260px] text-[13px] font-medium leading-relaxed text-white/85">
              Tecnología con raíces que nos unen.
            </p>

            <div className="mt-4 flex items-end justify-between">

              <span className="text-[55px]">
                🏔️
              </span>

              <span className="text-[45px]">
                🦙
              </span>

              <span className="text-[45px]">
                🌺
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            POR QUÉ NEUROWATCH
        =================================================== */}

        <section className="mb-4 rounded-[24px] border border-[#E7C99E] bg-[#FFF9ED] p-5 shadow-sm">

          <h2 className="mb-4 font-display text-[20px] font-extrabold uppercase text-[#C1440C]">
            ¿Por qué NeuroWatch?
          </h2>

          <div className="space-y-4">

            <div className="flex items-start gap-3">
              <span className="text-[27px]">❤️</span>

              <div>
                <p className="text-[13px] font-black uppercase">
                  Monitoreo en tiempo real
                </p>

                <p className="text-[11px] leading-relaxed text-[#6B5842]">
                  Cuida tu corazón y vigila tus signos vitales.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[27px]">💡</span>

              <div>
                <p className="text-[13px] font-black uppercase">
                  Tecnología con propósito
                </p>

                <p className="text-[11px] leading-relaxed text-[#6B5842]">
                  Innovación pensada para mejorar vidas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[27px]">🤝</span>

              <div>
                <p className="text-[13px] font-black uppercase">
                  Hecho para nuestra gente
                </p>

                <p className="text-[11px] leading-relaxed text-[#6B5842]">
                  Una solución inspirada en nuestra tierra.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ===================================================
            ALERTAS VISUAL
        =================================================== */}

        <section className="mb-5 overflow-hidden rounded-[24px] border border-[#E7C99E] bg-[#FFF9ED] shadow-sm">

          <div className="flex items-center justify-between bg-[#C1440C] px-5 py-3 text-white">

            <h2 className="font-display text-[19px] font-extrabold uppercase">
              Alertas
            </h2>

            <span className="text-xl">
              🔔
            </span>

          </div>

          <div className="space-y-3 p-4">

            <div className="flex items-center gap-3 rounded-[15px] bg-[#2F8F5B]/10 p-3">

              <span className="text-[25px]">
                ✅
              </span>

              <div>
                <p className="text-[12px] font-black uppercase">
                  Estado estable
                </p>

                <p className="text-[10px] text-[#6B5842]">
                  Tus signos vitales están siendo monitoreados.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3 rounded-[15px] bg-[#E8A33D]/10 p-3">

              <span className="text-[25px]">
                ⚠️
              </span>

              <div>
                <p className="text-[12px] font-black uppercase">
                  Recuerda descansar
                </p>

                <p className="text-[10px] text-[#6B5842]">
                  Tómate un momento para relajarte.
                </p>
              </div>

            </div>

          </div>
        </section>

      </div>

      {/* =====================================================
          BARRA INFERIOR — VISUAL
          No modifica ninguna navegación existente.
      ===================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[520px] border-t border-[#E2C79E] bg-[#FFF9ED]/95 px-3 pb-3 pt-2 shadow-[0_-8px_25px_rgba(72,48,25,0.10)] backdrop-blur-xl">

        <div className="grid grid-cols-4 gap-1">

          <div className="flex flex-col items-center gap-1 rounded-[14px] bg-[#087F83] py-2 text-white">
            <span className="text-[20px]">⌂</span>
            <span className="text-[9px] font-black uppercase">
              Inicio
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-[14px] py-2 text-[#6B5842]">
            <span className="text-[20px]">▣</span>
            <span className="text-[9px] font-black uppercase">
              Historial
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-[14px] py-2 text-[#6B5842]">
            <span className="text-[20px]">🔔</span>
            <span className="text-[9px] font-black uppercase">
              Alertas
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-[14px] py-2 text-[#6B5842]">
            <span className="text-[20px]">●</span>
            <span className="text-[9px] font-black uppercase">
              Perfil
            </span>
          </div>

        </div>
      </nav>

      {/* =====================================================
          ALERT MODAL — FUNCIÓN ORIGINAL
      ===================================================== */}

      <AlertModal
        open={alertOpen}
        remainingSeconds={countdownSeconds}
        totalSeconds={settings.countdownSeconds}
        contacts={contacts.map((c) => c.name)}
        onCancel={cancelAlert}
      />

    </div>
  );
}
