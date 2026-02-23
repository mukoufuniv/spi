import type { Attempt } from "./types";

export const STORAGE_KEY = "spi_vocab_attempts";

const isBrowser = () => typeof window !== "undefined";

const readRaw = (): unknown => {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return [];
  }
};

export const loadAttempts = (): Attempt[] => {
  const raw = readRaw();
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is Attempt => {
    if (typeof item !== "object" || item === null) return false;
    const record = item as Attempt;
    return (
      typeof record.wordId === "string" &&
      record.mode === "memorize" &&
      (record.selfRating === 0 || record.selfRating === 1 || record.selfRating === 2) &&
      typeof record.answeredAt === "string"
    );
  });
};

export const saveAttempt = (attempt: Attempt) => {
  if (!isBrowser()) return;
  const attempts = loadAttempts();
  attempts.push(attempt);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
};
