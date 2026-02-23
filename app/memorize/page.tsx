"use client";

import { useState } from "react";
import Link from "next/link";
import type { RawWord, SelfRating, Word } from "@/lib/types";
import { saveAttempt } from "@/lib/storage";
import { normalizeWords } from "@/lib/word-utils";
import wordsData from "@/data/words.json";

const ratingLabels: Record<SelfRating, string> = {
  2: "覚えてる",
  1: "あいまい",
  0: "覚えてない"
};

export default function MemorizePage() {
  const words = normalizeWords(wordsData as RawWord[]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lastRating, setLastRating] = useState<SelfRating | null>(null);

  if (words.length === 0) {
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
  const meaningShort = word.meaning_short || "意味は準備中";
  const meaningLong =
    word.meaning_long || word.meaning_short || "詳細は準備中";
  const example = word.example || "例文は準備中";
  const progress = `${index + 1} / ${words.length}`;

  const goNext = () => {
    setIndex((prev) => Math.min(prev + 1, words.length - 1));
    setShowAnswer(false);
    setLastRating(null);
  };

  const goPrev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
    setShowAnswer(false);
    setLastRating(null);
  };

  const handleRating = (rating: SelfRating) => {
    saveAttempt({
      wordId: word.id,
      mode: "memorize",
      selfRating: rating,
      answeredAt: new Date().toISOString()
    });
    setLastRating(rating);
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
            <p className="text-sm text-slate-500">単語</p>
            <h1 className="text-3xl font-bold sm:text-4xl">{word.word}</h1>
            <p className="mt-1 text-base text-slate-500">{word.reading}</p>
          </div>
          <div className="text-xs font-medium text-slate-500">暗記モード</div>
        </div>

        {!showAnswer ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            答えを見ると意味や例文が表示されます。
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-semibold text-slate-500">要点</p>
              <p className="mt-2 text-lg font-semibold text-slate-800">
                {meaningShort}
              </p>
              <p className="mt-2 text-sm text-slate-600">{meaningLong}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-slate-500">類義語</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {word.synonyms.length > 0 ? (
                    word.synonyms.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">なし</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">対義語</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {word.antonyms.length > 0 ? (
                    word.antonyms.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">なし</span>
                  )}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">例文</p>
              <p className="mt-2 text-sm text-slate-600">{example}</p>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-3">
        <button
          type="button"
          onClick={() => setShowAnswer((prev) => !prev)}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-slate-800"
        >
          {showAnswer ? "答えを隠す" : "答えを見る"}
        </button>

        <div className="grid grid-cols-3 gap-2">
          {([2, 1, 0] as SelfRating[]).map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRating(rating)}
              disabled={!showAnswer}
              className={`rounded-2xl px-2 py-3 text-sm font-semibold shadow-soft transition ${
                rating === 2
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : rating === 1
                  ? "bg-amber-400 text-amber-900 hover:bg-amber-500"
                  : "bg-rose-500 text-white hover:bg-rose-600"
              } ${!showAnswer ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {ratingLabels[rating]}
            </button>
          ))}
        </div>

        {lastRating !== null && (
          <div className="rounded-2xl bg-white/80 px-4 py-2 text-center text-xs font-medium text-slate-600 shadow-soft">
            「{ratingLabels[lastRating]}」で記録しました。
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
