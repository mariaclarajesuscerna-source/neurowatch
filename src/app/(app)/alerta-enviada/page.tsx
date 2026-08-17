"use client";

import { useRouter } from "next/navigation";

import {
  IconActivity,
  IconSignal,
  IconWifi,
  IconBatteryFull,
  IconCheck,
  IconSend,
  IconHeartPulse,
  IconPhone,
} from "@/components/ui/icons";

import GlassCard from "@/components/ui/GlassCard";
import StatusChip from "@/components/ui/StatusChip";

import { useNeurowatch } from "@/components/NeurowatchProvider";
import { useLanguage } from "@/components/LanguageProvider";

export default function AlertaEnviadaPage() {
  const router = useRouter();

  const {
    contacts,
    patient,
    bleData,
    alertSentAt,
    clearAlertSent,
  } = useNeurowatch();

  const { language, t } = useLanguage();

  if (!alertSentAt) {
    router.replace("/");
    return null;
  }

  const secondsAgo = Math.floor(
    (Date.now() - alertSentAt) / 1000
  );

  const name = patient?.name ?? "el paciente";

  const emergencyTitle = t("emergencyTitle");
  const alertSent = t("alertSent");
  const contactsNotified = t("contactsNotified");
  const sent = t("sent");
  const secondsAgoText = t("secondsAgo");
  const stayCalm = t("stayCalm");
  const instruction1 = t("instruction1");
  const instruction2 = t("instruction2");
  const instruction3 = t("instruction3");
  const callEmergency = t("callEmergency");
  const backDashboard = t("backDashboard");

  const instructions = [
    instruction1,
    instruction2,
    instruction3,
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7efe0] px-4 pb-28 pt-5 md:px-8 md:pb-10">
      {/* DECORACIÓN TEXTIL */}

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

      <div className="relative mx-auto flex w-full max-w-lg flex-col gap-4 pt-2">
        {/* STATUS BAR */}

        <div className="flex items-center justify-between px-1 md:hidden">
          <span className="text-[15px] font-semibold text-[#263a32]">
            {new Date().toLocaleTimeString(
              "es-ES",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </span>

          <div className="flex items-center gap-1.5 text-[#263a32]">
            <IconSignal size={16} />
            <IconWifi size={16} />
            <IconBatteryFull size={16} />
          </div>
        </div>

        {/* HEADER */}

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#087f83] text-white shadow-[0_6px_18px_rgba(8,127,131,0.22)]">
            <IconActivity size={22} />
          </div>

          <div className="min-w-0">
            <span className="block text-[22px] font-black leading-tight text-[#075d63]">
              NeuroWatch
            </span>

            <span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#c1440c]">
              {emergencyTitle}
            </span>
          </div>
        </div>

        {/* ALERTA ENVIADA */}

        <GlassCard className="flex flex-col items-center gap-3 rounded-[26px] border border-[#c8e2d1] bg-[#edf8f1] p-6 text-center shadow-[0_12px_30px_rgba(72,48,25,0.08)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2f8f5b] text-white shadow-[0_8px_22px_rgba(47,143,91,0.25)]">
            <IconCheck size={32} />
          </div>

          <h2 className="text-[24px] font-black text-[#263a32]">
            {alertSent}
          </h2>

          <p className="max-w-[290px] text-[13px] leading-relaxed text-[#6b5842]">
            {contactsNotified}
          </p>

          {name && (
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8c7660]">
              {language === "qu"
                ? `Runapa sutiy: ${name}`
                : `Paciente: ${name}`}
            </p>
          )}
        </GlassCard>

        {/* CONTACTOS */}

        <GlassCard className="flex flex-col gap-4 rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-5 shadow-[0_10px_28px_rgba(72,48,25,0.08)]">
          <span className="text-[13px] font-black uppercase tracking-[0.12em] text-[#6b5842]">
            {contactsNotified}
          </span>

          {contacts.length === 0 ? (
            <div className="rounded-2xl bg-[#f7efe0] p-4 text-center">
              <p className="text-sm text-[#8c7660]">
                {language === "qu"
                  ? "Mana tinkiqkuna kanchu."
                  : "No hay contactos registrados."}
              </p>
            </div>
          ) : (
            contacts.map((c, i) => {
              const initials = c.name
                .charAt(0)
                .toUpperCase();

              const bgColors = [
                "bg-[#087f83]",
                "bg-[#2f8f5b]",
              ];

              const ts = Math.max(
                0,
                secondsAgo - i * 2
              );

              return (
                <div
                  key={c.telegramChatId}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      ${bgColors[i % 2]}
                    `}
                  >
                    <span className="text-base font-black text-white">
                      {initials}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-black text-[#263a32]">
                      {c.name}
                    </span>

                    <div className="mt-0.5 flex items-center gap-1.5">
                      <IconSend
                        size={13}
                        className="text-[#087f83]"
                      />

                      <span className="text-xs text-[#6b5842]">
                        {c.relation} · Telegram
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusChip
                      label={sent}
                      status="ok"
                      size="sm"
                    />

                    <span className="text-[11px] text-[#8c7660]">
                      {secondsAgoText} {ts}s
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </GlassCard>

        {/* RECOMENDACIONES */}

        <GlassCard className="flex flex-col gap-4 rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-5 shadow-[0_10px_28px_rgba(72,48,25,0.08)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#087f83]/10 text-[#087f83]">
              <IconHeartPulse size={20} />
            </div>

            <span className="text-[15px] font-black text-[#263a32]">
              {stayCalm}
            </span>
          </div>

          {instructions.map((instruction, i) => (
            <div
              key={i}
              className="flex items-start gap-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8ddc5] text-xs font-black text-[#087f83]">
                {i + 1}
              </span>

              <p className="pt-0.5 text-[13px] leading-relaxed text-[#6b5842]">
                {instruction}
              </p>
            </div>
          ))}
        </GlassCard>

        {/* LLAMAR A URGENCIAS */}

        <a
          href="tel:911"
          className="flex w-full items-center justify-center gap-2.5 rounded-[19px] bg-[#c1272d] py-4 text-white shadow-[0_8px_22px_rgba(193,39,45,0.25)] transition hover:scale-[1.01] active:scale-[0.98]"
        >
          <IconPhone size={22} />

          <span className="text-lg font-black">
            {callEmergency}
          </span>
        </a>

        {/* VOLVER */}

        <button
          type="button"
          onClick={() => {
            clearAlertSent();
            router.push("/");
          }}
          className="w-full rounded-xl py-3 text-[13px] font-bold text-[#8c7660] transition hover:bg-[#f1e5ce]"
        >
          {backDashboard}
        </button>
      </div>
    </div>
  );
}
