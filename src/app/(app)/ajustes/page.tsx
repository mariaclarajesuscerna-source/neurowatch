"use client";

import { useEffect, useState } from "react";

import {
  IconActivity,
  IconBluetooth,
} from "@/components/ui/icons";

import GlassCard from "@/components/ui/GlassCard";

import { useNeurowatch } from "@/components/NeurowatchProvider";
import { useLanguage } from "@/components/LanguageProvider";

export default function AjustesPage() {
  const {
    settings,
    saveSettings,
    patient,
    savePatient,
    bleData,
    bleError,
    connectBLE,
    disconnectBLE,
    recentBPMs,
  } = useNeurowatch();

  const { t, language } = useLanguage();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [rest, setRest] = useState("70");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(patient?.name ?? "");
    setAge(patient?.age ?? "");
    setRest(String(patient?.restingBPM ?? 70));
  }, [patient]);

  const save = () => {
    savePatient({
      name: name.trim() || "Usuario",
      age: age.trim(),
      restingBPM: Math.max(
        30,
        Math.min(220, Number(rest) || 70)
      ),
    });

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  const input =
    "mt-1 h-10 w-full rounded-xl border border-[#dfc49a] bg-white px-3 text-[#263a32] outline-none focus:border-[#087f83]";

  const watchButtonText = bleData.connected
    ? language === "qu"
      ? "Relojta rakiy"
      : "Desconectar"
    : language === "qu"
      ? "Relojta tinkichiy"
      : "Conectar";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7efe0] px-4 pb-28 pt-5 md:px-8 md:pb-10">
      {/* =====================================================
          PATRÓN TEXTIL
      ====================================================== */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-2">
        <div
          className="h-full"
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
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        {/* ===================================================
            ENCABEZADO
        ==================================================== */}

        <div className="mb-5 overflow-hidden rounded-[28px] border border-[#dfc49a] bg-[#fff9ed] shadow-[0_14px_35px_rgba(72,48,25,0.10)]">
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
                  #087f83 16px,
                  #087f83 24px
                )
              `,
            }}
          />

          <div className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eee8f3] text-[#73518e]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80">
                <IconActivity size={22} />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black uppercase text-[#075d63]">
                {language === "qu"
                  ? "Rurayninkuna"
                  : "Ajustes"}
              </h1>

              <p className="mt-1 text-xs text-[#79634d]">
                {language === "qu"
                  ? "Sutiyki, reloj hinallataq qhawariy"
                  : "Perfil, reloj y configuración"}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            MIS DATOS
        ==================================================== */}

        <GlassCard className="mb-4 flex flex-col gap-4 rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-5">
          <b className="text-base font-black text-[#263a32]">
            {language === "qu"
              ? "Datosniy"
              : "Mis datos"}
          </b>

          <label className="text-sm font-bold text-[#6b5842]">
            {t("name")}

            <input
              className={input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                language === "qu"
                  ? "Sutiyki"
                  : "Tu nombre"
              }
            />
          </label>

          <label className="text-sm font-bold text-[#6b5842]">
            {t("age")}

            <input
              className={input}
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </label>

          <label className="text-sm font-bold text-[#6b5842]">
            {t("restingHeartRate")}

            <input
              className={input}
              inputMode="numeric"
              value={rest}
              onChange={(e) => setRest(e.target.value)}
            />
          </label>

          <button
            type="button"
            onClick={save}
            className="h-11 rounded-xl bg-[#087f83] font-black text-white transition-transform active:scale-[0.98]"
          >
            {saved
              ? language === "qu"
                ? "Datos waqaychasqa"
                : "Datos guardados"
              : language === "qu"
                ? "Datosniyta waqaychay"
                : "Guardar mis datos"}
          </button>
        </GlassCard>

        {/* ===================================================
            RELOJ
        ==================================================== */}

        <GlassCard className="mb-4 flex flex-col gap-3 rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-5">
          <div className="flex items-center justify-between">
            <b className="text-base font-black text-[#263a32]">
              {language === "qu"
                ? "Reloj"
                : "Reloj"}
            </b>

            <span
              className={
                bleData.connected
                  ? "font-bold text-ok"
                  : "font-bold text-[#8c7660]"
              }
            >
              {bleData.connected
                ? language === "qu"
                  ? "Tinkisqa"
                  : "Conectado"
                : language === "qu"
                  ? "Rakisqa"
                  : "Desconectado"}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[#6b5842]">
            {bleData.connected
              ? language === "qu"
                ? `Chaskichkan ${bleData.bpm || 0} BPM`
                : `Recibiendo ${bleData.bpm || 0} BPM`
              : language === "qu"
                ? "Neurowatchta tinkichiy sunqupa muyuriyninkunata chaskinaykipaq."
                : "Conecta tu Neurowatch para recibir pulsaciones."}
          </p>

          <button
            type="button"
            onClick={
              bleData.connected
                ? disconnectBLE
                : connectBLE
            }
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087f83] font-black text-white transition-transform active:scale-[0.98]"
          >
            <IconBluetooth size={19} />

            {watchButtonText}
          </button>

          {bleError && (
            <p className="rounded-xl bg-[#c1272d]/10 p-3 text-sm font-semibold text-alert">
              {bleError}
            </p>
          )}
        </GlassCard>

        {/* ===================================================
            REGISTRO BLE
        ==================================================== */}

        <GlassCard className="mb-4 flex flex-col gap-2 rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-5">
          <b className="text-base font-black text-[#263a32]">
            {language === "qu"
              ? "BLEpa kawsaypa qillqaynin"
              : "Registro BLE en vivo"}
          </b>

          <p className="text-xs text-[#6b5842]">
            {language === "qu"
              ? "Qhipa trama"
              : "Última trama"}{" "}
            : BPM {bleData.bpm || 0} · IR{" "}
            {bleData.ir || 0}
          </p>

          <div className="max-h-40 overflow-y-auto rounded-lg bg-[#263a32] p-3 font-mono text-xs text-[#C4F5D2]">
            {recentBPMs.length > 0 ? (
              recentBPMs
                .slice(-12)
                .reverse()
                .map((b, i) => (
                  <p key={i}>
                    RX BLE bpm={b} ir={bleData.ir || 0}
                  </p>
                ))
            ) : (
              <p>
                {language === "qu"
                  ? "Relojmanta datokunata suyarichkan…"
                  : "Esperando datos del reloj…"}
              </p>
            )}
          </div>

          <small className="text-[#8c7660]">
            Monitor Serie ESP32: 115200 baudios.
          </small>
        </GlassCard>

        {/* ===================================================
            MONITOREO
        ==================================================== */}

        <GlassCard className="flex flex-col gap-4 rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-5">
          <b className="text-base font-black text-[#263a32]">
            {language === "qu"
              ? "Qhawariy"
              : "Monitoreo"}
          </b>

          <label className="font-medium text-[#6b5842]">
            {language === "qu"
              ? "Tolerancia"
              : "Tolerancia"}{" "}
            : ±{settings.toleranceBPM} BPM

            <input
              type="range"
              min={5}
              max={30}
              value={settings.toleranceBPM}
              onChange={(e) =>
                saveSettings({
                  ...settings,
                  toleranceBPM: Number(
                    e.target.value
                  ),
                })
              }
              className="mt-2 w-full"
            />
          </label>

          <label className="font-medium text-[#6b5842]">
            {language === "qu"
              ? "Suyaypa yupaynin"
              : "Cuenta regresiva"}{" "}
            : {settings.countdownSeconds} s

            <input
              type="range"
              min={30}
              max={60}
              step={5}
              value={settings.countdownSeconds}
              onChange={(e) =>
                saveSettings({
                  ...settings,
                  countdownSeconds: Number(
                    e.target.value
                  ),
                })
              }
              className="mt-2 w-full"
            />
          </label>
        </GlassCard>
      </div>
    </div>
  );
}
