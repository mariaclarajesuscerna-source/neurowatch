import { type ReactNode } from "react";
import GlassCard from "../ui/GlassCard";

type HeroState = "ok" | "warn" | "alert";

const stateConfig: Record<
  HeroState,
  {
    dot: string;
    border: string;
    bg: string;
    label: string;
    desc: string;
  }
> = {
  ok: {
    dot: "bg-ok",
    border: "border-[#10B98159]",
    bg: "bg-ok-fill",
    label: "Estable",
    desc: "Todo en orden. Tu pulso se mantiene dentro del rango habitual.",
  },
  warn: {
    dot: "bg-warn",
    border: "border-[#F59E0B59]",
    bg: "bg-[#F59E0B1A]",
    label: "Atencion",
    desc: "El pulso muestra variaciones. No es una emergencia, pero conviene revisar.",
  },
  alert: {
    dot: "bg-alert",
    border: "border-alert-border",
    bg: "bg-alert-fill",
    label: "Alerta",
    desc: "Se detecto una anomalia en tu pulso. Revisa tu estado.",
  },
};

export default function HeroStatus({
  state = "ok",
  name,
  pulse,
  children,
}: {
  state?: HeroState;
  name?: string;
  pulse?: number;
  children?: ReactNode;
}) {
  const c = stateConfig[state];

  return (
    <GlassCard
      className={`${c.bg} ${c.border} flex flex-col gap-2.5 p-6`}
    >
      <div className="flex items-center gap-3">
        <span className={`h-[18px] w-[18px] rounded-full shrink-0 ${c.dot}`} />
        <span className="text-[40px] font-bold text-ink-900 leading-none">
          {c.label}
        </span>
      </div>
      <p className="text-[15px] font-normal text-ink-600 leading-[1.4]">
        {c.desc}
      </p>
      {children}
    </GlassCard>
  );
}
