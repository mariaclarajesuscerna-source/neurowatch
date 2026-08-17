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
  {
    href: "/",
    label: "Inicio",
    Icon: IconHouse,
  },
  {
    href: "/chequeo",
    label: "Chequeo",
    Icon: IconScanFace,
  },
  {
    href: "/historial",
    label: "Historial",
    Icon: IconTrendingUp,
  },
  {
    href: "/contactos",
    label: "Contactos",
    Icon: IconUsers,
  },
  {
    href: "/ajustes",
    label: "Ajustes",
    Icon: IconSettings,
  },
] as const;

const dashboardRoutes = [
  "/",
  "/alerta-enviada",
  "/desconectado",
];

export default function TabBar() {
  const pathname = usePathname();

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
            justify-between
            gap-1
            rounded-[28px]
            border
            border-white/80
            bg-white/85
            px-2
            py-2
            shadow-[0_12px_40px_rgba(31,41,55,0.14)]
            backdrop-blur-2xl
          "
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
                aria-current={active ? "page" : undefined}
                className={`
                  group
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  items-center
                  justify-center
                  rounded-[21px]
                  px-1
                  py-2
                  transition-all
                  duration-200
                  active:scale-95
                  ${
                    active
                      ? "bg-brand-600 text-white shadow-[0_6px_18px_rgba(79,70,229,0.28)]"
                      : "text-ink-500 hover:bg-brand-50 hover:text-brand-600"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    transition-all
                    ${
                      active
                        ? "bg-white/15"
                        : "bg-transparent group-hover:bg-brand-100"
                    }
                  `}
                >
                  <Icon size={21} />
                </div>

                <span
                  className={`
                    mt-0.5
                    truncate
                    text-[10px]
                    leading-tight
                    ${
                      active
                        ? "font-bold text-white"
                        : "font-semibold text-ink-500"
                    }
                  `}
                >
                  {label}
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
          border-white/70
          bg-white/75
          shadow-[8px_0_35px_rgba(31,41,55,0.06)]
          backdrop-blur-2xl
          md:flex
        "
      >
        {/* LOGO */}

        <div className="px-5 pb-5 pt-6">
          <div
            className="
              flex
              items-center
              gap-3
              rounded-[22px]
              border
              border-white
              bg-white/70
              p-3
              shadow-[0_6px_25px_rgba(31,41,55,0.06)]
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-[15px]
                bg-brand-600
                text-white
                shadow-[0_6px_16px_rgba(79,70,229,0.28)]
              "
            >
              <IconActivity size={22} />
            </div>

            <div className="min-w-0">
              <span className="block text-[20px] font-bold leading-tight text-ink-900">
                Neurowatch
              </span>

              <span className="block text-[11px] font-medium text-ink-500">
                Monitoreo en vivo
              </span>
            </div>
          </div>
        </div>

        {/* BOTONES */}

        <nav className="flex flex-1 flex-col gap-2 px-4">
          {tabs.map(({ href, label, Icon }) => {
            const active =
              href === "/"
                ? isHomeActive
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`
                  group
                  flex
                  items-center
                  gap-3
                  rounded-[18px]
                  border
                  px-4
                  py-3.5
                  transition-all
                  duration-200
                  active:scale-[0.98]
                  ${
                    active
                      ? "border-brand-200 bg-brand-600 text-white shadow-[0_7px_20px_rgba(79,70,229,0.22)]"
                      : "border-transparent text-ink-600 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-600"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-[13px]
                    transition-all
                    ${
                      active
                        ? "bg-white/15"
                        : "bg-ink-900/[0.04] group-hover:bg-brand-100"
                    }
                  `}
                >
                  <Icon size={21} />
                </div>

                <span
                  className={`
                    text-[14px]
                    ${
                      active
                        ? "font-bold text-white"
                        : "font-semibold"
                    }
                  `}
                >
                  {label}
                </span>

                {active && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* AVISO */}

        <div className="px-5 pb-6">
          <div
            className="
              rounded-[18px]
              border
              border-white
              bg-white/60
              p-3
            "
          >
            <p className="text-[10px] leading-relaxed text-ink-500">
              Neurowatch es una herramienta asistiva.
              No reemplaza atención médica ni constituye
              diagnóstico. Ante una emergencia, llama a
              los servicios de urgencia.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
