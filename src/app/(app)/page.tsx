"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  IconActivity,
  IconBluetooth,
} from "@/components/ui/icons";

import StatusChip from "@/components/ui/StatusChip";
import HeroStatus from "@/components/dashboard/HeroStatus";
import PulseCard from "@/components/dashboard/PulseCard";
import DeviceCard from "@/components/dashboard/DeviceCard";
import AlertModal from "@/components/alert/AlertModal";

import { useNeurowatch } from "@/components/NeurowatchProvider";

export default function DashboardPage() {
  const router = useRouter();

  const {
    language,
    setLanguage,
    bleData,
    bleError,
    connectBLE,
    status,
    pulseBars,
    contacts,
    alertOpen,
    countdownSeconds,
    settings,
    cancelAlert,
    disconnectedSince,
  } = useNeurowatch();

  /* =====================================================
     DESCONEXIÓN
  ===================================================== */

  useEffect(() => {
    if (disconnectedSince) {
      router.replace("/desconectado");
    }
  }, [router, disconnectedSince]);

  /* =====================================================
     TEXTOS
  ===================================================== */

  const text =
    language === "es"
      ? {
          place: "ÁNCASH · PERÚ",
          subtitle: "Monitoreo inteligente en tiempo real",

          monitoring: "TU MONITOREO",
          welcome: "Tu bienestar, más cerca.",

          deviceStatus: "Estado del dispositivo",
          active: "Sistema activo",
          waiting: "Esperando conexión",

          live: "EN VIVO",
          offline: "SIN CONEXIÓN",

          connect: "Conectar reloj NeuroWatch",

          current: "ESTADO ACTUAL",
          monitoringActive: "Monitoreo activo",

          connected: "Reloj conectado",

          putFinger:
            "Coloca el dedo sobre el sensor para comenzar a recibir tu pulso.",

          signs: "SIGNOS EN VIVO",
          heart: "Frecuencia cardíaca",

          device: "DISPOSITIVO",

          stable: "Señal estable",
          noConnection: "Sin conectar",

          intelligent: "Detección inteligente",

          connection: "CONEXIÓN",
          bluetooth: "Bluetooth activo",
          pending: "Pendiente",

          made: "HECHO EN ÁNCASH",
          identity: "Tecnología con identidad andina",

          assistive:
            "Herramienta asistiva · No diagnostica ni sustituye la atención profesional.",

          languageTitle: "IDIOMA",
          quechua: "QUECHUA",
          spanish: "ESPAÑOL",
        }
      : {
          place: "ANQASH · PIRUW",
          subtitle: "Kawsayta pacha-pachapi qhawariy",

          monitoring: "QAMPA RIKAYNIN",
          welcome: "Allin kawsayniki aswan qayllapi.",

          deviceStatus: "Dispositivopa kaynin",
          active: "Sistema llamk'achkan",
          waiting: "Tinkiyta suyarichkan",

          live: "KAWSACHKAN",
          offline: "MANA TINKISQA",

          connect: "NeuroWatch relojwan tinkiy",

          current: "KUNAN KAYNIN",
          monitoringActive: "Rikapaykuy llamk'achkan",

          connected: "Reloj tinkisqa",

          putFinger:
            "Ruk'aykita sensorpa hawanman churay, puywaykita chaskinapaq.",

          signs: "KAWSAYPA WILLAYNINKUNA",
          heart: "Shunqupa puywaynin",

          device: "DISPOSITIVO",

          stable: "Señal allinmi",
          noConnection: "Mana tinkisqa",

          intelligent: "Yachaywan rikay",

          connection: "TINKIY",
          bluetooth: "Bluetooth llamk'achkan",
          pending: "Suyarichkan",

          made: "ANQASHPI RURASQA",
          identity: "Andino yachaywan tecnología",

          assistive:
            "Yanapakuq sistema · Mana hampiqmi, hampiqpa yanayninta mana rantinchu.",

          languageTitle: "SIMI",
          quechua: "RUNASIMI",
          spanish: "ESPAÑOL",
        };

  const connected = bleData.connected;

  const connStatus = connected
    ? ("ok" as const)
    : ("muted" as const);

  const connLabel = connected
    ? language === "es"
      ? "Conectado"
      : "Tinkisqa"
    : language === "es"
      ? "Desconectado"
      : "Mana tinkisqa";

  return (
    <div className="nw-page">

      {/* =====================================================
          DECORACIÓN DE FONDO
      ===================================================== */}

      <div className="nw-background">

        <div className="nw-sun" />

        <div className="nw-cloud nw-cloud-one" />
        <div className="nw-cloud nw-cloud-two" />

        {/* Montañas */}
        <svg
          className="nw-mountains"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
        >
          <path
            className="mountain-back"
            d="M0 300L180 135L310 250L470 90L620 255L790 120L940 255L1120 80L1280 230L1440 120V400H0Z"
          />

          <path
            className="mountain-front"
            d="M0 350L170 210L300 310L480 150L640 315L820 180L980 315L1140 145L1300 290L1440 210V400H0Z"
          />

          <path
            className="snow"
            d="M470 90L430 130L470 118L495 145L520 120L545 145L505 95Z"
          />

          <path
            className="snow"
            d="M1120 80L1075 125L1110 112L1140 145L1170 115L1200 145L1155 90Z"
          />
        </svg>

        {/* Patrón andino */}
        <div className="nw-pattern nw-pattern-top" />
        <div className="nw-pattern nw-pattern-bottom" />

      </div>

      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <main className="nw-main">

        {/* =====================================================
            BARRA SUPERIOR
        ===================================================== */}

        <div className="nw-topbar">

          <div className="nw-location">
            <span className="nw-mountain-icon">🏔️</span>

            <span>{text.place}</span>
          </div>

          {/* IDIOMA */}
          <div className="nw-language">

            <span className="nw-language-label">
              {text.languageTitle}
            </span>

            <div className="nw-language-switch">

              <button
                type="button"
                onClick={() => setLanguage("qch")}
                className={
                  language === "qch"
                    ? "nw-language-btn active"
                    : "nw-language-btn"
                }
              >
                🌄 {text.quechua}
              </button>

              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={
                  language === "es"
                    ? "nw-language-btn active"
                    : "nw-language-btn"
                }
              >
                🇵🇪 {text.spanish}
              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="nw-header">

          <div className="nw-brand">

            <div className="nw-logo">

              <IconActivity size={29} />

              <span className="nw-logo-dot" />

            </div>

            <div>
              <h1>NeuroWatch</h1>

              <p>{text.subtitle}</p>
            </div>

          </div>

          <StatusChip
            label={connLabel}
            status={connStatus}
          />

        </header>

        {/* =====================================================
            FRANJA ANDINA
        ===================================================== */}

        <div className="nw-andean-bar">

          <span />
          <span />
          <span />
          <span />
          <span />
          <span />

        </div>

        <div className="nw-andean-title">

          <span>✦</span>

          <strong>
            {text.place}
          </strong>

          <span>✦</span>

        </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="nw-hero">

          <div className="nw-hero-decoration one" />
          <div className="nw-hero-decoration two" />

          <div className="nw-hero-content">

            <div className="nw-hero-top">

              <div>

                <span className="nw-eyebrow">
                  {text.monitoring}
                </span>

                <h2>
                  {text.welcome}
                </h2>

              </div>

              <div className="nw-watch">
                ⌚
              </div>

            </div>

            {/* Montaña decorativa */}

            <div className="nw-hero-mountain">

              <svg
                viewBox="0 0 600 100"
                preserveAspectRatio="none"
              >

                <path
                  d="M0 90L80 40L130 70L220 15L310 70L390 30L470 70L550 10L600 45V100H0Z"
                />

                <path
                  d="M0 90L80 40L130 70L220 15L310 70L390 30L470 70L550 10L600 45"
                />

              </svg>

            </div>

            <div className="nw-hero-status">

              <div>

                <span>
                  {text.deviceStatus}
                </span>

                <strong>

                  <i
                    className={
                      connected
                        ? "nw-status-dot connected"
                        : "nw-status-dot"
                    }
                  />

                  {connected
                    ? text.active
                    : text.waiting}

                </strong>

              </div>

              <div className="nw-live">

                {connected
                  ? `● ${text.live}`
                  : text.offline}

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            BOTÓN CONECTAR
        ===================================================== */}

        {!connected && (

          <button
            type="button"
            onClick={connectBLE}
            className="nw-connect"
          >

            <span className="nw-connect-icon">
              <IconBluetooth size={23} />
            </span>

            <span>
              {text.connect}
            </span>

            <span className="nw-arrow">
              →
            </span>

          </button>

        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {bleError && (

          <div className="nw-error">

            <span>⚠️</span>

            <p>
              {bleError}
            </p>

          </div>

        )}

        {/* =====================================================
            ESTADO ACTUAL
        ===================================================== */}

        {connected && bleData.bpm > 0 && (

          <section className="nw-card nw-current">

            <div className="nw-section-title">

              <div>
                <span>
                  {text.current}
                </span>

                <h2>
                  {text.monitoringActive}
                </h2>
              </div>

              <div className="nw-heart">
                ❤️
              </div>

            </div>

            <HeroStatus state={status} />

          </section>

        )}

        {/* =====================================================
            ESPERANDO PULSO
        ===================================================== */}

        {connected && bleData.bpm === 0 && (

          <section className="nw-card nw-waiting">

            <div className="nw-heart-big">
              ❤️
            </div>

            <h2>
              {text.connected}
            </h2>

            <p>
              {text.putFinger}
            </p>

            <div className="nw-loading" />

          </section>

        )}

        {/* =====================================================
            PULSO EN VIVO
        ===================================================== */}

        <section className="nw-section">

          <div className="nw-section-heading">

            <div>

              <span>
                {text.signs}
              </span>

              <h2>
                {text.heart}
              </h2>

            </div>

            <div className="nw-live-pill">
              ❤️ {language === "es" ? "EN VIVO" : "KAWSACHKAN"}
            </div>

          </div>

          <div className="nw-card nw-pulse">

            <PulseCard
              bpm={bleData.bpm}
              bars={pulseBars}
            />

          </div>

        </section>

        {/* =====================================================
            DISPOSITIVO
        ===================================================== */}

        <section className="nw-section">

          <div className="nw-section-heading">

            <div>

              <span className="cyan">
                {text.device}
              </span>

              <h2>
                NeuroWatch
              </h2>

            </div>

            <span className="nw-mini-mountain">
              🏔️
            </span>

          </div>

          <div className="nw-card nw-device">

            <DeviceCard
              connected={connected}
              signalStatus={
                connected
                  ? text.stable
                  : text.noConnection
              }
              batteryPercent={Math.round(
                bleData.batteryPercent
              )}
            />

          </div>

        </section>

        {/* =====================================================
            DOS TARJETAS
        ===================================================== */}

        <div className="nw-grid">

          <div className="nw-small-card nw-card-yellow">

            <div className="nw-small-icon">
              🧠
            </div>

            <span>
              NeuroWatch
            </span>

            <strong>
              {text.intelligent}
            </strong>

          </div>

          <div className="nw-small-card nw-card-cyan">

            <div className="nw-small-icon">
              📡
            </div>

            <span>
              {text.connection}
            </span>

            <strong>
              {connected
                ? text.bluetooth
                : text.pending}
            </strong>

          </div>

        </div>

        {/* =====================================================
            IDENTIDAD HUARACINA
        ===================================================== */}

        <section className="nw-identity">

          <div className="nw-identity-mountain">
            🏔️
          </div>

          <div className="nw-identity-content">

            <div className="nw-identity-icon">
              🌄
            </div>

            <div>

              <span>
                {text.made}
              </span>

              <h2>
                {text.identity}
              </h2>

              <p>
                {language === "es"
                  ? "Inspirado en nuestras montañas, colores y cultura."
                  : "Orqokunawan, llimpikunawan, kawsayniykunawan kusisqa."}
              </p>

            </div>

          </div>

          {/* Barra multicolor */}
          <div className="nw-rainbow">

            <i />
            <i />
            <i />
            <i />
            <i />
            <i />

          </div>

        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="nw-footer">

          <div className="nw-footer-line" />

          <p>
            {text.assistive}
          </p>

          <strong>
            🏔️ ANQASH · PIRUW 🇵🇪
          </strong>

        </footer>

        {/* =====================================================
            ALERTA
        ===================================================== */}

        <AlertModal
          open={alertOpen}
          remainingSeconds={countdownSeconds}
          totalSeconds={settings.countdownSeconds}
          contacts={contacts.map((c) => c.name)}
          onCancel={cancelAlert}
        />

      </main>
    </div>
  );
}
