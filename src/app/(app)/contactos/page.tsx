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
import StatusChip from "@/components/ui/StatusChip";
import { useNeurowatch } from "@/components/NeurowatchProvider";

export default function ContactosPage() {
  const { contacts, saveContact, deleteContact } = useNeurowatch();
  const [newContact, setNewContact] = useState({
    name: "",
    relation: "",
    telegram: "",
  });

  const handleAdd = () => {
    if (newContact.name.trim() && newContact.telegram.trim()) {
      saveContact({
        name: newContact.name.trim(),
        relation: newContact.relation.trim(),
        telegramChatId: newContact.telegram.trim(),
      });
      setNewContact({ name: "", relation: "", telegram: "" });
    }
  };

  return (
    <div className="flex flex-col gap-4 px-5 pt-3.5 md:pt-6 md:max-w-lg md:mx-auto">
      {/* Status Bar — mobile only */}
      <div className="flex items-center justify-between px-1 md:hidden">
        <span className="text-[15px] font-semibold text-ink-900">
          {new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <div className="flex items-center gap-1.5 text-ink-900">
          <IconSignal size={16} />
          <IconWifi size={16} />
          <IconBatteryFull size={16} />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="h-[34px] w-[34px] rounded-[11px] bg-brand-600 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.25)] text-white">
          <IconActivity size={20} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[22px] font-bold text-ink-900 leading-tight">
            Neurowatch
          </span>
          <span className="text-[13px] font-normal text-ink-600 leading-tight">
            Contactos de emergencia
          </span>
        </div>
      </div>

      {contacts.length > 0 && (
        <GlassCard className="flex flex-col gap-1 p-2">
          {contacts.map((c, i) => (
            <div key={c.telegramChatId}>
              {i > 0 && <div className="h-px bg-glass-border mx-2" />}
              <div className="flex items-center gap-3 p-2">
                <div className="h-11 w-11 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-600">
                  <IconUser size={20} />
                </div>
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-[15px] font-bold text-ink-900">
                    {c.name}
                  </span>
                  <span className="text-[13px] font-normal text-ink-600">
                    {c.relation}
                  </span>
                </div>
                <button
                  onClick={() => deleteContact(c.telegramChatId)}
                  className="text-[11px] font-medium text-alert hover:underline shrink-0"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </GlassCard>
      )}

      <button className="flex items-center justify-center gap-2 py-3.5 rounded-[14px] bg-brand-100 text-brand-600">
        <IconUserPlus size={18} />
        <span className="text-[15px] font-semibold">Agregar contacto</span>
      </button>

      <GlassCard className="flex flex-col gap-3.5 p-4">
        <span className="text-sm font-semibold text-ink-900">
          Nuevo contacto
        </span>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-normal text-ink-600">Nombre</label>
          <input
            type="text"
            value={newContact.name}
            onChange={(e) =>
              setNewContact({ ...newContact, name: e.target.value })
            }
            placeholder="Ej. Maria Lopez"
            className="h-11 bg-white rounded-[10px] border border-glass-border px-3 text-[13px] font-normal text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-normal text-ink-600">Relacion</label>
          <input
            type="text"
            value={newContact.relation}
            onChange={(e) =>
              setNewContact({ ...newContact, relation: e.target.value })
            }
            placeholder="Ej. Hija, Medico, Vecino"
            className="h-11 bg-white rounded-[10px] border border-glass-border px-3 text-[13px] font-normal text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-normal text-ink-600">
            Usuario de Telegram
          </label>
          <input
            type="text"
            value={newContact.telegram}
            onChange={(e) =>
              setNewContact({ ...newContact, telegram: e.target.value })
            }
            placeholder="@usuario"
            className="h-11 bg-white rounded-[10px] border border-glass-border px-3 text-[13px] font-normal text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-500"
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={!newContact.name.trim() || !newContact.telegram.trim()}
          className="flex items-center justify-center gap-2 h-[52px] rounded-[14px] bg-brand-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <IconSend size={18} />
          <span className="text-[15px] font-semibold">
            Vincular con Telegram
          </span>
        </button>
      </GlassCard>
    </div>
  );
}
