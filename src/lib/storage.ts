const STORAGE_PREFIX = "neurowatch_";

/* =========================================================
   PACIENTE
========================================================= */

export interface StoredPatient {
  name: string;
  age: string;
  restingBPM: number;
}

/* =========================================================
   CONTACTOS
========================================================= */

export interface StoredContact {
  name: string;
  relation: string;
  telegramChatId: string;
}

/* =========================================================
   CONFIGURACIÓN
========================================================= */

export interface StoredSettings {
  toleranceBPM: number;
  countdownSeconds: number;
}

/* =========================================================
   STORAGE GENERAL
========================================================= */

function getItem<T>(
  key: string,
  fallback: T
): T {
  try {
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
    localStorage.setItem(
      STORAGE_PREFIX + key,
      JSON.stringify(value)
    );
  } catch {
    // Storage lleno o no disponible
  }
}

/* =========================================================
   PACIENTE
========================================================= */

export function getPatient():
  StoredPatient | null {
  return getItem<StoredPatient | null>(
    "patient",
    null
  );
}

export function setPatient(
  patient: StoredPatient
): void {
  setItem(
    "patient",
    patient
  );
}

/* =========================================================
   CONTACTOS
========================================================= */

export function getContacts():
  StoredContact[] {
  return getItem<StoredContact[]>(
    "contacts",
    []
  );
}

export function addContact(
  contact: StoredContact
): void {
  const contacts =
    getContacts();

  contacts.push(contact);

  setItem(
    "contacts",
    contacts
  );
}

export function removeContact(
  telegramChatId: string
): void {
  const contacts =
    getContacts().filter(
      (contact) =>
        contact.telegramChatId !==
        telegramChatId
    );

  setItem(
    "contacts",
    contacts
  );
}

/* =========================================================
   CONFIGURACIÓN
========================================================= */

export function getSettings():
  StoredSettings {
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
  setItem(
    "settings",
    settings
  );
}

/* =========================================================
   BASELINE BPM
========================================================= */

export function getBaselineBPM():
  number | null {
  const patient =
    getPatient();

  return (
    patient?.restingBPM ??
    null
  );
}

/* =========================================================
   IMAGEN BASE
========================================================= */

export function getBaselineImage():
  string | null {
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

export function getLastCheckPhoto():
  string | null {
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
   CHEQUEOS FACIALES
========================================================= */

/*
 * IMPORTANTE:
 *
 * SOLO existe una StoredFacialCheck.
 *
 * Usamos "image" como nombre oficial
 * para la imagen del chequeo.
 *
 * "photo" queda opcional para que datos
 * antiguos del navegador no rompan
 * la aplicación.
 */

export interface StoredFacialCheck {
  id: string;
  image: string;
  date: string;
  index: number;
  photo?: string;
}

/* =========================================================
   OBTENER CHEQUEOS
========================================================= */

export function getFacialChecks():
  StoredFacialCheck[] {
  const checks =
    getItem<StoredFacialCheck[]>(
      "facialChecks",
      []
    );

  /*
   * Compatibilidad con datos antiguos
   * que podrían tener "photo".
   */

  return checks.map(
    (check) => ({
      ...check,

      image:
        check.image ??
        check.photo ??
        "",
    })
  );
}

/* =========================================================
   GUARDAR CHEQUEO
========================================================= */

export function addFacialCheck(
  image: string,
  index: number
): StoredFacialCheck {
  const checks =
    getFacialChecks();

  const check: StoredFacialCheck = {
    id:
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,

    image,

    date:
      new Date().toLocaleString(
        "es-PE"
      ),

    index,
  };

  setItem(
    "facialChecks",
    [
      check,
      ...checks,
    ]
  );

  return check;
}

/* =========================================================
   ELIMINAR CHEQUEO
========================================================= */

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
   HISTORIAL FACIAL
========================================================= */

/*
 * Mantenemos estas funciones porque
 * alguna página de NeuroWatch podría
 * estar utilizándolas.
 */

export function getFacialHistory():
  StoredFacialCheck[] {
  return getItem<
    StoredFacialCheck[]
  >(
    "facialHistory",
    []
  );
}

export function addFacialHistory(
  check: StoredFacialCheck
): void {
  const history =
    getFacialHistory();

  const normalized: StoredFacialCheck =
    {
      ...check,

      image:
        check.image ??
        check.photo ??
        "",
    };

  setItem(
    "facialHistory",
    [
      normalized,
      ...history,
    ]
  );
}

/* =========================================================
   RACHA
========================================================= */

export interface Streak {
  count: number;
  lastCheckDate: string;
}

export function getStreak():
  Streak {
  return getItem<Streak>(
    "streak",
    {
      count: 0,
      lastCheckDate: "",
    }
  );
}

export function updateStreak():
  Streak {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const current =
    getStreak();

  /*
   * Si ya hizo el chequeo
   * de hoy, no aumentamos
   * nuevamente la racha.
   */

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

export function getOnboardingComplete():
  boolean {
  return getItem<boolean>(
    "onboardingComplete",
    false
  );
}

export function setOnboardingComplete():
  void {
  setItem(
    "onboardingComplete",
    true
  );
}

/* =========================================================
   LIMPIAR TODO
========================================================= */

export function clearAll(): void {
  try {
    const keys =
      Object.keys(
        localStorage
      ).filter(
        (key) =>
          key.startsWith(
            STORAGE_PREFIX
          )
      );

    keys.forEach(
      (key) =>
        localStorage.removeItem(
          key
        )
    );
  } catch {
    // Storage no disponible
  }
}
