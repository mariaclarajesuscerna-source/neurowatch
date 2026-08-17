"use client";

import { useState } from "react";
import "./globals.css";

type Language = "es" | "qu";

export default function Home() {
  const [language, setLanguage] = useState<Language>("es");
  const [active, setActive] = useState("inicio");

  const es = language === "es";

  const text = {
    brand: "NEUROWATCH",

    nav: {
      inicio: es ? "Inicio" : "Qallariy",
      historial: es ? "Historial" : "Ñawpaq qillqakuna",
      alertas: es ? "Alertas" : "Willakuykuna",
      perfil: es ? "Perfil" : "Rikhuriy",
    },

    heart: es ? "FRECUENCIA CARDÍACA" : "SONQO KUTICHIY",
    activeMonitoring: es ? "MONITOREO ACTIVO" : "QHAWARIY RURAYPI",

    liveSigns: es ? "SIGNOS EN VIVO" : "KAWSAYPA SEÑALKUNA",

    pulse: es ? "ppm" : "ppm",
    breathing: es ? "rpm" : "rpm",
    oxygen: es ? "SpO₂" : "SpO₂",
    temperature: es ? "°C" : "°C",

    watchTitle: es
      ? "CONECTAR RELOJ NEUROWATCH"
      : "NEUROWATCH RELOJTA TINKUCHIY",

    device: es ? "Estado del dispositivo" : "Dispositivopa kawsaynin",

    connected: es ? "CONECTADO" : "TINKUSQA",

    activeTitle: es ? "Estado actual" : "Kunan kawsaynin",

    healthy: es
      ? "Tus signos vitales están estables."
      : "Kawsaypa señalkunam allin kachkan.",

    alertsTitle: es ? "ALERTAS" : "WILLAKUYKUNA",

    highHeart: es ? "FRECUENCIA ALTA" : "SONQO KUTICHIY HATUN",

    highHeartDescription: es
      ? "Tu frecuencia cardíaca está elevada."
      : "Sonqoykiqa aswan utqayta kutichkan.",

    restTitle: es ? "RECUERDA DESCANSAR" : "SAMAYTA YUYARIY",

    restDescription: es
      ? "Tómate un momento para relajarte."
      : "Pisi pachata samaykuy.",

    everythingOk: es ? "¡TODO BIEN!" : "¡LLAPA ALLINMI!",

    everythingDescription: es
      ? "Tus signos vitales están estables."
      : "Kawsaypa señalkunam allin kachkan.",

    whyTitle: es ? "¿POR QUÉ NEUROWATCH?" : "¿IMAPAQ NEUROWATCH?",

    reasons: es
      ? [
          {
            icon: "❤",
            title: "MONITOREO EN TIEMPO REAL",
            description: "Cuida tu corazón cada segundo.",
          },
          {
            icon: "✦",
            title: "TECNOLOGÍA CON PROPÓSITO",
            description: "Innovación que mejora vidas en Huaraz.",
          },
          {
            icon: "◈",
            title: "CONECTADO CONTIGO",
            description: "Datos seguros, siempre contigo.",
          },
          {
            icon: "●",
            title: "HECHO PARA NUESTRA GENTE",
            description: "Diseñado pensando en nuestra tierra.",
          },
        ]
      : [
          {
            icon: "❤",
            title: "PACHAPI QHAWARIY",
            description: "Sapa kuti sonqoykita qhawarin.",
          },
          {
            icon: "✦",
            title: "YACHAY KAWSAYPAQ",
            description: "Musuq yachay Huaraz runakunapaq.",
          },
          {
            icon: "◈",
            title: "QAMWAN TINKUSQA",
            description: "Willakuykuna qamwan waqaychasqa.",
          },
          {
            icon: "●",
            title: "ÑUQANCHIKPAQ RURASQA",
            description: "Allpanchikta yuyarispa rurasqa.",
          },
        ],

    landTitle: es ? "HUARAZ" : "HUARAZ",

    landDescription: es
      ? "Nuestra tierra, nuestra fuerza"
      : "Allpanchik, kallpanchik",

    values: es
      ? [
          "Salud",
          "Confianza",
          "Innovación",
          "Comunidad",
          "Tradición",
        ]
      : [
          "Allin kawsay",
          "Chiqap yuyay",
          "Musuq yachay",
          "Ayllu",
          "Ñawpaq yachay",
        ],
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <main className="app">

      {/* FONDO ANDINO */}
      <div className="mountain-bg">
        <div className="sun">☀</div>

        <div className="mountains">
          <div className="mountain mountain-one"></div>
          <div className="mountain mountain-two"></div>
          <div className="mountain mountain-three"></div>
        </div>

        <div className="village">
          <span>🏠</span>
          <span>⛪</span>
          <span>🏠</span>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="content">

        {/* HEADER */}
        <header className="topbar">

          <button className="menu-button">
            ☰
          </button>

          <div className="brand">
            <div className="brand-mountain">⌃</div>
            <span>{text.brand}</span>
          </div>

          <button className="notification">
            🔔
            <span className="notification-dot"></span>
          </button>

        </header>

        {/* SELECTOR DE IDIOMA */}
        <div className="language-selector">

          <button
            className={language === "es" ? "language active-es" : "language"}
            onClick={() => changeLanguage("es")}
          >
            ESPAÑOL
          </button>

          <button
            className={language === "qu" ? "language active-qu" : "language"}
            onClick={() => changeLanguage("qu")}
          >
            QUECHUA
          </button>

        </div>

        {/* TITULO */}
        <section className="hero">

          <div className="decor-left">✿</div>

          <h1>{text.heart}</h1>

          <div className="heart-wrapper">

            <div className="heart">
              <span>78</span>
              <small>{text.pulse}</small>
            </div>

            <div className="pulse-line left">
              〰〰〰
            </div>

            <div className="pulse-line right">
              〰〰〰
            </div>

          </div>

          <div className="decor-right">✿</div>

        </section>

        {/* ESTADO ACTUAL */}
        <section className="status-card">

          <div>
            <span className="small-title">
              {text.activeTitle}
            </span>

            <strong>
              {text.activeMonitoring}
            </strong>
          </div>

          <div className="status-mountain">
            △△△
          </div>

          <span className="online-dot"></span>

        </section>

        {/* SIGNOS */}
        <section className="signs">

          <h2>{text.liveSigns}</h2>

          <div className="sign-grid">

            <div className="sign-card">
              <div className="sign-icon heart-icon">❤</div>
              <strong>78</strong>
              <span>{text.pulse}</span>
            </div>

            <div className="sign-card">
              <div className="sign-icon lungs-icon">♧</div>
              <strong>18</strong>
              <span>{text.breathing}</span>
            </div>

            <div className="sign-card">
              <div className="sign-icon oxygen-icon">♦</div>
              <strong>98%</strong>
              <span>{text.oxygen}</span>
            </div>

            <div className="sign-card">
              <div className="sign-icon temp-icon">♨</div>
              <strong>36.5°</strong>
              <span>{text.temperature}</span>
            </div>

          </div>

        </section>

        {/* RELOJ */}
        <section className="watch-card">

          <div className="watch-info">

            <h3>{text.watchTitle}</h3>

            <p>{text.device}</p>

            <span className="connected">
              ● {text.connected}
            </span>

          </div>

          <div className="watch">
            <div className="watch-screen">
              ❤
              <br />
              <b>78</b>
            </div>
          </div>

        </section>

        {/* HUARAZ */}
        <section className="land-card">

          <div className="land-sun">☀</div>

          <div className="land-text">

            <h2>{text.landTitle}</h2>

            <p>{text.landDescription}</p>

          </div>

          <div className="llama">
            🦙
          </div>

        </section>

        {/* VALORES */}
        <section className="values">

          {text.values.map((value, index) => (

            <div className="value" key={value}>

              <div className={`value-icon value-${index}`}>
                {["❤", "🤝", "💡", "●", "◆"][index]}
              </div>

              <span>{value}</span>

            </div>

          ))}

        </section>

        {/* ALERTAS */}
        <section className="alerts-card">

          <div className="alerts-header">
            <span>≋</span>
            <h2>{text.alertsTitle}</h2>
            <span>≋</span>
          </div>

          <div className="alert-item">

            <div className="alert-icon red">
              ❤
            </div>

            <div className="alert-content">
              <strong>{text.highHeart}</strong>
              <p>{text.highHeartDescription}</p>
            </div>

            <time>10:30 AM</time>

          </div>

          <div className="alert-item">

            <div className="alert-icon yellow">
              !
            </div>

            <div className="alert-content">
              <strong>{text.restTitle}</strong>
              <p>{text.restDescription}</p>
            </div>

            <time>09:15 AM</time>

          </div>

          <div className="alert-item">

            <div className="alert-icon green">
              ✓
            </div>

            <div className="alert-content">
              <strong>{text.everythingOk}</strong>
              <p>{text.everythingDescription}</p>
            </div>

            <time>08:00 AM</time>

          </div>

        </section>

        {/* ¿POR QUÉ? */}
        <section className="why-card">

          <div className="section-title">
            <span>✦</span>
            <h2>{text.whyTitle}</h2>
            <span>✦</span>
          </div>

          <div className="reasons">

            {text.reasons.map((reason) => (

              <div className="reason" key={reason.title}>

                <div className="reason-icon">
                  {reason.icon}
                </div>

                <div>
                  <strong>{reason.title}</strong>
                  <p>{reason.description}</p>
                </div>

              </div>

            ))}

          </div>

        </section>

      </div>

      {/* BARRA INFERIOR */}
      <nav className="bottom-nav">

        <button
          className={active === "inicio" ? "nav-item selected" : "nav-item"}
          onClick={() => setActive("inicio")}
        >
          <span>⌂</span>
          <small>{text.nav.inicio}</small>
        </button>

        <button
          className={active === "historial" ? "nav-item selected" : "nav-item"}
          onClick={() => setActive("historial")}
        >
          <span>▣</span>
          <small>{text.nav.historial}</small>
        </button>

        <button
          className={active === "alertas" ? "nav-item selected" : "nav-item"}
          onClick={() => setActive("alertas")}
        >
          <span>♟</span>
          <small>{text.nav.alertas}</small>
        </button>

        <button
          className={active === "perfil" ? "nav-item selected" : "nav-item"}
          onClick={() => setActive("perfil")}
        >
          <span>♟</span>
          <small>{text.nav.perfil}</small>
        </button>

      </nav>

    </main>
  );
}
