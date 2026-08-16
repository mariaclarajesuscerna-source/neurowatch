type Status = "ok" | "warn" | "alert" | "muted";

const colorMap: Record<Status, { fill: string; border: string; dot: string; text: string }> = {
  ok: {
    fill: "bg-ok-fill",
    border: "border-[#10B98159]",
    dot: "bg-ok",
    text: "text-ink-900",
  },
  warn: {
    fill: "bg-[#F59E0B1A]",
    border: "border-[#F59E0B59]",
    dot: "bg-warn",
    text: "text-ink-900",
  },
  alert: {
    fill: "bg-alert-fill",
    border: "border-alert-border",
    dot: "bg-alert",
    text: "text-alert",
  },
  muted: {
    fill: "bg-[#94A3B826]",
    border: "border-muted/35",
    dot: "bg-muted",
    text: "text-ink-600",
  },
};

export default function StatusChip({
  label,
  status,
  size = "md",
}: {
  label: string;
  status: Status;
  size?: "sm" | "md";
}) {
  const c = colorMap[status];
  const dotSize = size === "sm" ? "h-[7px] w-[7px]" : "h-2 w-2";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-[7px] rounded-full border ${c.fill} ${c.border} ${c.text} ${size === "sm" ? "text-[11px] leading-none px-2.5 py-[5px]" : "text-[13px] leading-none font-semibold"}`}
    >
      <span className={`rounded-full shrink-0 ${dotSize} ${c.dot}`} />
      {label}
    </span>
  );
}
