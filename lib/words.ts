import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { RawWord, Word } from "./types";
import { normalizeWords } from "./word-utils";

const dataPath = path.join(process.cwd(), "data", "words.json");

export const getWords = cache(async (): Promise<Word[]> => {
  const raw = await fs.readFile(dataPath, "utf8");
  const words = JSON.parse(raw) as RawWord[];
  return normalizeWords(words);
});

export const getWordById = cache(async (id: string): Promise<Word | undefined> => {
  const words = await getWords();
  return words.find((word) => word.id === id);
});
