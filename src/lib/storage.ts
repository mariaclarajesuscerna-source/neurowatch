const STORAGE_PREFIX = "neurowatch_";

/* =========================================================
   TIPOS
   ========================================================= */

export interface StoredPatient {
  name: string;
  age: string;
  restingBPM: number;
}

export interface StoredContact {
  name: string;
  relation: string;
  telegramChatId: string;
}

export interface StoredSettings {
  toleranceBPM: number;
  countdownSeconds: number;
}

export interface StoredFacialCheck {
  id: string;
  date: string;
  index: number;
  image: string;
}

/* =========================================================
   STORAGE GENERAL
   ========================================================= */

function getItem<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") {
      return fallback;
    }

    const raw = localStorage.getItem(
      STORAGE_PREFIX + key
    );

    if (raw === null) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem(
  key: string,
  value: unknown
): void {
  try {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(
      STORAGE_PREFIX + key,
      JSON.stringify(value)
    );
  } catch {
    // Storage lleno o no disponible.
  }
}

/* =========================================================
   PACIENTE
   ========================================================= */

export function getPatient(): StoredPatient | null {
  return getItem<StoredPatient | null>(
    "patient",
    null
  );
}

export function setPatient(
  patient: StoredPatient
): void {
  setItem("patient", patient);
}

/* =========================================================
   CONTACTOS
   ========================================================= */

export function getContacts(): StoredContact[] {
  return getItem<StoredContact[]>(
    "contacts",
    []
  );
}

export function addContact(
  contact: StoredContact
): void {
  const contacts = getContacts();

  contacts.push(contact);

  setItem("contacts", contacts);
}

export function removeContact(
  telegramChatId: string
): void {
  const contacts = getContacts().filter(
    (contact) =>
      contact.telegramChatId !== telegramChatId
  );

  setItem("contacts", contacts);
}

/* =========================================================
   AJUSTES
   ========================================================= */

export function getSettings(): StoredSettings {
  return getItem<StoredSettings>(
    "settings",
    {
      toleranceBPM: 15,
      countdownSeconds: 45,
    }
  );
}

export function setSettings(
  settings: StoredSettings
): void {
  setItem("settings", settings);
}

/* =========================================================
   BPM BASE
   ========================================================= */

export function getBaselineBPM(): number | null {
  const patient = getPatient();

  return patient?.restingBPM ?? null;
}

/* =========================================================
   IMAGEN BASE
   ========================================================= */

export function getBaselineImage(): string | null {
  return getItem<string | null>(
    "baselineImage",
    null
  );
}

export function setBaselineImage(
  image: string
): void {
  setItem(
    "baselineImage",
    image
  );
}

/* =========================================================
   ÚLTIMA FOTO
   ========================================================= */

export function getLastCheckPhoto(): string | null {
  return getItem<string | null>(
    "lastCheckPhoto",
    null
  );
}

export function setLastCheckPhoto(
  image: string
): void {
  setItem(
    "lastCheckPhoto",
    image
  );
}

/* =========================================================
   HISTORIAL FACIAL
   ========================================================= */

/*
 * IMPORTANTE:
 * Esta es la ÚNICA definición de StoredFacialCheck.
 */

export function getFacialChecks(): StoredFacialCheck[] {
  return getItem<StoredFacialCheck[]>(
    "facialChecks",
    []
  );
}

/*
 * Guarda un nuevo chequeo facial.
 *
 * ORDEN:
 * image -> string
 * index -> number
 *
 * AHORA GUARDA:
 * fecha + hora + segundos
 */
export function addFacialCheck(
  image: string,
  index: number
): StoredFacialCheck {
  const checks =
    getFacialChecks();

  const check: StoredFacialCheck = {
    id: `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`,

    image,

    /*
     * Fecha y hora exacta del chequeo.
     *
     * Ejemplo:
     * 17/08/2026, 04:42:18 p. m.
     */
    date: new Date().toLocaleString(
      "es-PE",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    ),

    index,
  };

  setItem(
    "facialChecks",
    [check, ...checks]
  );

  return check;
}

export function removeFacialCheck(
  id: string
): void {
  const checks =
    getFacialChecks().filter(
      (check) =>
        check.id !== id
    );

  setItem(
    "facialChecks",
    checks
  );
}

/* =========================================================
   HISTORIAL FACIAL COMPATIBLE
   ========================================================= */

export function getFacialHistory(): StoredFacialCheck[] {
  return getItem<StoredFacialCheck[]>(
    "facialHistory",
    []
  );
}

export function addFacialHistory(
  check: StoredFacialCheck
): void {
  const history =
    getFacialHistory();

  const updated = [
    check,
    ...history,
  ];

  setItem(
    "facialHistory",
    updated
  );
}

/* =========================================================
   RACHA
   ========================================================= */

export interface Streak {
  count: number;
  lastCheckDate: string;
}

export function getStreak(): Streak {
  return getItem<Streak>(
    "streak",
    {
      count: 0,
      lastCheckDate: "",
    }
  );
}

export function updateStreak(): Streak {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const current =
    getStreak();

  if (
    current.lastCheckDate ===
    today
  ) {
    return current;
  }

  const yesterday =
    new Date(
      Date.now() -
        86400000
    )
      .toISOString()
      .split("T")[0];

  const count =
    current.lastCheckDate ===
    yesterday
      ? current.count + 1
      : 1;

  const streak: Streak = {
    count,
    lastCheckDate: today,
  };

  setItem(
    "streak",
    streak
  );

  return streak;
}

/* =========================================================
   ONBOARDING
   ========================================================= */

export function getOnboardingComplete(): boolean {
  return getItem<boolean>(
    "onboardingComplete",
    false
  );
}

export function setOnboardingComplete(): void {
  setItem(
    "onboardingComplete",
    true
  );
}

/* =========================================================
   LIMPIAR DATOS
   ========================================================= */

export function clearAll(): void {
  try {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const keys =
      Object.keys(
        localStorage
      ).filter((key) =>
        key.startsWith(
          STORAGE_PREFIX
        )
      );

    keys.forEach((key) =>
      localStorage.removeItem(
        key
      )
    );
  } catch {
    // Storage no disponible.
  }
}
