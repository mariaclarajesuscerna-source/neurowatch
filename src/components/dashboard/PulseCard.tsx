import GlassCard from "../ui/GlassCard";
import { IconHeartPulse } from "../ui/icons";

interface PulseBar {
  value: number;
  status: "normal" | "warn";
}

interface PulseCardProps {
  bpm: number;
  bars: PulseBar[];
}

export default function PulseCard({
  bpm,
  bars,
}: PulseCardProps) {
  const maxH = 60;

  return (
    <GlassCard className="rounded-[26px] border-[#E4C99E] bg-[#FFF9ED] p-5">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">

          <div className="text-[#C1440C]">
            <IconHeartPulse size={20} />
          </div>

          <span className="text-sm font-black uppercase text-[#263A32]">
            Pulso en vivo
          </span>
        </div>

        <div className="flex items-end gap-1">
          <span className="text-3xl font-black leading-none tabular-nums text-[#263A32]">
            {bpm > 0 ? bpm : "--"}
          </span>

          <span className="pb-1 text-xs font-black text-[#6B5842]">
            BPM
          </span>
        </div>
      </div>

      {/* Gráfica */}
      <div className="mt-4 flex h-[82px] items-end justify-between gap-[3px] rounded-2xl bg-[#087F83]/10 px-3 py-2">
        {bars.map((bar, index) => (
          <div
            key={index}
            className={`min-w-0 flex-1 rounded-full ${
              bar.status === "warn"
                ? "bg-[#E8A33D]"
                : "bg-[#087F83]"
            }`}
            style={{
              height: `${Math.max(
                10,
                Math.min(
                  100,
                  (bar.value / maxH) * 100
                )
              )}%`,
            }}
          />
        ))}
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex flex-wrap gap-4">

        <div className="flex items-center gap-2">
          <span className="h-2 w-5 rounded-full bg-[#087F83]" />

          <span className="text-[11px] font-semibold text-[#6B5842]">
            Pulso real
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-5 rounded-full bg-[#79C7C5]" />

          <span className="text-[11px] font-semibold text-[#6B5842]">
            Rango esperado
          </span>
        </div>

      </div>
    </GlassCard>
  );
}
