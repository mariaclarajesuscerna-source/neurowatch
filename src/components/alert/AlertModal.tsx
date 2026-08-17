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

          {/* =====================================================
              FONDO OSCURO
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#17324D]/65 backdrop-blur-[3px]"
          />

          {/* =====================================================
              MODAL
          ===================================================== */}

          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="
              relative
              z-10
              flex
              w-full
              max-w-[410px]
              flex-col
              items-center
              gap-4
              overflow-hidden
              rounded-t-[30px]
              border
              border-white
              bg-[#FFFDFC]
              px-6
              pb-7
              pt-3
              shadow-[0_-12px_45px_rgba(23,50,77,0.25)]
              md:rounded-[30px]
            "
          >

            {/* =================================================
                DECORACIÓN SUPERIOR
            ================================================= */}

            <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-[#EF3E32] via-[#F28C28] to-[#F5C542]" />

            {/* Drag handle */}

            <div className="mt-1 h-1.5 w-11 rounded-full bg-[#D7E0E4]" />

            {/* =================================================
                ICONO DE ALERTA
            ================================================= */}

            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 15,
              }}
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border-[6px]
                border-[#FFE1DC]
                bg-[#FFF0EE]
                text-4xl
                shadow-[0_8px_25px_rgba(239,62,50,0.15)]
              "
            >
              ❤️
            </motion.div>

            {/* =================================================
                ETIQUETA ALERTA
            ================================================= */}

            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#FFC9C5]
                bg-[#FFF0EE]
                px-4
                py-2
              "
            >
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#EF3E32]" />

              <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#D9342B]">
                Alerta
              </span>
            </span>

            {/* =================================================
                TÍTULO
            ================================================= */}

            <h2 className="max-w-[320px] text-center text-[25px] font-black leading-tight tracking-[-0.025em] text-[#17324D]">
              Detectamos un pulso anómalo
            </h2>

            {/* =================================================
                DESCRIPCIÓN
            ================================================= */}

            <p className="max-w-[310px] text-center text-[14px] leading-relaxed text-[#667782]">
              Confirma que estás bien antes de que avisemos a tus
              contactos.
            </p>

            {/* =================================================
                CUENTA REGRESIVA
            ================================================= */}

            <div className="my-1">
              <CountdownRing
                totalSeconds={totalSeconds}
                remainingSeconds={remainingSeconds}
              />
            </div>

            {/* =================================================
                AVISO DE CONTACTOS
            ================================================= */}

            <div
              className="
                flex
                w-full
                items-start
                gap-3
                rounded-[18px]
                border
                border-[#FFCFC8]
                bg-[#FFF4F1]
                p-4
              "
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <IconSend size={18} />
              </div>

              <p className="pt-0.5 text-[12px] font-semibold leading-relaxed text-[#573F3A]">
                Si no cancelas, avisaremos a{" "}
                <strong className="font-black text-[#17324D]">
                  {contacts.length > 0
                    ? contacts.join(" y ")
                    : "tus contactos"}
                </strong>{" "}
                por Telegram.
              </p>
            </div>

            {/* =================================================
                BOTÓN ESTOY BIEN / CANCELAR
            ================================================= */}

            <button
              type="button"
              onClick={onCancel}
              className="
                flex
                h-16
                w-full
                items-center
                justify-center
                gap-2.5
                rounded-[19px]
                bg-gradient-to-r
                from-[#168B84]
                to-[#1C9B79]
                text-white
                shadow-[0_10px_25px_rgba(22,139,132,0.25)]
                transition-all
                hover:-translate-y-0.5
                hover:shadow-[0_13px_30px_rgba(22,139,132,0.30)]
                active:scale-[0.98]
              "
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <IconCheck size={22} />
              </span>

              <span className="text-[17px] font-black">
                Estoy bien · Cancelar
              </span>
            </button>

            {/* =================================================
                TEXTO INFORMATIVO
            ================================================= */}

            <div className="flex items-center gap-2 text-center">
              <span className="text-[13px]">
                🛡️
              </span>

              <p className="max-w-[280px] text-[10px] font-semibold leading-relaxed text-[#89969D]">
                Esta alerta no se puede cerrar tocando fuera de la
                ventana.
              </p>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
