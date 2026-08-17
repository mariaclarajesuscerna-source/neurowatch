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
import { detectAnomaly, type QualitativeStatus } from "@/lib/detection";
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

interface PulseBar {
  value: number;
  status: "normal" | "warn";
}

interface NeurowatchContextType {
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
  }[];

  facialChecks: StoredFacialCheck[];

  addFacialCheck: (
    index: number,
    image?: string
  ) => void;
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

  const {
    data: bleData,
    error: bleError,
    connect: connectBLE,
    disconnect: disconnectBLE,
    cancelDeviceAlert,
  } = useBLE();

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
      }[]
    >([]);

  const [facialChecks, setFacialChecks] =
    useState<StoredFacialCheck[]>([]);

  const [lastCheckPhoto, setLastCheckPhoto] =
    useState<string | null>(null);

  const [streak, setStreak] =
    useState<Streak>({
      count: 0,
      lastCheckDate: "",
    });

  const bpmBufferRef =
    useRef<number[]>([]);

  const lastBarTimeRef =
    useRef<number>(0);

  const lastConnectedRef =
    useRef<number>(Date.now());

  const bufferSeededRef =
    useRef(false);

  /*
   * Cargar todos los datos persistentes
   * cuando inicia NeuroWatch.
   */
  useEffect(() => {
    setPatientState(getPatient());
    setContactsState(getContacts());
    setSettingsState(getSettings());
    setBaselineImageState(getBaselineImage());
    setLastCheckPhoto(getLastCheckPhoto());
    setStreak(getStreak());
    setOnboardingCompleteState(
      getOnboardingComplete()
    );

    const storedChecks = getFacialChecks();

    setFacialChecks(storedChecks);

    setFacialHistory(
      storedChecks.map((check) => ({
        date: check.date,
        index: check.index,
      }))
    );
  }, []);

  /*
   * BPM
   */
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

  /*
   * Track disconnection
   */
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

  const restingBPM =
    patient?.restingBPM ?? 70;

  const tolerance =
    settings.toleranceBPM;

  const detectedStatus =
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

  /*
   * Alertas
   */
  const handleAlertComplete =
    useCallback(async () => {
      setAlertOpen(false);

      const now = Date.now();

      for (const contact of contacts) {
        await sendTelegramAlert({
          chatId:
            contact.telegramChatId,
          message: `ALERTA Neurowatch: Se detecto una anomalia en el pulso de ${patient?.name ?? "el paciente"}. BPM actual: ${bleData.bpm}. Por favor, verifica su estado de inmediato.`,
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

  /*
   * Paciente
   */
  const savePatient =
    useCallback(
      (p: StoredPatient) => {
        setPatient(p);
        setPatientState(p);
      },
      []
    );

  /*
   * Contactos
   */
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

  /*
   * Ajustes
   */
  const saveSettingsAction =
    useCallback(
      (s: StoredSettings) => {
        setSettings(s);
        setSettingsState(s);
      },
      []
    );

  /*
   * Imagen base
   */
  const saveBaselineImage =
    useCallback(
      (img: string) => {
        setBaselineImage(img);
        setBaselineImageState(img);
      },
      []
    );

  /*
   * Ultima foto
   */
  const saveLastCheckPhotoFn =
    useCallback(
      (img: string) => {
        persistLastCheckPhoto(img);
        setLastCheckPhoto(img);
      },
      []
    );

  /*
   * Onboarding
   */
  const finishOnboarding =
    useCallback(() => {
      setOnboardingComplete();

      setOnboardingCompleteState(
        true
      );
    }, []);

  /*
   * Historial facial persistente
   */
  const addFacialCheck =
    useCallback(
      (
        index: number,
        image?: string
      ) => {
        const today =
          new Date().toLocaleDateString(
            "es-ES",
            {
              day: "numeric",
              month: "short",
            }
          );

        /*
         * Si tenemos imagen,
         * la guardamos permanentemente.
         */
        if (image) {
          const saved =
            persistFacialCheck(
              image,
              index
            );

          setFacialChecks(
            (prev) => [
              saved,
              ...prev,
            ]
          );

          setFacialHistory(
            (prev) => [
              {
                date: today,
                index,
              },
              ...prev,
            ]
          );
        } else {
          /*
           * Mantiene compatibilidad
           * con llamadas antiguas.
           */
          setFacialHistory(
            (prev) => [
              {
                date: today,
                index,
              },
              ...prev,
            ]
          );
        }

        setStreak(
          updateStreak()
        );
      },
      []
    );

  /*
   * Barras BPM
   */
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
            ((bpm - 50) / 40) * 58
          )
        ),

        status:
          bpm < lower ||
          bpm > upper
            ? "warn"
            : "normal",
      };
    });

  while (
    pulseBars.length < 24
  ) {
    pulseBars.unshift({
      value: 30,
      status: "normal",
    });
  }

  return (
    <NeurowatchContext.Provider
      value={{
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
        facialChecks,

        addFacialCheck,
      }}
    >
      {children}
    </NeurowatchContext.Provider>
  );
}

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
