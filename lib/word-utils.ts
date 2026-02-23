import type { RawQuizSet, RawWord, QuizSet, Word } from "./types";

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
};

const normalizeQuizSet = (raw?: RawQuizSet): QuizSet | undefined => {
  if (!raw || typeof raw !== "object") return undefined;
  if (typeof raw.correct !== "string" || raw.correct.trim() === "") return undefined;
  return {
    correct: raw.correct,
    distractors: toStringArray(raw.distractors)
  };
};

export const normalizeWord = (raw: RawWord): Word => {
  const meaningShort = raw.meaning_short ?? "";
  const meaningLong = raw.meaning_long ?? meaningShort;

  return {
    id: raw.id,
    word: raw.word,
    reading: raw.reading ?? "",
    meaning_short: meaningShort,
    meaning_long: meaningLong,
    synonyms: toStringArray(raw.synonyms),
    antonyms: toStringArray(raw.antonyms),
    example: raw.example ?? "",
    difficulty: raw.difficulty,
    tags: toStringArray(raw.tags),
    quiz_synonyms: normalizeQuizSet(raw.quiz_synonyms),
    quiz_antonyms: normalizeQuizSet(raw.quiz_antonyms)
  };
};

export const normalizeWords = (rawWords: RawWord[]): Word[] =>
  rawWords.map((word) => normalizeWord(word));
