"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import {
  useBLE,
  type BLEData,
} from "@/hooks/useBLE";

import { useCountdown } from "@/hooks/useCountdown";

import {
  detectAnomaly,
  type QualitativeStatus,
} from "@/lib/detection";

import { sendTelegramAlert } from "@/lib/telegram";

import {
  getPatient,
  setPatient,

  getContacts,
  addContact,
  removeContact,

  getSettings,
  setSettings,

  getBaselineImage,
  setBaselineImage,

  getLastCheckPhoto,
  setLastCheckPhoto as persistLastCheckPhoto,

  getFacialChecks,
  addFacialCheck as persistFacialCheck,

  getStreak,
  updateStreak,

  getOnboardingComplete,
  setOnboardingComplete,

  type StoredPatient,
  type StoredContact,
  type StoredSettings,
  type Streak,
  type StoredFacialCheck,
} from "@/lib/storage";

/* =========================================================
   TIPOS
========================================================= */

interface PulseBar {
  value: number;
  status: "normal" | "warn";
}

interface FacialHistoryItem {
  date: string;
  index: number;
}

interface NeurowatchContextType {
  /* BLE */
  bleData: BLEData;
  bleError: string | null;

  connectBLE: () => Promise<void>;
  disconnectBLE: () => void;

  /* BPM */
  status: QualitativeStatus;
  recentBPMs: number[];
  pulseBars: PulseBar[];

  /* Paciente */
  patient: StoredPatient | null;
  savePatient: (p: StoredPatient) => void;

  /* Contactos */
  contacts: StoredContact[];
  saveContact: (c: StoredContact) => void;
  deleteContact: (telegramChatId: string) => void;

  /* Configuración */
  settings: StoredSettings;
  saveSettings: (s: StoredSettings) => void;

  /* Imágenes */
  baselineImage: string | null;
  saveBaselineImage: (img: string) => void;

  lastCheckPhoto: string | null;
  saveLastCheckPhoto: (img: string) => void;

  /* Racha */
  streak: Streak;

  /* Onboarding */
  onboardingComplete: boolean;
  finishOnboarding: () => void;

  /* Alertas */
  alertOpen: boolean;
  countdownSeconds: number;
  cancelAlert: () => void;

  alertSentAt: number | null;
  clearAlertSent: () => void;

  disconnectedSince: number | null;

  /* Historial facial */
  facialHistory: FacialHistoryItem[];
  facialChecks: StoredFacialCheck[];

  addFacialCheck: (
    index: number,
    image?: string
  ) => void;
}

/* =========================================================
   CONTEXTO
========================================================= */

const NeurowatchContext =
  createContext<NeurowatchContextType | null>(null);

/* =========================================================
   CONSTANTES
========================================================= */

const MAX_RECENT_BPMS = 24;

const DISCONNECT_THRESHOLD_MS = 10000;

/* =========================================================
   PROVIDER
========================================================= */

export function NeurowatchProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  /* =======================================================
     BLE
  ======================================================= */

  const {
    data: bleData,
    error: bleError,
    connect: connectBLE,
    disconnect: disconnectBLE,
    cancelDeviceAlert,
  } = useBLE();

  /* =======================================================
     ESTADOS
  ======================================================= */

  const [patient, setPatientState] =
    useState<StoredPatient | null>(null);

  const [contacts, setContactsState] =
    useState<StoredContact[]>([]);

  const [settings, setSettingsState] =
    useState<StoredSettings>({
      toleranceBPM: 15,
      countdownSeconds: 45,
    });

  const [baselineImage, setBaselineImageState] =
    useState<string | null>(null);

  const [lastCheckPhoto, setLastCheckPhoto] =
    useState<string | null>(null);

  const [onboardingComplete, setOnboardingCompleteState] =
    useState(false);

  const [recentBPMs, setRecentBPMs] =
    useState<number[]>([]);

  const [alertOpen, setAlertOpen] =
    useState(false);

  const [alertSentAt, setAlertSentAt] =
    useState<number | null>(null);

  const [disconnectedSince, setDisconnectedSince] =
    useState<number | null>(null);

  const [facialHistory, setFacialHistory] =
    useState<FacialHistoryItem[]>([]);

  const [facialChecks, setFacialChecks] =
    useState<StoredFacialCheck[]>([]);

  const [streak, setStreak] =
    useState<Streak>({
      count: 0,
      lastCheckDate: "",
    });

  /* =======================================================
     REFERENCIAS
  ======================================================= */

  const bpmBufferRef =
    useRef<number[]>([]);

  const lastBarTimeRef =
    useRef<number>(0);

  const lastConnectedRef =
    useRef<number>(Date.now());

  const bufferSeededRef =
    useRef(false);

  const alertTriggeredRef =
    useRef(false);

  /* =======================================================
     CARGAR DATOS DE STORAGE
  ======================================================= */

  useEffect(() => {
    const storedPatient =
      getPatient();

    const storedContacts =
      getContacts();

    const storedSettings =
      getSettings();

    const storedBaseline =
      getBaselineImage();

    const storedLastPhoto =
      getLastCheckPhoto();

    const storedStreak =
      getStreak();

    const storedOnboarding =
      getOnboardingComplete();

    const storedFacialChecks =
      getFacialChecks();

    setPatientState(
      storedPatient
    );

    setContactsState(
      storedContacts
    );

    setSettingsState(
      storedSettings
    );

    setBaselineImageState(
      storedBaseline
    );

    setLastCheckPhoto(
      storedLastPhoto
    );

    setStreak(
      storedStreak
    );

    setOnboardingCompleteState(
      storedOnboarding
    );

    setFacialChecks(
      storedFacialChecks
    );

    setFacialHistory(
      storedFacialChecks.map(
        (check) => ({
          date: check.date,
          index: check.index,
        })
      )
    );
  }, []);

  /* =======================================================
     HISTORIAL DE BPM
  ======================================================= */

  useEffect(() => {
    if (
      !bleData.connected ||
      bleData.bpm <= 0
    ) {
      return;
    }

    const now =
      Date.now();

    /*
     * Primera lectura:
     * llenamos las barras para que
     * la gráfica no aparezca vacía.
     */

    if (!bufferSeededRef.current) {
      bufferSeededRef.current =
        true;

      bpmBufferRef.current =
        Array(
          MAX_RECENT_BPMS
        ).fill(
          bleData.bpm
        );

      lastBarTimeRef.current =
        now;

      setRecentBPMs([
        ...bpmBufferRef.current,
      ]);

      return;
    }

    /*
     * Añadimos una lectura
     * cada 2 segundos.
     */

    if (
      now -
        lastBarTimeRef.current >=
      2000
    ) {
      lastBarTimeRef.current =
        now;

      bpmBufferRef.current = [
        ...bpmBufferRef.current,
        bleData.bpm,
      ].slice(
        -MAX_RECENT_BPMS
      );

      setRecentBPMs([
        ...bpmBufferRef.current,
      ]);
    }
  }, [
    bleData.bpm,
    bleData.connected,
    bleData.frameCount,
  ]);

  /* =======================================================
     DETECTAR DESCONEXIÓN
  ======================================================= */

  useEffect(() => {
    if (bleData.connected) {
      lastConnectedRef.current =
        Date.now();

      setDisconnectedSince(
        null
      );

      return;
    }

    /*
     * Limpiar gráfica cuando
     * se desconecta el reloj.
     */

    bufferSeededRef.current =
      false;

    bpmBufferRef.current =
      [];

    setRecentBPMs([]);

    if (!onboardingComplete) {
      return;
    }

    const check =
      setInterval(() => {
        const elapsed =
          Date.now() -
          lastConnectedRef.current;

        if (
          elapsed >
          DISCONNECT_THRESHOLD_MS
        ) {
          setDisconnectedSince(
            lastConnectedRef.current
          );
        }
      }, 1000);

    return () =>
      clearInterval(check);
  }, [
    bleData.connected,
    onboardingComplete,
  ]);

  /* =======================================================
     DETECCIÓN DE ANOMALÍAS
  ======================================================= */

  const restingBPM =
    patient?.restingBPM ?? 70;

  const tolerance =
    settings.toleranceBPM;

  const detectedStatus =
    detectAnomaly({
      currentBPM:
        bleData.bpm,

      restingBPM,

      toleranceBPM:
        tolerance,

      recentBPMs:
        recentBPMs.length > 0
          ? recentBPMs
          : [bleData.bpm],
    });

  /*
   * Si el ESP32 activa el motor,
   * damos prioridad a esa señal.
   */

  const status: QualitativeStatus =
    bleData.motor
      ? "alert"
      : detectedStatus;

  /* =======================================================
     ALERTA
  ======================================================= */

  const handleAlertComplete =
    useCallback(
      async () => {
        setAlertOpen(false);

        const now =
          Date.now();

        /*
         * Enviar alerta a todos
         * los contactos registrados.
         */

        for (
          const contact of contacts
        ) {
          try {
            await sendTelegramAlert({
              chatId:
                contact.telegramChatId,

              message:
                `ALERTA Neurowatch: Se detecto una anomalia en el pulso de ${
                  patient?.name ??
                  "el paciente"
                }. BPM actual: ${
                  bleData.bpm
                }. Por favor, verifica su estado de inmediato.`,
            });
          } catch {
            /*
             * Si un contacto falla,
             * continuamos con los demás.
             */
          }
        }

        setAlertSentAt(
          now
        );

        router.push(
          "/alerta-enviada"
        );
      },
      [
        contacts,
        patient,
        bleData.bpm,
        router,
      ]
    );

  const countdown =
    useCountdown({
      durationSeconds:
        settings.countdownSeconds,

      onComplete:
        handleAlertComplete,
    });

  /*
   * Guardamos la función start
   * en una referencia estable.
   */

  const countdownStartRef =
    useRef(countdown.start);

  countdownStartRef.current =
    countdown.start;

  /* =======================================================
     CANCELAR ALERTA
  ======================================================= */

  const cancelAlert =
    useCallback(
      async () => {
        countdown.cancel();

        setAlertOpen(false);

        alertTriggeredRef.current =
          false;

        try {
          await cancelDeviceAlert();
        } catch {
          /*
           * La alerta visual ya fue cancelada.
           */
        }
      },
      [
        cancelDeviceAlert,
        countdown,
      ]
    );

  /* =======================================================
     ACTIVAR ALERTA AUTOMÁTICAMENTE
  ======================================================= */

  useEffect(() => {
    if (
      status === "alert" &&
      !alertOpen &&
      !alertTriggeredRef.current &&
      !alertSentAt
    ) {
      alertTriggeredRef.current =
        true;

      setAlertOpen(true);

      countdownStartRef.current();
    }

    if (
      status !== "alert"
    ) {
      alertTriggeredRef.current =
        false;
    }
  }, [
    status,
    alertOpen,
    alertSentAt,
  ]);

  /* =======================================================
     LIMPIAR ESTADO DE ALERTA
  ======================================================= */

  const clearAlertSent =
    useCallback(() => {
      setAlertSentAt(
        null
      );

      alertTriggeredRef.current =
        false;
    }, []);

  /* =======================================================
     PACIENTE
  ======================================================= */

  const savePatient =
    useCallback(
      (p: StoredPatient) => {
        setPatient(p);

        setPatientState(
          p
        );
      },
      []
    );

  /* =======================================================
     CONTACTOS
  ======================================================= */

  const saveContact =
    useCallback(
      (contact: StoredContact) => {
        addContact(
          contact
        );

        setContactsState(
          getContacts()
        );
      },
      []
    );

  const deleteContact =
    useCallback(
      (telegramChatId: string) => {
        removeContact(
          telegramChatId
        );

        setContactsState(
          getContacts()
        );
      },
      []
    );

  /* =======================================================
     CONFIGURACIÓN
  ======================================================= */

  const saveSettingsAction =
    useCallback(
      (newSettings: StoredSettings) => {
        setSettings(
          newSettings
        );

        setSettingsState(
          newSettings
        );
      },
      []
    );

  /* =======================================================
     IMAGEN BASE
  ======================================================= */

  const saveBaselineImage =
    useCallback(
      (img: string) => {
        setBaselineImage(
          img
        );

        setBaselineImageState(
          img
        );
      },
      []
    );

  /* =======================================================
     ÚLTIMA FOTO
  ======================================================= */

  const saveLastCheckPhotoFn =
    useCallback(
      (img: string) => {
        persistLastCheckPhoto(
          img
        );

        setLastCheckPhoto(
          img
        );
      },
      []
    );

  /* =======================================================
     ONBOARDING
  ======================================================= */

  const finishOnboarding =
    useCallback(
      () => {
        setOnboardingComplete();

        setOnboardingCompleteState(
          true
        );
      },
      []
    );

  /* =======================================================
     HISTORIAL FACIAL
  ======================================================= */

  const addFacialCheck =
    useCallback(
      (
        index: number,
        image?: string
      ) => {
        const date =
          new Date().toLocaleDateString(
            "es-ES",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );

        /*
         * IMPORTANTE:
         *
         * Tu storage define StoredFacialCheck.
         *
         * Para evitar el error image/photo,
         * aquí usamos exactamente los dos
         * campos que necesita tu estructura
         * actual.
         */

        const savedImage =
          image ?? "";

        const check: StoredFacialCheck =
          {
            id:
              `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`,

            date,

            index,

            image:
              savedImage,

            photo:
              savedImage,
          };

        /*
         * Guardar en localStorage
         */

       persistFacialCheck(
       check.index,
       check.image
      );

        /*
         * Actualizar estado
         */

        setFacialChecks(
          (previous) => [
            check,
            ...previous,
          ]
        );

        /*
         * Actualizar historial
         */

        setFacialHistory(
          (previous) => [
            {
              date:
                check.date,

              index:
                check.index,
            },

            ...previous,
          ]
        );

        /*
         * Actualizar racha
         */

        const updatedStreak =
          updateStreak();

        setStreak(
          updatedStreak
        );
      },
      []
    );

  /* =======================================================
     BARRAS DE BPM
  ======================================================= */

  const pulseBars: PulseBar[] =
    recentBPMs.map(
      (bpm) => {
        const lower =
          restingBPM -
          tolerance;

        const upper =
          restingBPM +
          tolerance;

        return {
          value:
            Math.min(
              58,
              Math.max(
                18,
                ((bpm - 50) /
                  40) *
                  58
              )
            ),

          status:
            bpm < lower ||
            bpm > upper
              ? "warn"
              : "normal",
        };
      }
    );

  /*
   * Completar hasta 24 barras.
   */

  while (
    pulseBars.length <
    MAX_RECENT_BPMS
  ) {
    pulseBars.unshift({
      value: 30,
      status: "normal",
    });
  }

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <NeurowatchContext.Provider
      value={{
        /* BLE */
        bleData,
        bleError,
        connectBLE,
        disconnectBLE,

        /* BPM */
        status,
        recentBPMs,
        pulseBars,

        /* Paciente */
        patient,
        savePatient,

        /* Contactos */
        contacts,
        saveContact,
        deleteContact,

        /* Configuración */
        settings,
        saveSettings:
          saveSettingsAction,

        /* Imágenes */
        baselineImage,
        saveBaselineImage,

        lastCheckPhoto,
        saveLastCheckPhoto:
          saveLastCheckPhotoFn,

        /* Racha */
        streak,

        /* Onboarding */
        onboardingComplete,
        finishOnboarding,

        /* Alertas */
        alertOpen,

        countdownSeconds:
          countdown.remaining,

        cancelAlert,

        alertSentAt,
        clearAlertSent,

        /* Desconexión */
        disconnectedSince,

        /* Historial facial */
        facialHistory,
        facialChecks,
        addFacialCheck,
      }}
    >
      {children}
    </NeurowatchContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useNeurowatch() {
  const context =
    useContext(
      NeurowatchContext
    );

  if (!context) {
    throw new Error(
      "useNeurowatch must be used within NeurowatchProvider"
    );
  }

  return context;
}
