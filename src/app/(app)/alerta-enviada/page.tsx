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

export default function AlertaEnviadaPage() {
  const router = useRouter();
  const { contacts, patient, bleData, alertSentAt, clearAlertSent } = useNeurowatch();

  if (!alertSentAt) {
    router.replace("/");
    return null;
  }

  const secondsAgo = Math.floor((Date.now() - alertSentAt) / 1000);
  const name = patient?.name ?? "el paciente";

  return (
    <div className="flex flex-col gap-4 px-5 pt-4 md:pt-6 md:max-w-lg md:mx-auto">
      {/* Status Bar — mobile only */}
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

      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="h-[34px] w-[34px] rounded-[11px] bg-brand-600 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.25)] text-white">
          <IconActivity size={20} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[22px] font-bold text-ink-900 leading-tight">
            Neurowatch
          </span>
          <span className="text-[13px] font-normal text-ink-600 leading-tight">
            Emergencia
          </span>
        </div>
      </div>

      {/* Success Card */}
      <GlassCard className="bg-ok-fill border-ok rounded-[22px] flex flex-col gap-2.5 p-5 items-center shadow-[0_8px_24px_rgba(15,23,42,0.1)]">
        <div className="h-14 w-14 rounded-full bg-ok flex items-center justify-center text-white">
          <IconCheck size={30} />
        </div>
        <h2 className="text-[22px] font-bold text-ink-900">Alerta enviada</h2>
        <p className="text-[13px] font-normal text-ink-600 text-center max-w-[260px]">
          Tus contactos de emergencia fueron notificados.
        </p>
      </GlassCard>

      {/* Contacts Notified */}
      <GlassCard className="rounded-[22px] flex flex-col gap-3 p-4">
        <span className="text-[13px] font-semibold text-ink-600 tracking-[0.5px] uppercase">
          Contactos notificados
        </span>

        {contacts.map((c, i) => {
          const initials = c.name.charAt(0).toUpperCase();
          const bgColors = ["bg-brand-500", "bg-ok"];
          const ts = Math.max(0, secondsAgo - i * 2);

          return (
            <div key={c.telegramChatId} className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full ${bgColors[i % 2]} flex items-center justify-center shrink-0`}
              >
                <span className="text-base font-bold text-white">
                  {initials}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[15px] font-semibold text-ink-900">
                  {c.name}
                </span>
                <div className="flex items-center gap-[5px] text-brand-500">
                  <IconSend size={13} />
                  <span className="text-xs font-normal text-ink-600">
                    {c.relation} · Telegram
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end shrink-0">
                <StatusChip label="Enviado" status="ok" size="sm" />
                <span className="text-[11px] font-normal text-ink-400">
                  hace {ts}s
                </span>
              </div>
            </div>
          );
        })}
      </GlassCard>

      {/* Instructions Card */}
      <GlassCard className="rounded-[22px] flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <IconHeartPulse size={18} />
          <span className="text-[15px] font-semibold text-ink-900">
            Mientras tanto, mantén la calma
          </span>
        </div>

        {[
          "Acompaña a la persona y háblale con calma.",
          "No la muevas bruscamente; afloja ropa ajustada.",
          "Mantén el teléfono cerca para recibir llamadas.",
        ].map((text, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="h-[22px] w-[22px] rounded-full bg-brand-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-brand-600">{i + 1}</span>
            </span>
            <p className="text-[13px] font-normal text-ink-600 leading-[1.35] max-w-[260px]">
              {text}
            </p>
          </div>
        ))}
      </GlassCard>

      {/* Call Button */}
      <a
        href="tel:911"
        className="w-full flex items-center justify-center gap-2.5 py-[18px] rounded-[18px] bg-alert text-white shadow-[0_6px_18px_rgba(239,68,68,0.35)]"
      >
        <IconPhone size={22} />
        <span className="text-lg font-bold">Llamar a urgencias</span>
      </a>

      {/* Back to dashboard */}
      <button
        onClick={() => {
          clearAlertSent();
          router.push("/");
        }}
        className="w-full py-3 text-[13px] font-normal text-ink-400"
      >
        Volver al dashboard
      </button>
    </div>
  );
}
