"use client";

import { motion } from "motion/react";

interface CountdownRingProps {
  totalSeconds: number;
  remainingSeconds: number;
}

export default function CountdownRing({
  totalSeconds,
  remainingSeconds,
}: CountdownRingProps) {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = remainingSeconds / totalSeconds;
  const strokeDashoffset = circumference * (1 - progress);
  const size = 224;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EF444426"
          strokeWidth="14"
        />

        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EF4444"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={remainingSeconds}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[76px] font-bold leading-none tabular-nums text-alert"
        >
          {remainingSeconds}
        </motion.span>

        <span className="text-[15px] font-semibold text-ink-600">
          segundos
        </span>
      </div>
    </div>
  );
}
