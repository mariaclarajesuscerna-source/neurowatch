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
    dot: "bg-[#2F8F5B]",
    border: "border-[#2F8F5B]/30",
    bg: "bg-[#2F8F5B]/10",
    label: "Estable",
    desc: "Todo en orden. Tu pulso se mantiene dentro del rango habitual.",
  },

  warn: {
    dot: "bg-[#E8A33D]",
    border: "border-[#E8A33D]/40",
    bg: "bg-[#E8A33D]/10",
    label: "Atención",
    desc: "El pulso muestra variaciones. Conviene revisar tu estado.",
  },

  alert: {
    dot: "bg-[#C1272D]",
    border: "border-[#C1272D]/35",
    bg: "bg-[#C1272D]/10",
    label: "Alerta",
    desc: "Se detectó una anomalía en tu pulso. Revisa tu estado.",
  },
};

export default function HeroStatus({
  state = "ok",
}: {
  state?: HeroState;
}) {
  const c = stateConfig[state];

  return (
    <GlassCard
      className={`${c.bg} ${c.border} rounded-[24px] p-5`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`h-4 w-4 shrink-0 rounded-full ${c.dot}`}
        />

        <span className="font-display text-2xl font-black uppercase text-[#263A32]">
          {c.label}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-[#6B5842]">
        {c.desc}
      </p>
    </GlassCard>
  );
}
