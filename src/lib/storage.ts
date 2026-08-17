const STORAGE_PREFIX = "neurowatch_";

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

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export function getPatient(): StoredPatient | null {
  return getItem<StoredPatient | null>("patient", null);
}

export function setPatient(patient: StoredPatient): void {
  setItem("patient", patient);
}

export function getContacts(): StoredContact[] {
  return getItem<StoredContact[]>("contacts", []);
}

export function addContact(contact: StoredContact): void {
  const contacts = getContacts();
  contacts.push(contact);
  setItem("contacts", contacts);
}

export function removeContact(telegramChatId: string): void {
  const contacts = getContacts().filter(
    (c) => c.telegramChatId !== telegramChatId
  );
  setItem("contacts", contacts);
}

export function getSettings(): StoredSettings {
  return getItem<StoredSettings>("settings", {
    toleranceBPM: 15,
    countdownSeconds: 45,
  });
}

export function setSettings(settings: StoredSettings): void {
  setItem("settings", settings);
}

export function getBaselineBPM(): number | null {
  const patient = getPatient();
  return patient?.restingBPM ?? null;
}

export function getBaselineImage(): string | null {
  return getItem<string | null>("baselineImage", null);
}

export function setBaselineImage(image: string): void {
  setItem("baselineImage", image);
}

export function getLastCheckPhoto(): string | null {
  return getItem<string | null>("lastCheckPhoto", null);
}

export function setLastCheckPhoto(image: string): void {
  setItem("lastCheckPhoto", image);
}
export interface StoredFacialCheck {
  id: string;
  image: string;
  date: string;
  index: number;
}

export function getFacialChecks(): StoredFacialCheck[] {
  return getItem<StoredFacialCheck[]>("facialChecks", []);
}

export function addFacialCheck(
  image: string,
  index: number
): StoredFacialCheck {
  const checks = getFacialChecks();

  const check: StoredFacialCheck = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    image,
    date: new Date().toLocaleString("es-PE"),
    index,
  };

  setItem("facialChecks", [check, ...checks]);

  return check;
}

export function removeFacialCheck(id: string): void {
  const checks = getFacialChecks().filter(
    (check) => check.id !== id
  );

  setItem("facialChecks", checks);
}
export interface Streak {
  count: number;
  lastCheckDate: string;
}

export function getStreak(): Streak {
  return getItem<Streak>("streak", { count: 0, lastCheckDate: "" });
}

export function updateStreak(): Streak {
  const today = new Date().toISOString().split("T")[0];
  const current = getStreak();

  if (current.lastCheckDate === today) return current;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const count = current.lastCheckDate === yesterday ? current.count + 1 : 1;

  const streak: Streak = { count, lastCheckDate: today };
  setItem("streak", streak);
  return streak;
}

export function getOnboardingComplete(): boolean {
  return getItem<boolean>("onboardingComplete", false);
}

export function setOnboardingComplete(): void {
  setItem("onboardingComplete", true);
}
export interface StoredFacialCheck {
  id: string;
  date: string;
  index: number;
  photo: string;
}

export function getFacialHistory(): StoredFacialCheck[] {
  return getItem<StoredFacialCheck[]>("facialHistory", []);
}

export function addFacialHistory(check: StoredFacialCheck): void {
  const history = getFacialHistory();

  // La más reciente siempre va primero
  const updated = [check, ...history];

  setItem("facialHistory", updated);
}
export function clearAll(): void {
  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(STORAGE_PREFIX)
    );
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Storage unavailable
  }
}
