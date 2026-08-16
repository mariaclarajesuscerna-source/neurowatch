import { type ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white/55 backdrop-blur-xl border border-white/70 rounded-[20px] shadow-[0_8px_32px_rgba(31,41,55,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}
