"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  IconHouse,
  IconScanFace,
  IconTrendingUp,
  IconUsers,
  IconSettings,
  IconActivity,
} from "./icons";

type Language = "es" | "qch";

const tabs = [
  {
    href: "/",
    es: "Inicio",
    qch: "Qallariy",
    Icon: IconHouse,
  },
  {
    href: "/chequeo",
    es: "Chequeo",
    qch: "Rikapay",
    Icon: IconScanFace,
  },
  {
    href: "/historial",
    es: "Historial",
    qch: "Ñawpaq willakuy",
    Icon: IconTrendingUp,
  },
  {
    href: "/contactos",
    es: "Contactos",
    qch: "Tinkiqkuna",
    Icon: IconUsers,
  },
  {
    href: "/ajustes",
    es: "Ajustes",
    qch: "Allichay",
    Icon: IconSettings,
  },
] as const;

const dashboardRoutes = ["/", "/alerta-enviada", "/desconectado"];

export default function TabBar() {
  const pathname = usePathname();

  const [language, setLanguage] = useState<Language>("es");

  /*
   * Recuperamos el idioma guardado.
   */
  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(
      "neurowatch-language"
    ) as Language | null;

    if (savedLanguage === "es" || savedLanguage === "qch") {
      setLanguage(savedLanguage);
    }
  }, []);

  /*
   * Cambiar idioma.
   */
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    window.localStorage.setItem(
      "neurowatch-language",
      newLanguage
    );

    /*
     * Avisamos a las demás páginas/componentes
     * que cambió el idioma.
     */
    window.dispatchEvent(
      new CustomEvent("neurowatch-language-change", {
        detail: newLanguage,
      })
    );
  };

  const isHomeActive = dashboardRoutes.includes(pathname);

  const languageLabel =
    language === "es"
      ? {
          app: "Monitoreo inteligente",
          location: "ÁNCASH · PERÚ",
          footer:
            "Herramienta asistiva. No reemplaza la atención médica ni constituye un diagnóstico.",
        }
      : {
          app: "Kawsayta rikapay",
          location: "ANQASH · PIRUW",
          footer:
            "Yanapakuq sistema. Mana hampiqmi, hampiqpa yanayninta mana rantinchu.",
        };

  return (
    <>
      {/* ===================================================== */}
      {/* MOBILE */}
      {/* ===================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">

        <div className="relative overflow-hidden border-t border-white/70 bg-white/80 shadow-[0_-12px_40px_rgba(30,41,59,0.15)] backdrop-blur-2xl">

          {/* Línea andina */}
          <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-cyan-400 to-purple-600" />

          {/* Decoración */}
          <div className="pointer-events-none absolute -left-10 -top-16 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="pointer-events-none absolute -right-10 -top-16 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-2xl" />

          <div
            className="relative flex items-center justify-between"
            style={{
              padding: "10px 12px 14px",
            }}
          >
            {tabs.map(
              ({ href, es, qch, Icon }) => {

                const active =
                  href === "/"
                    ? isHomeActive
                    : pathname.startsWith(href);

                const label =
                  language === "es" ? es : qch;

                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex w-full min-w-0 flex-col items-center justify-center gap-1"
                  >

                    {/* Botón activo */}
                    <div
                      className={`relative flex h-11 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                        active
                          ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-300/50 -translate-y-1"
                          : "text-slate-400"
                      }`}
                    >

                      {active && (
                        <span className="absolute inset-0 rounded-2xl bg-white/10" />
                      )}

                      <Icon
                        size={22}
                      />

                      {active && (
                        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
                      )}

                    </div>

                    <span
                      className={`max-w-[70px] truncate text-center text-[9px] leading-none ${
                        active
                          ? "font-black text-indigo-600"
                          : "font-semibold text-slate-400"
                      }`}
                    >
                      {label}
                    </span>

                  </Link>
                );
              }
            )}
          </div>

          {/* Selector de idioma */}
          <div className="flex items-center justify-center gap-2 pb-2">

            <button
              onClick={() => changeLanguage("es")}
              className={`rounded-full px-3 py-1 text-[9px] font-black transition ${
                language === "es"
                  ? "bg-red-500 text-white shadow-md shadow-red-200"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              🇵🇪 ES
            </button>

            <button
              onClick={() => changeLanguage("qch")}
              className={`rounded-full px-3 py-1 text-[9px] font-black transition ${
                language === "qch"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              🏔️ QCH
            </button>

          </div>

        </div>
      </nav>

      {/* ===================================================== */}
      {/* DESKTOP */}
      {/* ===================================================== */}

      <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-[270px] flex-col overflow-hidden border-r border-white/70 bg-white/75 shadow-[8px_0_40px_rgba(30,41,59,0.08)] backdrop-blur-2xl md:flex">

        {/* Decoraciones */}
        <div className="pointer-events-none absolute -left-24 -top-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />

        {/* ================================================= */}
        {/* LOGO */}
        {/* ================================================= */}

        <div className="relative px-6 pb-5 pt-7">

          <div className="flex items-center gap-3">

            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-300/40">

              <IconActivity size={24} />

              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />

            </div>

            <div>

              <h1 className="text-[22px] font-black tracking-tight text-slate-900">
                NeuroWatch
              </h1>

              <p className="text-[10px] font-bold text-slate-400">
                {languageLabel.app}
              </p>

            </div>

          </div>

          {/* Identidad */}
          <div className="mt-5 overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-white to-cyan-50 p-3">

            <div className="flex items-center gap-2">

              <span className="text-xl">
                🏔️
              </span>

              <div className="min-w-0">

                <p className="truncate text-[10px] font-black tracking-[0.15em] text-indigo-600">
                  {languageLabel.location}
                </p>

                <p className="mt-0.5 text-[9px] font-semibold text-slate-400">
                  Tecnología con identidad andina
                </p>

              </div>

            </div>

            <div className="mt-3 flex gap-1">

              <span className="h-1 flex-1 rounded-full bg-red-500" />
              <span className="h-1 flex-1 rounded-full bg-orange-400" />
              <span className="h-1 flex-1 rounded-full bg-yellow-400" />
              <span className="h-1 flex-1 rounded-full bg-green-500" />
              <span className="h-1 flex-1 rounded-full bg-cyan-500" />
              <span className="h-1 flex-1 rounded-full bg-purple-600" />

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* NAVEGACIÓN */}
        {/* ================================================= */}

        <nav className="relative flex flex-1 flex-col gap-2 px-4 pt-2">

          <p className="px-3 pb-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            {language === "es"
              ? "Navegación"
              : "Puriy"}
          </p>

          {tabs.map(
            ({ href, es, qch, Icon }) => {

              const active =
                href === "/"
                  ? isHomeActive
                  : pathname.startsWith(href);

              const label =
                language === "es" ? es : qch;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-200"
                      : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                  }`}
                >

                  {active && (
                    <span className="absolute right-0 top-0 h-full w-1 bg-yellow-300" />
                  )}

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-white/15"
                        : "bg-slate-100 group-hover:bg-indigo-50"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <span className="text-[14px] font-bold">
                    {label}
                  </span>

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
                  )}

                </Link>
              );
            }
          )}

        </nav>

        {/* ================================================= */}
        {/* IDIOMA */}
        {/* ================================================= */}

        <div className="relative px-5 pb-4">

          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
            {language === "es"
              ? "Idioma"
              : "Rimay"}
          </p>

          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() => changeLanguage("es")}
              className={`rounded-xl px-3 py-2.5 text-[10px] font-black transition-all ${
                language === "es"
                  ? "bg-red-500 text-white shadow-lg shadow-red-200"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              }`}
            >
              🇵🇪 Español
            </button>

            <button
              onClick={() => changeLanguage("qch")}
              className={`rounded-xl px-3 py-2.5 text-[10px] font-black transition-all ${
                language === "qch"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              }`}
            >
              🏔️ Quechua
            </button>

          </div>

        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="relative px-6 pb-5">

          <div className="mb-3 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

          <p className="text-[9px] font-semibold leading-relaxed text-slate-400">
            {languageLabel.footer}
          </p>

          <p className="mt-2 text-center text-[9px] font-black text-indigo-300">
            🏔️ ÁNCASH · PERÚ 🇵🇪
          </p>

        </div>

      </aside>
    </>
  );
}
