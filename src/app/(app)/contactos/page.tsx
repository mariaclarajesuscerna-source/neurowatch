"use client";

import { useState } from "react";

import {
  IconActivity,
  IconSignal,
  IconWifi,
  IconBatteryFull,
  IconUser,
  IconUserPlus,
  IconSend,
} from "@/components/ui/icons";

import GlassCard from "@/components/ui/GlassCard";
import { useNeurowatch } from "@/components/NeurowatchProvider";
import { useLanguage } from "@/components/LanguageProvider";

export default function ContactosPage() {
  const { contacts, saveContact, deleteContact } =
    useNeurowatch();

  const { t, language } = useLanguage();

  const [newContact, setNewContact] =
    useState({
      name: "",
      relation: "",
      telegram: "",
    });

  const handleAdd = () => {
    if (
      newContact.name.trim() &&
      newContact.telegram.trim()
    ) {
      saveContact({
        name: newContact.name.trim(),
        relation:
          newContact.relation.trim(),
        telegramChatId:
          newContact.telegram.trim(),
      });

      setNewContact({
        name: "",
        relation: "",
        telegram: "",
      });
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7efe0] px-4 pb-28 pt-5 md:px-8 md:pb-10">
      {/* PATRÓN */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-2">
        <div
          className="h-full"
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
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        {/* STATUS BAR */}

        <div className="mb-4 flex items-center justify-between px-1 md:hidden">
          <span className="text-[15px] font-semibold text-[#3b2a1a]">
            {new Date().toLocaleTimeString(
              "es-ES",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </span>

          <div className="flex items-center gap-1.5 text-[#075d63]">
            <IconSignal size={16} />
            <IconWifi size={16} />
            <IconBatteryFull size={16} />
          </div>
        </div>

        {/* ENCABEZADO */}

        <div className="mb-5 overflow-hidden rounded-[28px] border border-[#dfc49a] bg-[#fff9ed] shadow-[0_14px_35px_rgba(72,48,25,0.10)]">
          <div
            className="h-2"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  #c94a20 0px,
                  #c94a20 8px,
                  #e8a33d 8px,
                  #e8a33d 16px,
                  #087f83 16px,
                  #087f83 24px
                )
              `,
            }}
          />

          <div className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f8e6de] text-[#c1440c]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80">
                <IconActivity size={22} />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black uppercase text-[#075d63]">
                {t("contactsTitle")}
              </h1>

              <p className="mt-1 text-xs text-[#79634d]">
                {t("contactsSubtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* CONTACTOS */}

        {contacts.length > 0 && (
          <GlassCard className="mb-4 flex flex-col gap-1 rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-2">
            {contacts.map((c, i) => (
              <div
                key={c.telegramChatId}
              >
                {i > 0 && (
                  <div className="mx-2 h-px bg-[#ead8b8]" />
                )}

                <div className="flex items-center gap-3 rounded-2xl p-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#e7edf3] text-[#426b8f]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80">
                      <IconUser size={20} />
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15px] font-black text-[#263a32]">
                      {c.name}
                    </span>

                    <span className="text-[13px] text-[#79634d]">
                      {c.relation}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteContact(
                        c.telegramChatId
                      )
                    }
                    className="shrink-0 text-[11px] font-bold text-alert hover:underline"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            ))}
          </GlassCard>
        )}

        {/* BOTÓN AGREGAR */}

        <button
          type="button"
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#e4f1ed] py-4 text-[#087f83] shadow-sm"
        >
          <IconUserPlus size={19} />

          <span className="text-[15px] font-black">
            {t("addContact")}
          </span>
        </button>

        {/* FORMULARIO */}

        <GlassCard className="flex flex-col gap-4 rounded-[26px] border border-[#dfc49a] bg-[#fff9ed] p-5">
          <div>
            <span className="text-base font-black text-[#263a32]">
              {t("newContact")}
            </span>

            <p className="mt-1 text-xs text-[#8c7660]">
              {language === "qu"
                ? "Kaypi utqay yanapakuq runata churay."
                : "Registra a la persona que recibirá las alertas."}
            </p>
          </div>

          <label className="flex flex-col gap-1.5 text-xs font-bold text-[#6b5842]">
            {t("name")}

            <input
              type="text"
              value={newContact.name}
              onChange={(e) =>
                setNewContact({
                  ...newContact,
                  name: e.target.value,
                })
              }
              placeholder={
                language === "qu"
                  ? "Runapa sutinta churay"
                  : "Ej. María López"
              }
              className="h-11 rounded-[12px] border border-[#dfc49a] bg-white px-3 text-[13px] text-[#263a32] outline-none focus:border-[#087f83]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold text-[#6b5842]">
            {t("relation")}

            <input
              type="text"
              value={newContact.relation}
              onChange={(e) =>
                setNewContact({
                  ...newContact,
                  relation: e.target.value,
                })
              }
              placeholder={
                language === "qu"
                  ? "Panay, wawqi, hampiq..."
                  : "Ej. Hija, médico, vecino"
              }
              className="h-11 rounded-[12px] border border-[#dfc49a] bg-white px-3 text-[13px] text-[#263a32] outline-none focus:border-[#087f83]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold text-[#6b5842]">
            {language === "qu"
              ? "Telegrampa yupaynin"
              : "Usuario de Telegram"}

            <input
              type="text"
              value={newContact.telegram}
              onChange={(e) =>
                setNewContact({
                  ...newContact,
                  telegram: e.target.value,
                })
              }
              placeholder="@usuario"
              className="h-11 rounded-[12px] border border-[#dfc49a] bg-white px-3 text-[13px] text-[#263a32] outline-none focus:border-[#087f83]"
            />
          </label>

          <button
            type="button"
            onClick={handleAdd}
            disabled={
              !newContact.name.trim() ||
              !newContact.telegram.trim()
            }
            className="flex h-[52px] items-center justify-center gap-2 rounded-[16px] bg-[#087f83] text-white shadow-[0_8px_20px_rgba(8,127,131,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconSend size={18} />

            <span className="text-[15px] font-black">
              {language === "qu"
                ? "Telegramwan tinkichiy"
                : "Vincular con Telegram"}
            </span>
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
