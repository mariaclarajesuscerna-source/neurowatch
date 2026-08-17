"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHouse,
  IconScanFace,
  IconTrendingUp,
  IconUsers,
  IconSettings,
  IconActivity,
} from "./icons";

const tabs = [
  { href: "/", label: "Inicio", Icon: IconHouse },
  { href: "/chequeo", label: "Chequeo", Icon: IconScanFace },
  { href: "/historial", label: "Historial", Icon: IconTrendingUp },
  { href: "/contactos", label: "Contactos", Icon: IconUsers },
  { href: "/ajustes", label: "Ajustes", Icon: IconSettings },
] as const;

const dashboardRoutes = ["/", "/alerta-enviada", "/desconectado"];

export default function TabBar() {
  const pathname = usePathname();

  const isHomeActive = dashboardRoutes.includes(pathname);

  return (
    <>
      {/* Mobile: fixed bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div
          className="h-21 flex items-start justify-between bg-white/55 backdrop-blur-xl border-t border-white/70"
          style={{
            padding: "12px 24px 26px 24px",
            boxShadow: "0 -4px 24px rgba(31, 41, 55, 0.08)",
          }}
        >
          {tabs.map(({ href, label, Icon }) => {
            const active =
              href === "/"
                ? isHomeActive
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-[5px] w-full min-w-0"
              >
                <Icon size={24} />
                <span
                  className={`text-[11px] leading-none ${
                    active
                      ? "font-semibold text-brand-600"
                      : "font-medium text-ink-400"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: fixed left sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-64 flex-col bg-white/55 backdrop-blur-xl border-r border-white/70">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="h-[34px] w-[34px] rounded-[11px] bg-brand-600 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.25)] text-white">
            <IconActivity size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[22px] font-bold text-ink-900 leading-tight">
              Neurowatch
            </span>
            <span className="text-[13px] font-normal text-ink-600 leading-tight">
              Monitoreo en vivo
            </span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-4 pt-2">
          {tabs.map(({ href, label, Icon }) => {
            const active =
              href === "/"
                ? isHomeActive
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active
                    ? "bg-brand-100 text-brand-600 font-semibold"
                    : "text-ink-600 font-medium hover:bg-white/50"
                }`}
              >
                <Icon size={22} />
                <span className="text-[15px]">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 pb-6">
          <p className="text-[11px] text-ink-600 leading-relaxed">
            Neurowatch es una herramienta asistiva. No reemplaza atencion medica
            ni constituye diagnostico. Ante una emergencia, llame a servicios de
            urgencia.
          </p>
        </div>
      </aside>
    </>
  );
}
