export type RawWord = {
  id: string;
  word: string;
  reading?: string;
  meaning_short?: string;
  meaning_long?: string;
  synonyms?: string[];
  antonyms?: string[];
  example?: string;
  difficulty?: number;
  tags?: string[];
  quiz_synonyms?: RawQuizSet;
  quiz_antonyms?: RawQuizSet;
};

export type RawQuizSet = {
  correct?: string;
  distractors?: string[];
};

export type Word = {
  id: string;
  word: string;
  reading: string;
  meaning_short: string;
  meaning_long: string;
  synonyms: string[];
  antonyms: string[];
  example: string;
  difficulty?: number;
  tags: string[];
  quiz_synonyms?: QuizSet;
  quiz_antonyms?: QuizSet;
};

export type QuizSet = {
  correct: string;
  distractors: string[];
};

export type SelfRating = 0 | 1 | 2;

export type Attempt = {
  wordId: string;
  mode: "memorize";
  selfRating: SelfRating;
  answeredAt: string;
};
