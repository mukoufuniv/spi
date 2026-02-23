"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { RawWord, Word } from "@/lib/types";
import { normalizeWords } from "@/lib/word-utils";
import wordsData from "@/data/words.json";

type Question = {
  correct: string;
  options: string[];
};

const words = normalizeWords(wordsData as RawWord[]);

const shuffle = <T,>(items: T[]): T[] => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const buildQuestion = (word: Word, allWords: Word[]): Question => {
  const provided = word.quiz_antonyms;
  const fallbackCandidates = word.antonyms.length > 0 ? word.antonyms : [word.word];
  const fallbackCorrect =
    fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)];
  const correct = provided?.correct ?? fallbackCorrect;

  const antonymPool = allWords
    .filter((item) => item.id !== word.id)
    .flatMap((item) => (item.antonyms.length > 0 ? item.antonyms : [item.word]));

  const uniquePool = Array.from(new Set(antonymPool)).filter(
    (item) => item !== correct
  );

  const optionSet = new Set<string>([correct]);
  if (provided) {
    for (const candidate of provided.distractors) {
      optionSet.add(candidate);
    }
  }
  for (const candidate of shuffle(uniquePool)) {
    optionSet.add(candidate);
    if (optionSet.size >= 4) break;
  }

  if (optionSet.size < 4) {
    for (const candidate of allWords
      .filter((item) => item.id !== word.id)
      .map((item) => item.word)) {
      optionSet.add(candidate);
      if (optionSet.size >= 4) break;
    }
  }

  while (optionSet.size < 4) {
    optionSet.add(`選択肢${optionSet.size + 1}`);
  }

  let options = shuffle(Array.from(optionSet));
  if (options.length > 4) {
    const trimmed = options.filter((option) => option !== correct).slice(0, 3);
    options = shuffle([correct, ...trimmed]);
  }

  return {
    correct,
    options
  };
};

export default function AntonymQuizPage() {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState<Question | null>(() =>
    words.length > 0 ? buildQuestion(words[0], words) : null
  );
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (words.length === 0) return;
    setQuestion(buildQuestion(words[index], words));
    setSelected(null);
  }, [index]);

  if (words.length === 0 || !question) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10">
        <Link
          href="/"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← ホームに戻る
        </Link>
        <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft">
          <h1 className="text-2xl font-bold">単語が登録されていません</h1>
          <p className="mt-2 text-sm text-slate-600">
            data/words.json を確認してください。
          </p>
        </div>
      </main>
    );
  }

  const word = words[index];
  const progress = `${index + 1} / ${words.length}`;
  const showResult = selected !== null;
  const meaningShort = word.meaning_short || word.meaning_long || "意味は準備中";

  const goNext = () => {
    setIndex((prev) => Math.min(prev + 1, words.length - 1));
  };

  const goPrev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← ホームに戻る
        </Link>
        <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-soft">
          {progress}
        </div>
      </header>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-sm text-slate-500">問題</p>
            <h1 className="text-3xl font-bold sm:text-4xl">{word.word}</h1>
            <p className="mt-1 text-base text-slate-500">{word.reading}</p>
          </div>
          <div className="text-xs font-medium text-slate-500">対義語4択</div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          次の語の対義語として最も近いものを選んでください。
        </div>
      </section>

      <section className="grid gap-3">
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((option) => {
            const isSelected = selected === option;
            const isCorrect = question.correct === option;
            const baseClass =
              "rounded-2xl px-3 py-4 text-sm font-semibold shadow-soft transition";

            let stateClass = "bg-white/90 text-slate-700 hover:-translate-y-0.5";

            if (showResult) {
              if (isCorrect) {
                stateClass = "bg-emerald-500 text-white";
              } else if (isSelected) {
                stateClass = "bg-rose-500 text-white";
              } else {
                stateClass = "bg-white/70 text-slate-500";
              }
            }

            return (
              <button
                key={option}
                type="button"
                disabled={showResult}
                onClick={() => setSelected(option)}
                className={`${baseClass} ${stateClass} ${showResult ? "cursor-not-allowed" : ""}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="rounded-2xl bg-white/80 px-4 py-3 text-center text-sm font-medium text-slate-600 shadow-soft">
            {selected === question.correct ? "正解！" : "不正解"} 正解: {question.correct}
            <div className="mt-1 text-xs text-slate-500">{meaningShort}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            前へ
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={index === words.length - 1}
            className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            次へ
          </button>
        </div>
      </section>
    </main>
  );
}
