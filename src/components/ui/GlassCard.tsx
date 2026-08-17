import { type ReactNode } from "react";

interface GlassCardProps {
  children?: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-[#E4C99E]
        bg-[#FFF9ED]/95
        shadow-[0_10px_30px_rgba(72,48,25,0.08)]
        backdrop-blur-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
}
