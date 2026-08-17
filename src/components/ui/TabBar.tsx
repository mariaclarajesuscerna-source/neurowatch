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
    color: "#087f83",
    soft: "#e4f1ed",
  },
  {
    href: "/chequeo",
    es: "Chequeo",
    qu: "Qhawariy",
    Icon: IconScanFace,
    emoji: "🧠",
    color: "#c1440c",
    soft: "#f8e6de",
  },
  {
    href: "/historial",
    es: "Historial",
    qu: "Ñawpaq qhawariykuna",
    Icon: IconTrendingUp,
    emoji: "📊",
    color: "#b67a18",
    soft: "#f8efd9",
  },
  {
    href: "/contactos",
    es: "Contactos",
    qu: "Tinkiqkuna",
    Icon: IconUsers,
    emoji: "👥",
    color: "#426b8f",
    soft: "#e7edf3",
  },
  {
    href: "/ajustes",
    es: "Ajustes",
    qu: "Rurayninkuna",
    Icon: IconSettings,
    emoji: "⚙️",
    color: "#73518e",
    soft: "#eee8f3",
  },
] as const;

const dashboardRoutes = [
  "/",
  "/alerta-enviada",
  "/desconectado",
];

const textilePattern = `
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
`;

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
            gap-1
            rounded-[30px]
            border
            border-[#e4c99e]
            bg-[#fff9ed]/95
            p-2
            shadow-[0_14px_40px_rgba(72,48,25,0.15)]
            backdrop-blur-2xl
          "
        >
          {tabs.map((tab) => {
            const active =
              tab.href === "/"
                ? isHomeActive
                : pathname.startsWith(tab.href);

            const label =
              language === "qu"
                ? tab.qu
                : tab.es;

            const Icon = tab.Icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={
                  active ? "page" : undefined
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
                  active:scale-95
                "
              >
                {/* Fondo suave */}

                <span
                  className={`
                    absolute
                    inset-0
                    rounded-[22px]
                    transition-all
                    ${
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }
                  `}
                  style={{
                    backgroundColor:
                      active
                        ? tab.soft
                        : "#f7efe0",
                  }}
                />

                {/* Indicador superior */}

                {active && (
                  <span
                    className="absolute top-1 h-1 w-8 rounded-full"
                    style={{
                      backgroundColor:
                        tab.color,
                    }}
                  />
                )}

                {/* Bolita / icono */}

                <span
                  className="
                    relative
                    z-10
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-[18px]
                    border
                    bg-white/80
                    shadow-sm
                    transition-all
                    duration-200
                    group-hover:scale-105
                  "
                  style={{
                    borderColor: `${tab.color}35`,
                    boxShadow: active
                      ? `0 7px 18px ${tab.color}25`
                      : undefined,
                  }}
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        active
                          ? `${tab.color}12`
                          : "#f7efe0",
                    }}
                  >
                    <Icon size={20} />
                  </span>
                </span>

                {/* Texto */}

                <span
                  className="
                    relative
                    z-10
                    mt-1.5
                    max-w-full
                    truncate
                    text-center
                    text-[9px]
                    leading-tight
                  "
                  style={{
                    color: active
                      ? tab.color
                      : "#6b5842",
                    fontWeight: active
                      ? 800
                      : 700,
                  }}
                >
                  {label}
                </span>

                {/* Emoji */}

                <span
                  className="
                    relative
                    z-10
                    mt-0.5
                    text-[8px]
                  "
                >
                  {tab.emoji}
                </span>
              </Link>
            );
          })}
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
            <div
              className="h-2"
              style={{
                backgroundImage:
                  textilePattern,
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
                  border-white/70
                  bg-[#e4f1ed]
                  text-[#087f83]
                "
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80">
                  <IconActivity size={20} />
                </span>
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
          {tabs.map((tab) => {
            const active =
              tab.href === "/"
                ? isHomeActive
                : pathname.startsWith(tab.href);

            const label =
              language === "qu"
                ? tab.qu
                : tab.es;

            const Icon = tab.Icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={
                  active ? "page" : undefined
                }
                className="
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
                  duration-200
                  active:scale-[0.98]
                "
                style={{
                  backgroundColor: active
                    ? "#ffffff"
                    : "transparent",
                  borderColor: active
                    ? `${tab.color}35`
                    : "transparent",
                  boxShadow: active
                    ? `0 8px 24px ${tab.color}18`
                    : undefined,
                }}
              >
                {/* Línea lateral */}

                <span
                  className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full"
                  style={{
                    backgroundColor:
                      active
                        ? tab.color
                        : "transparent",
                  }}
                />

                {/* Bolita */}

                <span
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-[17px]
                    border
                    bg-white
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  "
                  style={{
                    backgroundColor:
                      active
                        ? tab.soft
                        : "#f7efe0",
                    borderColor:
                      `${tab.color}25`,
                  }}
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-white/80
                    "
                  >
                    <Icon size={21} />
                  </span>
                </span>

                {/* Texto */}

                <span className="min-w-0 flex-1">
                  <span
                    className="
                      block
                      truncate
                      text-[14px]
                    "
                    style={{
                      color: active
                        ? tab.color
                        : "#3b2a1a",
                      fontWeight: active
                        ? 800
                        : 700,
                    }}
                  >
                    {label}
                  </span>

                  <span className="mt-0.5 block text-[10px] text-[#9a8065]">
                    {tab.emoji}
                  </span>
                </span>

                {/* Punto activo */}

                {active && (
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        `${tab.color}12`,
                    }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          tab.color,
                        boxShadow:
                          `0 0 10px ${tab.color}60`,
                      }}
                    />
                  </span>
                )}
              </Link>
            );
          })}
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
                backgroundImage:
                  textilePattern,
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
