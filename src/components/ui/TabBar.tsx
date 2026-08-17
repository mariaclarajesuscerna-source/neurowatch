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
  },
  {
    href: "/chequeo",
    es: "Chequeo",
    qu: "Qhawariy",
    Icon: IconScanFace,
    emoji: "🧠",
  },
  {
    href: "/historial",
    es: "Historial",
    qu: "Ñawpaq qhawariykuna",
    Icon: IconTrendingUp,
    emoji: "📊",
  },
  {
    href: "/contactos",
    es: "Contactos",
    qu: "Tinkiqkuna",
    Icon: IconUsers,
    emoji: "👥",
  },
  {
    href: "/ajustes",
    es: "Ajustes",
    qu: "Rurayninkuna",
    Icon: IconSettings,
    emoji: "⚙️",
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
            py-2
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
                    min-w-0
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    rounded-[22px]
                    px-1
                    py-2.5
                    transition-all
                    duration-200
                    active:scale-95
                    ${
                      active
                        ? "bg-[#087f83] text-white shadow-[0_7px_20px_rgba(8,127,131,0.28)]"
                        : "text-[#6b5842] hover:bg-[#f1e5ce]"
                    }
                  `}
                >
                  {/* MINI DECORACIÓN */}

                  {active && (
                    <span
                      className="
                        absolute
                        right-2
                        top-2
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-[#e8a33d]
                      "
                    />
                  )}

                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-[15px]
                      transition-all
                      ${
                        active
                          ? "bg-white/15"
                          : "bg-[#f7efe0] group-hover:bg-[#e8ddc5]"
                      }
                    `}
                  >
                    <Icon
                      size={21}
                    />
                  </div>

                  <span
                    className={`
                      mt-1
                      max-w-full
                      truncate
                      px-0.5
                      text-[9px]
                      leading-tight
                      ${
                        active
                          ? "font-black text-white"
                          : "font-bold text-[#6b5842]"
                      }
                    `}
                  >
                    {label}
                  </span>

                  <span
                    className={`
                      mt-0.5
                      text-[9px]
                      ${
                        active
                          ? "opacity-100"
                          : "opacity-70"
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
            {/* PATRÓN */}

            <div
              className="h-2"
              style={{
                backgroundImage:
                  `
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
                  rounded-[16px]
                  bg-[#087f83]
                  text-white
                  shadow-[0_7px_18px_rgba(8,127,131,0.25)]
                "
              >
                <IconActivity
                  size={23}
                />
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

        <nav className="flex flex-1 flex-col gap-2 px-4">
          {tabs.map(
            ({
              href,
              es,
              qu,
              Icon,
              emoji,
            }) => {
              const active =
                href === "/"
                  ? isHomeActive
                  : pathname.startsWith(
                      href
                    );

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
                    rounded-[20px]
                    border
                    px-3
                    py-3
                    transition-all
                    duration-200
                    active:scale-[0.98]
                    ${
                      active
                        ? "border-[#087f83] bg-[#087f83] text-white shadow-[0_8px_22px_rgba(8,127,131,0.20)]"
                        : "border-transparent bg-transparent text-[#6b5842] hover:border-[#e4c99e] hover:bg-[#f7efe0]"
                    }
                  `}
                >
                  {/* DETALLE TEXTIL */}

                  <span
                    className={`
                      absolute
                      bottom-0
                      left-0
                      top-0
                      w-1
                      ${
                        active
                          ? "bg-[#e8a33d]"
                          : "bg-transparent"
                      }
                    `}
                  />

                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-[15px]
                      ${
                        active
                          ? "bg-white/15"
                          : "bg-[#f7efe0]"
                      }
                    `}
                  >
                    <Icon
                      size={22}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`
                        block
                        truncate
                        text-[14px]
                        ${
                          active
                            ? "font-black text-white"
                            : "font-bold text-[#3b2a1a]"
                        }
                      `}
                    >
                      {label}
                    </span>

                    <span
                      className={`
                        text-[10px]
                        ${
                          active
                            ? "text-white/70"
                            : "text-[#9a8065]"
                        }
                      `}
                    >
                      {emoji}
                    </span>
                  </div>

                  {active && (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e8a33d] shadow-[0_0_10px_rgba(232,163,61,0.8)]" />
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
                backgroundImage:
                  `
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
