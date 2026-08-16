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
      className={`
        neurowatch-card
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-white/70
        bg-white/65
        backdrop-blur-2xl
        shadow-[0_18px_50px_rgba(76,29,149,0.10)]
        ${className}
      `}
    >
      {/* Brillo tecnológico */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-32
          w-32
          rounded-full
          bg-cyan-300/20
          blur-3xl
        "
      />

      {/* Detalle andino */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-1
          w-full
          bg-gradient-to-r
          from-violet-500
          via-cyan-400
          to-amber-400
          opacity-70
        "
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
