"use client";

import { motion, AnimatePresence } from "motion/react";
import CountdownRing from "./CountdownRing";
import { IconCheck, IconSend } from "../ui/icons";

interface AlertModalProps {
  open: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  contacts: string[];
  onCancel: () => void;
}

export default function AlertModal({
  open,
  remainingSeconds,
  totalSeconds,
  contacts,
  onCancel,
}: AlertModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-900/60"
          />

          {/* Sheet / Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-10 w-full max-w-[390px] bg-[#FFFFFFF2] rounded-t-[26px] md:rounded-[26px] border border-white/70 shadow-[0_-8px_32px_rgba(15,23,42,0.15)] flex flex-col gap-4 items-center px-6 pt-3 pb-7"
          >
            {/* Drag handle */}
            <div className="h-[5px] w-10 rounded-[2.5px] bg-ink-400/35 shrink-0" />

            {/* Alert badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-alert-fill border border-alert-border">
              <span className="h-2 w-2 rounded-full bg-alert shrink-0" />
              <span className="text-[13px] font-bold text-alert leading-none">
                Alerta
              </span>
            </span>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-ink-900 text-center max-w-[300px]">
              Detectamos un pulso anomalo
            </h2>

            {/* Subtext */}
            <p className="text-[15px] font-normal text-ink-600 text-center max-w-[300px]">
              Confirma que estas bien antes de que avisemos a tus contactos.
            </p>

            {/* Countdown ring */}
            <CountdownRing
              totalSeconds={totalSeconds}
              remainingSeconds={remainingSeconds}
            />

            {/* Contact note */}
            <div className="w-full flex items-start gap-2.5 p-3.5 rounded-[14px] bg-alert-fill border border-alert-border">
              <IconSend size={18} />
              <p className="text-[13px] font-medium text-ink-900 max-w-[260px]">
                Si no cancelas, avisaremos a {contacts.join(" y ")} por
                Telegram.
              </p>
            </div>

            {/* Cancel button */}
          <button
  type="button"
  onClick={onCancel}
  className="w-full h-16 flex items-center justify-center gap-2.5 rounded-2xl bg-[#087f83] text-white shadow-[0_8px_20px_rgba(8,127,131,0.25)] active:scale-[0.98] transition-transform"
>
  <IconCheck size={24} />

  <span className="text-[19px] font-bold">
   Estoy bien &middot; Cancelar
  </span>
</button>

            {/* Caption */}
            <p className="text-xs font-normal text-ink-400 text-center max-w-[280px]">
              Esta alerta no se puede cerrar tocando fuera de la ventana.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
