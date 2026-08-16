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
