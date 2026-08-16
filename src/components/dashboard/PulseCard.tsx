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

export default function PulseCard({ bpm, bars }: PulseCardProps) {
  const maxH = 60;

  return (
    <GlassCard className="flex flex-col gap-3.5 p-5">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconHeartPulse size={18} />
          <span className="text-[15px] font-semibold text-ink-900">
            Pulso en vivo
          </span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-[34px] font-bold text-ink-900 leading-none tabular-nums">
            {bpm}
          </span>
          <span className="text-[13px] font-semibold text-ink-600 leading-none pb-[6px]">
            BPM
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[76px] bg-brand-300/15 rounded-[14px] flex items-end justify-between gap-[3px] px-2.5 py-2">
        {bars.map((bar, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full min-w-0 ${
              bar.status === "warn" ? "bg-warn" : "bg-brand-600"
            }`}
            style={{ height: `${(bar.value / maxH) * 100}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-[6px] w-[14px] rounded-full bg-brand-600 shrink-0" />
          <span className="text-xs font-normal text-ink-600">
            Pulso real
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[6px] w-[14px] rounded-full bg-brand-300 shrink-0" />
          <span className="text-xs font-normal text-ink-600">
            Rango esperado
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
