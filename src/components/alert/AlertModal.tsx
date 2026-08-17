"use client";

import { AnimatePresence, motion } from "motion/react";

import CountdownRing from "./CountdownRing";

import {
  IconCheck,
  IconSend,
} from "../ui/icons";

import { useLanguage } from "@/components/LanguageProvider";

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
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center">
          {/* FONDO */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#263a32]/65 backdrop-blur-[2px]"
          />

          {/* MODAL */}

          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            transition={{
              type: "spring",
              damping: 28,
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
              border-white/80
              bg-[#fff9ed]
              px-6
              pb-7
              pt-3
              shadow-[0_-12px_40px_rgba(31,41,55,0.22)]
              md:rounded-[30px]
            "
          >
            {/* PATRÓN TEXTIL */}

            <div
              className="absolute left-0 right-0 top-0 h-2"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    #c94a20 0px,
                    #c94a20 8px,
                    #e8a33d 8px,
                    #e8a33d 16px,
                    #2f8f5b 16px,
                    #2f8f5b 24px,
                    #087f83 24px,
                    #087f83 32px
                  )
                `,
              }}
            />

            {/* MANIJA */}

            <div className="mt-2 h-1.5 w-11 rounded-full bg-[#9a8065]/30" />

            {/* ALERTA */}

            <div className="flex items-center gap-2 rounded-full border border-[#f1c7b8] bg-[#fff0eb] px-3.5 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c1272d] shadow-[0_0_10px_rgba(193,39,45,0.5)]" />

              <span className="text-[12px] font-black uppercase tracking-wide text-[#c1272d]">
                {t("alertTitle")}
              </span>
            </div>

            {/* TÍTULO */}

            <h2 className="max-w-[310px] text-center text-[25px] font-black leading-tight text-[#263a32]">
              {t("alertDetected")}
            </h2>

            {/* DESCRIPCIÓN */}

            <p className="max-w-[310px] text-center text-[14px] leading-relaxed text-[#6b5842]">
              {t("alertConfirm")}
            </p>

            {/* CUENTA REGRESIVA */}

            <div className="flex items-center justify-center py-1">
              <CountdownRing
                totalSeconds={totalSeconds}
                remainingSeconds={
                  remainingSeconds
                }
              />
            </div>

            {/* CONTACTOS */}

            <div className="flex w-full items-start gap-3 rounded-[18px] border border-[#efc8bc] bg-[#fff0eb] p-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#c1272d] shadow-sm">
                <IconSend size={17} />
              </div>

              <p className="text-[12px] font-semibold leading-relaxed text-[#4a3830]">
                {t("alertWillNotify")}{" "}
                <span className="font-black">
                  {contacts.length > 0
                    ? contacts.join(" y ")
                    : t("contacts")}
                </span>{" "}
                {t("alertByTelegram")}
              </p>
            </div>

            {/* BOTÓN CANCELAR */}

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
                rounded-[20px]
                bg-[#087f83]
                text-white
                shadow-[0_9px_24px_rgba(8,127,131,0.28)]
                transition-all
                duration-200
                hover:bg-[#076f74]
                active:scale-[0.98]
              "
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <IconCheck size={23} />
              </span>

              <span className="text-[18px] font-black">
                {t("alertCancel")}
              </span>
            </button>

            {/* NOTA */}

            <p className="max-w-[290px] text-center text-[11px] leading-relaxed text-[#9a8065]">
              {t("alertCannotClose")}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
