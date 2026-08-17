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

  const { language } = useLanguage();

  if (!alertSentAt) {
    router.replace("/");
    return null;
  }

  const secondsAgo = Math.floor(
    (Date.now() - alertSentAt) / 1000
  );

  const name =
    patient?.name ??
    (language === "qu"
      ? "unquq"
      : "el paciente");

  const text =
    language === "qu"
      ? {
          emergency: "Utqay yanapakuy",
          sent: "Uyariy kachasqa",
          notified:
            "Utqay yanapakuqkikunata willasqa.",
          contacts:
            "Willasqa tinkiqkuna",
          sentStatus: "Kachasqa",
          ago: "ñawpaq",
          meanwhile:
            "Chay pacha, samayta waqaychay",
          instruction1:
            "Runata qhawariy hinaspa allin rimaywan yanapay.",
          instruction2:
            "Ama utqaylla kuyuchiychu; p'achata pisiqa kachiy.",
          instruction3:
            "Celularta qayllapi waqaychay, waqyakuna chaskinaykipaq.",
          callEmergency:
            "Utqay yanapakuyman waqyay",
          back:
            "Qallariyman kutiy",
          telegram: "Telegram",
        }
      : {
          emergency: "Emergencia",
          sent: "Alerta enviada",
          notified:
            "Tus contactos de emergencia fueron notificados.",
          contacts:
            "Contactos notificados",
          sentStatus: "Enviado",
          ago: "hace",
          meanwhile:
            "Mientras tanto, mantén la calma",
          instruction1:
            "Acompaña a la persona y háblale con calma.",
          instruction2:
            "No la muevas bruscamente; afloja ropa ajustada.",
          instruction3:
            "Mantén el teléfono cerca para recibir llamadas.",
          callEmergency:
            "Llamar a urgencias",
          back:
            "Volver al dashboard",
          telegram: "Telegram",
        };

  const instructions = [
    text.instruction1,
    text.instruction2,
    text.instruction3,
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7efe0] px-4 pb-28 pt-5 md:px-8 md:pb-10">
      {/* PATRÓN TEXTIL SUPERIOR */}
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

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-4">
        {/* STATUS BAR — MOBILE */}
        <div className="flex items-center justify-between px-1 md:hidden">
          <span className="text-[15px] font-semibold text-[#263a32]">
            {new Date().toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <div className="flex items-center gap-1.5 text-[#263a32]">
            <IconSignal size={16} />
            <IconWifi size={16} />
            <IconBatteryFull size={16} />
          </div>
        </div>

        {/* HEADER */}
        <div className="overflow-hidden rounded-[28px] border border-[#dfc49a] bg-[#fff9ed] shadow-[0_14px_35px_rgba(72,48,25,0.10)]">
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

          <div className="flex items-center gap-3 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#087f83] text-white shadow-[0_7px_18px_rgba(8,127,131,0.25)]">
              <IconActivity size={23} />
            </div>

            <div className="min-w-0">
              <span className="block text-[20px] font-black leading-tight text-[#075d63]">
                NeuroWatch
              </span>

              <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#c1440c]">
                {text.emergency}
              </span>
            </div>
          </div>
        </div>

        {/* ALERTA ENVIADA */}
        <GlassCard className="items-center rounded-[26px] border border-[#b8ddc5] bg-[#edf8f1] p-6 shadow-[0_10px_28px_rgba(47,143,91,0.10)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2f8f5b] text-white shadow-[0_8px_20px_rgba(47,143,91,0.25)]">
            <IconCheck size={30} />
          </div>

          <h2 className="mt-3 text-center text-[24px] font-black text-[#263a32]">
            {text.sent}
          </h2>

          <p className="mt-1 max-w-[290px] text-center text-[13px] leading-relaxed text-[#5f745f]">
            {text.notified}
          </p>

          {name && (
            <span className="mt-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold text-[#6b5842]">
              {name}
            </span>
          )}
        </GlassCard>

        {/* CONTACTOS */}
        <GlassCard className="rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-5">
          <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#6b5842]">
            {text.contacts}
          </span>

          <div className="mt-4 flex flex-col gap-4">
            {contacts.map((c, i) => {
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
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      bgColors[i % 2]
                    }`}
                  >
                    <span className="text-base font-bold text-white">
                      {initials}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold text-[#263a32]">
                      {c.name}
                    </span>

                    <div className="mt-0.5 flex items-center gap-1.5">
                      <IconSend size={13} />

                      <span className="truncate text-xs text-[#6b5842]">
                        {c.relation} ·{" "}
                        {text.telegram}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusChip
                      label={text.sentStatus}
                      status="ok"
                      size="sm"
                    />

                    <span className="text-[11px] text-[#9a8065]">
                      {text.ago} {ts}s
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* INSTRUCCIONES */}
        <GlassCard className="rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-5">
          <div className="flex items-center gap-2">
            <IconHeartPulse
              size={19}
            />

            <span className="text-[15px] font-black text-[#263a32]">
              {text.meanwhile}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {instructions.map(
              (instruction, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e7f1ee]">
                    <span className="text-xs font-black text-[#087f83]">
                      {i + 1}
                    </span>
                  </span>

                  <p className="pt-0.5 text-[13px] leading-[1.4] text-[#6b5842]">
                    {instruction}
                  </p>
                </div>
              )
            )}
          </div>
        </GlassCard>

        {/* LLAMAR A URGENCIAS */}
        <a
          href="tel:911"
          className="flex w-full items-center justify-center gap-2.5 rounded-[18px] bg-[#c1272d] py-[18px] text-white shadow-[0_8px_22px_rgba(193,39,45,0.28)] transition-all hover:bg-[#ad2026] active:scale-[0.98]"
        >
          <IconPhone size={22} />

          <span className="text-lg font-black">
            {text.callEmergency}
          </span>
        </a>

        {/* VOLVER */}
        <button
          type="button"
          onClick={() => {
            clearAlertSent();
            router.push("/");
          }}
          className="w-full py-3 text-[13px] font-bold text-[#8c7660] transition hover:text-[#087f83]"
        >
          {text.back}
        </button>
      </div>
    </div>
  );
}
