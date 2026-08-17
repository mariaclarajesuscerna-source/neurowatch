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

import { useLanguage } from "@/components/LanguageProvider";

const tabs = [
  {
    href: "/",
    es: "Inicio",
    qu: "Qallariy",
    Icon: IconHouse,
    emoji: "🏠",
    iconBg: "bg-[#e8f3ef]",
    iconActive: "bg-[#d8eee7]",
    accent: "#087f83",
  },
  {
    href: "/chequeo",
    es: "Chequeo",
    qu: "Qhawariy",
    Icon: IconScanFace,
    emoji: "🧠",
    iconBg: "bg-[#f9e7df]",
    iconActive: "bg-[#f6d8cb]",
    accent: "#c1440c",
  },
  {
    href: "/historial",
    es: "Historial",
    qu: "Ñawpaq qhawariykuna",
    Icon: IconTrendingUp,
    emoji: "📊",
    iconBg: "bg-[#f8edd6]",
    iconActive: "bg-[#f4e2b9]",
    accent: "#c98a21",
  },
  {
    href: "/contactos",
    es: "Contactos",
    qu: "Tinkiqkuna",
    Icon: IconUsers,
    emoji: "👥",
    iconBg: "bg-[#e6edf4]",
    iconActive: "bg-[#d7e3ef]",
    accent: "#426b8f",
  },
  {
    href: "/ajustes",
    es: "Ajustes",
    qu: "Rurayninkuna",
    Icon: IconSettings,
    emoji: "⚙️",
    iconBg: "bg-[#eee8f3]",
    iconActive: "bg-[#e4d9ed]",
    accent: "#70508b",
  },
] as const;

const dashboardRoutes = [
  "/",
  "/alerta-enviada",
  "/desconectado",
];

export default function TabBar() {
  const pathname = usePathname();
  const { language } = useLanguage();

  const isHomeActive =
    dashboardRoutes.includes(pathname);

  return (
    <>
      {/* =====================================================
          MOBILE
      ====================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 md:hidden">
        <div
          className="
            mx-auto
            flex
            max-w-xl
            items-center
            gap-1.5
            rounded-[30px]
            border
            border-[#e4c99e]
            bg-[#fff9ed]/95
            px-2
            py-2.5
            shadow-[0_14px_40px_rgba(72,48,25,0.16)]
            backdrop-blur-2xl
          "
        >
          {tabs.map(
            ({
              href,
              es,
              qu,
              Icon,
              emoji,
              iconBg,
              iconActive,
              accent,
            }) => {
              const active =
                href === "/"
                  ? isHomeActive
                  : pathname.startsWith(href);

              const label =
                language === "qu"
                  ? qu
                  : es;

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className="
                    group
                    relative
                    flex
                    min-w-0
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    rounded-[22px]
                    px-1
                    py-2
                    transition-all
                    duration-200
                    active:scale-[0.94]
                  "
                >
                  {/* FONDO DEL BOTÓN */}

                  <div
                    className={`
                      absolute
                      inset-x-1
                      inset-y-0.5
                      rounded-[22px]
                      transition-all
                      duration-300
                      ${
                        active
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    `}
                    style={{
                      background: active
                        ? `${accent}12`
                        : "#f7efe0",
                    }}
                  />

                  {/* INDICADOR SUPERIOR */}

                  {active && (
                    <div
                      className="absolute top-1 h-1 w-8 rounded-full"
                      style={{
                        backgroundColor:
                          accent,
                      }}
                    />
                  )}

                  {/* ICONO / BOLITA */}

                  <div
                    className={`
                      relative
                      z-10
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-[18px]
                      border
                      transition-all
                      duration-300
                      ${
                        active
                          ? `${iconActive} shadow-[0_7px_16px_rgba(72,48,25,0.12)]`
                          : `${iconBg} border-white/70 group-hover:scale-105`
                      }
                    `}
                    style={{
                      borderColor: active
                        ? `${accent}40`
                        : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {/* CÍRCULO INTERIOR */}

                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          active
                            ? "bg-white/75"
                            : "bg-white/60"
                        }
                      `}
                    >
                      <Icon
                        size={20}
                        className={
                          active
                            ? undefined
                            : "opacity-75"
                        }
                      />
                    </div>
                  </div>

                  {/* TEXTO */}

                  <span
                    className={`
                      relative
                      z-10
                      mt-1.5
                      max-w-full
                      truncate
                      px-0.5
                      text-center
                      text-[9px]
                      leading-tight
                      transition-all
                      ${
                        active
                          ? "font-black"
                          : "font-bold text-[#6b5842]"
                      }
                    `}
                    style={{
                      color: active
                        ? accent
                        : undefined,
                    }}
                  >
                    {label}
                  </span>

                  {/* MINI EMOJI */}

                  <span
                    className={`
                      relative
                      z-10
                      mt-0.5
                      text-[8px]
                      transition-all
                      ${
                        active
                          ? "opacity-100"
                          : "opacity-50"
                      }
                    `}
                  >
                    {emoji}
                  </span>
                </Link>
              );
            }
          )}
        </div>
      </nav>

      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <aside
        className="
          fixed
          bottom-0
          left-0
          top-0
          z-50
          hidden
          w-64
          flex-col
          border-r
          border-[#dfc49a]
          bg-[#fff9ed]/95
          shadow-[8px_0_35px_rgba(72,48,25,0.10)]
          backdrop-blur-2xl
          md:flex
        "
      >
        {/* LOGO */}

        <div className="px-5 pb-5 pt-6">
          <div
            className="
              overflow-hidden
              rounded-[24px]
              border
              border-[#dfc49a]
              bg-[#fff4df]
              shadow-[0_8px_25px_rgba(72,48,25,0.08)]
            "
          >
            {/* PATRÓN TEXTIL */}

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
                    #2f8f5b 16px,
                    #2f8f5b 24px,
                    #087f83 24px,
                    #087f83 32px
                  )
                `,
              }}
            />

            <div className="flex items-center gap-3 p-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-[17px]
                  border
                  border-white/60
                  bg-[#dceee8]
                  text-[#087f83]
                  shadow-[0_7px_18px_rgba(8,127,131,0.15)]
                "
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70">
                  <IconActivity size={21} />
                </div>
              </div>

              <div className="min-w-0">
                <span className="block text-[20px] font-black leading-tight text-[#075d63]">
                  NeuroWatch
                </span>

                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#c1440c]">
                  Huaraz · Áncash
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTONES */}

        <nav className="flex flex-1 flex-col gap-2.5 px-4">
          {tabs.map(
            ({
              href,
              es,
              qu,
              Icon,
              emoji,
              iconBg,
              iconActive,
              accent,
            }) => {
              const active =
                href === "/"
                  ? isHomeActive
                  : pathname.startsWith(href);

              const label =
                language === "qu"
                  ? qu
                  : es;

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={`
                    group
                    relative
                    flex
                    items-center
                    gap-3
                    overflow-hidden
                    rounded-[22px]
                    border
                    px-3
                    py-3
                    transition-all
                    duration-300
                    active:scale-[0.98]
                    ${
                      active
                        ? "bg-white shadow-[0_8px_24px_rgba(72,48,25,0.10)]"
                        : "border-transparent hover:bg-[#f7efe0]"
                    }
                  `}
                  style={{
                    borderColor: active
                      ? `${accent}45`
                      : "transparent",
                  }}
                >
                  {/* LÍNEA LATERAL */}

                  <span
                    className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full"
                    style={{
                      backgroundColor:
                        active
                          ? accent
                          : "transparent",
                    }}
                  />

                  {/* ICONO PRINCIPAL */}

                  <div
                    className={`
                      relative
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-[17px]
                      border
                      transition-all
                      duration-300
                      ${
                        active
                          ? iconActive
                          : iconBg
                      }
                      ${
                        !active
                          ? "group-hover:scale-105"
                          : ""
                      }
                    `}
                    style={{
                      borderColor: active
                        ? `${accent}35`
                        : "rgba(255,255,255,0.7)",
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/65">
                      <Icon
                        size={21}
                      />
                    </div>
                  </div>

                  {/* TEXTO */}

                  <div className="min-w-0 flex-1">
                    <span
                      className={`
                        block
                        truncate
                        text-[14px]
                        ${
                          active
                            ? "font-black"
                            : "font-bold text-[#3b2a1a]"
                        }
                      `}
                      style={{
                        color: active
                          ? accent
                          : undefined,
                      }}
                    >
                      {label}
                    </span>

                    <span className="mt-0.5 block text-[10px] text-[#9a8065]">
                      {emoji}
                    </span>
                  </div>

                  {/* ESTADO */}

                  {active && (
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{
                        backgroundColor:
                          `${accent}12`,
                      }}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            accent,
                          boxShadow: `0 0 10px ${accent}55`,
                        }}
                      />
                    </div>
                  )}
                </Link>
              );
            }
          )}
        </nav>

        {/* AVISO */}

        <div className="px-5 pb-6">
          <div
            className="
              overflow-hidden
              rounded-[20px]
              border
              border-[#dfc49a]
              bg-[#f7efe0]
            "
          >
            <div
              className="h-1.5"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    #c94a20 0px,
                    #c94a20 7px,
                    #e8a33d 7px,
                    #e8a33d 14px,
                    #087f83 14px,
                    #087f83 21px
                  )
                `,
              }}
            />

            <p className="p-3 text-[9px] font-medium leading-relaxed text-[#78634c]">
              {language === "qu"
                ? "NeuroWatch yanapakuymi. Mana hampiqpa yanapayninta rantinchu."
                : "NeuroWatch es una herramienta asistiva. No reemplaza la atención médica."}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}"use client";

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

import { useLanguage } from "@/components/LanguageProvider";

const tabs = [
  {
    href: "/",
    es: "Inicio",
    qu: "Qallariy",
    Icon: IconHouse,
    emoji: "🏠",
    iconBg: "bg-[#e8f3ef]",
    iconActive: "bg-[#d8eee7]",
    accent: "#087f83",
  },
  {
    href: "/chequeo",
    es: "Chequeo",
    qu: "Qhawariy",
    Icon: IconScanFace,
    emoji: "🧠",
    iconBg: "bg-[#f9e7df]",
    iconActive: "bg-[#f6d8cb]",
    accent: "#c1440c",
  },
  {
    href: "/historial",
    es: "Historial",
    qu: "Ñawpaq qhawariykuna",
    Icon: IconTrendingUp,
    emoji: "📊",
    iconBg: "bg-[#f8edd6]",
    iconActive: "bg-[#f4e2b9]",
    accent: "#c98a21",
  },
  {
    href: "/contactos",
    es: "Contactos",
    qu: "Tinkiqkuna",
    Icon: IconUsers,
    emoji: "👥",
    iconBg: "bg-[#e6edf4]",
    iconActive: "bg-[#d7e3ef]",
    accent: "#426b8f",
  },
  {
    href: "/ajustes",
    es: "Ajustes",
    qu: "Rurayninkuna",
    Icon: IconSettings,
    emoji: "⚙️",
    iconBg: "bg-[#eee8f3]",
    iconActive: "bg-[#e4d9ed]",
    accent: "#70508b",
  },
] as const;

const dashboardRoutes = [
  "/",
  "/alerta-enviada",
  "/desconectado",
];

export default function TabBar() {
  const pathname = usePathname();
  const { language } = useLanguage();

  const isHomeActive =
    dashboardRoutes.includes(pathname);

  return (
    <>
      {/* =====================================================
          MOBILE
      ====================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 md:hidden">
        <div
          className="
            mx-auto
            flex
            max-w-xl
            items-center
            gap-1.5
            rounded-[30px]
            border
            border-[#e4c99e]
            bg-[#fff9ed]/95
            px-2
            py-2.5
            shadow-[0_14px_40px_rgba(72,48,25,0.16)]
            backdrop-blur-2xl
          "
        >
          {tabs.map(
            ({
              href,
              es,
              qu,
              Icon,
              emoji,
              iconBg,
              iconActive,
              accent,
            }) => {
              const active =
                href === "/"
                  ? isHomeActive
                  : pathname.startsWith(href);

              const label =
                language === "qu"
                  ? qu
                  : es;

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className="
                    group
                    relative
                    flex
                    min-w-0
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    rounded-[22px]
                    px-1
                    py-2
                    transition-all
                    duration-200
                    active:scale-[0.94]
                  "
                >
                  {/* FONDO DEL BOTÓN */}

                  <div
                    className={`
                      absolute
                      inset-x-1
                      inset-y-0.5
                      rounded-[22px]
                      transition-all
                      duration-300
                      ${
                        active
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    `}
                    style={{
                      background: active
                        ? `${accent}12`
                        : "#f7efe0",
                    }}
                  />

                  {/* INDICADOR SUPERIOR */}

                  {active && (
                    <div
                      className="absolute top-1 h-1 w-8 rounded-full"
                      style={{
                        backgroundColor:
                          accent,
                      }}
                    />
                  )}

                  {/* ICONO / BOLITA */}

                  <div
                    className={`
                      relative
                      z-10
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-[18px]
                      border
                      transition-all
                      duration-300
                      ${
                        active
                          ? `${iconActive} shadow-[0_7px_16px_rgba(72,48,25,0.12)]`
                          : `${iconBg} border-white/70 group-hover:scale-105`
                      }
                    `}
                    style={{
                      borderColor: active
                        ? `${accent}40`
                        : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {/* CÍRCULO INTERIOR */}

                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          active
                            ? "bg-white/75"
                            : "bg-white/60"
                        }
                      `}
                    >
                      <Icon
                        size={20}
                        className={
                          active
                            ? undefined
                            : "opacity-75"
                        }
                      />
                    </div>
                  </div>

                  {/* TEXTO */}

                  <span
                    className={`
                      relative
                      z-10
                      mt-1.5
                      max-w-full
                      truncate
                      px-0.5
                      text-center
                      text-[9px]
                      leading-tight
                      transition-all
                      ${
                        active
                          ? "font-black"
                          : "font-bold text-[#6b5842]"
                      }
                    `}
                    style={{
                      color: active
                        ? accent
                        : undefined,
                    }}
                  >
                    {label}
                  </span>

                  {/* MINI EMOJI */}

                  <span
                    className={`
                      relative
                      z-10
                      mt-0.5
                      text-[8px]
                      transition-all
                      ${
                        active
                          ? "opacity-100"
                          : "opacity-50"
                      }
                    `}
                  >
                    {emoji}
                  </span>
                </Link>
              );
            }
          )}
        </div>
      </nav>

      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <aside
        className="
          fixed
          bottom-0
          left-0
          top-0
          z-50
          hidden
          w-64
          flex-col
          border-r
          border-[#dfc49a]
          bg-[#fff9ed]/95
          shadow-[8px_0_35px_rgba(72,48,25,0.10)]
          backdrop-blur-2xl
          md:flex
        "
      >
        {/* LOGO */}

        <div className="px-5 pb-5 pt-6">
          <div
            className="
              overflow-hidden
              rounded-[24px]
              border
              border-[#dfc49a]
              bg-[#fff4df]
              shadow-[0_8px_25px_rgba(72,48,25,0.08)]
            "
          >
            {/* PATRÓN TEXTIL */}

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
                    #2f8f5b 16px,
                    #2f8f5b 24px,
                    #087f83 24px,
                    #087f83 32px
                  )
                `,
              }}
            />

            <div className="flex items-center gap-3 p-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-[17px]
                  border
                  border-white/60
                  bg-[#dceee8]
                  text-[#087f83]
                  shadow-[0_7px_18px_rgba(8,127,131,0.15)]
                "
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70">
                  <IconActivity size={21} />
                </div>
              </div>

              <div className="min-w-0">
                <span className="block text-[20px] font-black leading-tight text-[#075d63]">
                  NeuroWatch
                </span>

                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#c1440c]">
                  Huaraz · Áncash
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTONES */}

        <nav className="flex flex-1 flex-col gap-2.5 px-4">
          {tabs.map(
            ({
              href,
              es,
              qu,
              Icon,
              emoji,
              iconBg,
              iconActive,
              accent,
            }) => {
              const active =
                href === "/"
                  ? isHomeActive
                  : pathname.startsWith(href);

              const label =
                language === "qu"
                  ? qu
                  : es;

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={`
                    group
                    relative
                    flex
                    items-center
                    gap-3
                    overflow-hidden
                    rounded-[22px]
                    border
                    px-3
                    py-3
                    transition-all
                    duration-300
                    active:scale-[0.98]
                    ${
                      active
                        ? "bg-white shadow-[0_8px_24px_rgba(72,48,25,0.10)]"
                        : "border-transparent hover:bg-[#f7efe0]"
                    }
                  `}
                  style={{
                    borderColor: active
                      ? `${accent}45`
                      : "transparent",
                  }}
                >
                  {/* LÍNEA LATERAL */}

                  <span
                    className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full"
                    style={{
                      backgroundColor:
                        active
                          ? accent
                          : "transparent",
                    }}
                  />

                  {/* ICONO PRINCIPAL */}

                  <div
                    className={`
                      relative
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-[17px]
                      border
                      transition-all
                      duration-300
                      ${
                        active
                          ? iconActive
                          : iconBg
                      }
                      ${
                        !active
                          ? "group-hover:scale-105"
                          : ""
                      }
                    `}
                    style={{
                      borderColor: active
                        ? `${accent}35`
                        : "rgba(255,255,255,0.7)",
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/65">
                      <Icon
                        size={21}
                      />
                    </div>
                  </div>

                  {/* TEXTO */}

                  <div className="min-w-0 flex-1">
                    <span
                      className={`
                        block
                        truncate
                        text-[14px]
                        ${
                          active
                            ? "font-black"
                            : "font-bold text-[#3b2a1a]"
                        }
                      `}
                      style={{
                        color: active
                          ? accent
                          : undefined,
                      }}
                    >
                      {label}
                    </span>

                    <span className="mt-0.5 block text-[10px] text-[#9a8065]">
                      {emoji}
                    </span>
                  </div>

                  {/* ESTADO */}

                  {active && (
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{
                        backgroundColor:
                          `${accent}12`,
                      }}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            accent,
                          boxShadow: `0 0 10px ${accent}55`,
                        }}
                      />
                    </div>
                  )}
                </Link>
              );
            }
          )}
        </nav>

        {/* AVISO */}

        <div className="px-5 pb-6">
          <div
            className="
              overflow-hidden
              rounded-[20px]
              border
              border-[#dfc49a]
              bg-[#f7efe0]
            "
          >
            <div
              className="h-1.5"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    #c94a20 0px,
                    #c94a20 7px,
                    #e8a33d 7px,
                    #e8a33d 14px,
                    #087f83 14px,
                    #087f83 21px
                  )
                `,
              }}
            />

            <p className="p-3 text-[9px] font-medium leading-relaxed text-[#78634c]">
              {language === "qu"
                ? "NeuroWatch yanapakuymi. Mana hampiqpa yanapayninta rantinchu."
                : "NeuroWatch es una herramienta asistiva. No reemplaza la atención médica."}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
