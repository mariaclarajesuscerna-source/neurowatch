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

import { useBLE, type BLEData } from "@/hooks/useBLE";
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
  getFacialHistory,
  addFacialHistory,
  getStreak,
  updateStreak,
  getOnboardingComplete,
  setOnboardingComplete,
  type StoredPatient,
  type StoredContact,
  type StoredSettings,
  type Streak,
} from "@/lib/storage";

interface PulseBar {
  value: number;
  status: "normal" | "warn";
}

export type Language = "es" | "qch";

interface NeurowatchContextType {
  language: Language;
  setLanguage: (language: Language) => void;

  bleData: BLEData;
  bleError: string | null;
  connectBLE: () => Promise<void>;
  disconnectBLE: () => void;

  status: QualitativeStatus;
  recentBPMs: number[];
  pulseBars: PulseBar[];

  patient: StoredPatient | null;
  savePatient: (p: StoredPatient) => void;

  contacts: StoredContact[];
  saveContact: (c: StoredContact) => void;
  deleteContact: (telegramChatId: string) => void;

  settings: StoredSettings;
  saveSettings: (s: StoredSettings) => void;

  baselineImage: string | null;
  saveBaselineImage: (img: string) => void;

  lastCheckPhoto: string | null;
  saveLastCheckPhoto: (img: string) => void;

  streak: Streak;

  onboardingComplete: boolean;
  finishOnboarding: () => void;

  alertOpen: boolean;
  countdownSeconds: number;
  cancelAlert: () => void;

  alertSentAt: number | null;
  clearAlertSent: () => void;

  disconnectedSince: number | null;

  facialHistory: {
    date: string;
    index: number;
    photo: string;
  }[];

  addFacialCheck: (index: number, photo: string) => void;
}

const NeurowatchContext =
  createContext<NeurowatchContextType | null>(null);

const MAX_RECENT_BPMS = 24;
const DISCONNECT_THRESHOLD_MS = 10000;

export function NeurowatchProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  /* =========================
     IDIOMA
  ========================= */

  const [language, setLanguageState] =
    useState<Language>("es");

  const setLanguage = useCallback(
    (newLanguage: Language) => {
      setLanguageState(newLanguage);

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            "neurowatch-language",
            newLanguage
          );
        } catch {
          // LocalStorage no disponible.
        }
      }
    },
    []
  );

  /* =========================
     CARGAR IDIOMA GUARDADO
  ========================= */

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedLanguage =
        window.localStorage.getItem(
          "neurowatch-language"
        );

      if (
        savedLanguage === "es" ||
        savedLanguage === "qch"
      ) {
        setLanguageState(savedLanguage);
      }
    } catch {
      // LocalStorage no disponible.
    }
  }, []);

  /* =========================
     BLUETOOTH
  ========================= */

  const {
    data: bleData,
    error: bleError,
    connect: connectBLE,
    disconnect: disconnectBLE,
    cancelDeviceAlert,
  } = useBLE();

  /* =========================
     ESTADOS
  ========================= */

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
    useState<
      {
        date: string;
        index: number;
        photo: string;
      }[]
    >([]);

  const [lastCheckPhoto, setLastCheckPhoto] =
    useState<string | null>(null);

  const [streak, setStreak] =
    useState<Streak>({
      count: 0,
      lastCheckDate: "",
    });

  /* =========================
     REFERENCIAS
  ========================= */

  const bpmBufferRef =
    useRef<number[]>([]);

  const lastBarTimeRef =
    useRef<number>(0);

  const lastConnectedRef =
    useRef<number>(Date.now());

  const bufferSeededRef =
    useRef(false);

  /* =========================
     CARGAR DATOS GUARDADOS
  ========================= */

  useEffect(() => {
    setPatientState(getPatient());
    setContactsState(getContacts());
    setSettingsState(getSettings());
    setBaselineImageState(getBaselineImage());
    setLastCheckPhoto(getLastCheckPhoto());
    setFacialHistory(getFacialHistory());
    setStreak(getStreak());
    setOnboardingCompleteState(
      getOnboardingComplete()
    );
  }, []);

  /* =========================
     BPM RECIENTES
  ========================= */

  useEffect(() => {
    if (
      !bleData.connected ||
      bleData.bpm <= 0
    ) {
      return;
    }

    const now = Date.now();

    if (!bufferSeededRef.current) {
      bufferSeededRef.current = true;

      bpmBufferRef.current =
        Array(MAX_RECENT_BPMS).fill(
          bleData.bpm
        );

      lastBarTimeRef.current = now;

      setRecentBPMs([
        ...bpmBufferRef.current,
      ]);

      return;
    }

    if (
      now - lastBarTimeRef.current >=
      2000
    ) {
      lastBarTimeRef.current = now;

      bpmBufferRef.current = [
        ...bpmBufferRef.current,
        bleData.bpm,
      ].slice(-MAX_RECENT_BPMS);

      setRecentBPMs([
        ...bpmBufferRef.current,
      ]);
    }
  }, [
    bleData.bpm,
    bleData.connected,
    bleData.frameCount,
  ]);

  /* =========================
     DESCONEXIÓN
  ========================= */

  useEffect(() => {
    if (bleData.connected) {
      lastConnectedRef.current =
        Date.now();

      setDisconnectedSince(null);
    } else {
      bufferSeededRef.current = false;
      bpmBufferRef.current = [];

      if (onboardingComplete) {
        const check = setInterval(() => {
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
      }
    }
  }, [
    bleData.connected,
    onboardingComplete,
  ]);

  /* =========================
     DETECCIÓN
  ========================= */

  const restingBPM =
    patient?.restingBPM ?? 70;

  const tolerance =
    settings.toleranceBPM;

  const detectedStatus:
    QualitativeStatus =
    detectAnomaly({
      currentBPM: bleData.bpm,
      restingBPM,
      toleranceBPM: tolerance,
      recentBPMs:
        recentBPMs.length > 0
          ? recentBPMs
          : [bleData.bpm],
    });

  const status: QualitativeStatus =
    bleData.motor
      ? "alert"
      : detectedStatus;

  /* =========================
     ALERTA
  ========================= */

  const handleAlertComplete =
    useCallback(async () => {
      setAlertOpen(false);

      const now = Date.now();

      for (const contact of contacts) {
        await sendTelegramAlert({
          chatId:
            contact.telegramChatId,

          message:
            `ALERTA Neurowatch: Se detectó una anomalía en el pulso de ${
              patient?.name ??
              "el paciente"
            }. BPM actual: ${
              bleData.bpm
            }. Por favor, verifica su estado de inmediato.`,
        });
      }

      setAlertSentAt(now);

      router.push(
        "/alerta-enviada"
      );
    }, [
      contacts,
      patient,
      bleData.bpm,
      router,
    ]);

  const countdown = useCountdown({
    durationSeconds:
      settings.countdownSeconds,

    onComplete:
      handleAlertComplete,
  });

  const countdownStartRef =
    useRef(countdown.start);

  countdownStartRef.current =
    countdown.start;

  const cancelAlert =
    useCallback(async () => {
      countdown.cancel();

      setAlertOpen(false);

      try {
        await cancelDeviceAlert();
      } catch {
        // La alerta visual se cancela.
      }
    }, [
      cancelDeviceAlert,
      countdown,
    ]);

  /* =========================
     ACTIVAR ALERTA
  ========================= */

  const alertTriggeredRef =
    useRef(false);

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

    if (status !== "alert") {
      alertTriggeredRef.current =
        false;
    }
  }, [
    status,
    alertOpen,
    alertSentAt,
  ]);

  const clearAlertSent =
    useCallback(() => {
      setAlertSentAt(null);
    }, []);

  /* =========================
     PACIENTE
  ========================= */

  const savePatient =
    useCallback(
      (p: StoredPatient) => {
        setPatient(p);
        setPatientState(p);
      },
      []
    );

  /* =========================
     CONTACTOS
  ========================= */

  const saveContact =
    useCallback(
      (c: StoredContact) => {
        addContact(c);
        setContactsState(
          getContacts()
        );
      },
      []
    );

  const deleteContact =
    useCallback(
      (id: string) => {
        removeContact(id);

        setContactsState(
          getContacts()
        );
      },
      []
    );

  /* =========================
     AJUSTES
  ========================= */

  const saveSettingsAction =
    useCallback(
      (s: StoredSettings) => {
        setSettings(s);
        setSettingsState(s);
      },
      []
    );

  /* =========================
     IMAGEN BASE
  ========================= */

  const saveBaselineImage =
    useCallback(
      (img: string) => {
        setBaselineImage(img);
        setBaselineImageState(img);
      },
      []
    );

  /* =========================
     ÚLTIMA FOTO
  ========================= */

  const saveLastCheckPhotoFn =
    useCallback(
      (img: string) => {
        persistLastCheckPhoto(img);
        setLastCheckPhoto(img);
      },
      []
    );

  /* =========================
     ONBOARDING
  ========================= */

  const finishOnboarding =
    useCallback(() => {
      setOnboardingComplete();

      setOnboardingCompleteState(
        true
      );
    }, []);

  /* =========================
     HISTORIAL FACIAL
  ========================= */

  const addFacialCheck =
    useCallback(
      (
        index: number,
        photo: string
      ) => {
        const today =
          new Date().toLocaleDateString(
            "es-ES",
            {
              day: "numeric",
              month: "short",
            }
          );

        const check = {
          date: today,
          index,
          photo,
        };

        addFacialHistory(check);

        setFacialHistory(
          (prev) => [
            check,
            ...prev,
          ]
        );

        setStreak(
          updateStreak()
        );
      },
      []
    );

  /* =========================
     BARRAS DE PULSO
  ========================= */

  const pulseBars: PulseBar[] =
    recentBPMs.map((bpm) => {
      const lower =
        restingBPM - tolerance;

      const upper =
        restingBPM + tolerance;

      return {
        value: Math.min(
          58,
          Math.max(
            18,
            ((bpm - 50) / 40) *
              58
          )
        ),

        status:
          bpm < lower ||
          bpm > upper
            ? "warn"
            : "normal",
      };
    });

  while (pulseBars.length < 24) {
    pulseBars.unshift({
      value: 30,
      status: "normal",
    });
  }

  /* =========================
     PROVIDER
  ========================= */

  return (
    <NeurowatchContext.Provider
      value={{
        language,
        setLanguage,

        bleData,
        bleError,
        connectBLE,
        disconnectBLE,

        status,
        recentBPMs,
        pulseBars,

        patient,
        savePatient,

        contacts,
        saveContact,
        deleteContact,

        settings,
        saveSettings:
          saveSettingsAction,

        baselineImage,
        saveBaselineImage,

        lastCheckPhoto,
        saveLastCheckPhoto:
          saveLastCheckPhotoFn,

        streak,

        onboardingComplete,
        finishOnboarding,

        alertOpen,
        countdownSeconds:
          countdown.remaining,

        cancelAlert,

        alertSentAt,
        clearAlertSent,

        disconnectedSince,

        facialHistory,
        addFacialCheck,
      }}
    >
      {children}
    </NeurowatchContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useNeurowatch() {
  const ctx =
    useContext(
      NeurowatchContext
    );

  if (!ctx) {
    throw new Error(
      "useNeurowatch must be used within NeurowatchProvider"
    );
  }

  return ctx;
}
