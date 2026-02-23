"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Attempt, RawWord, SelfRating, Word } from "@/lib/types";
import { loadAttempts } from "@/lib/storage";
import { normalizeWords } from "@/lib/word-utils";
import wordsData from "@/data/words.json";

const ratingLabels: Record<SelfRating, string> = {
  2: "覚えてる",
  1: "あいまい",
  0: "覚えてない"
};

const words = normalizeWords(wordsData as RawWord[]);

const toDateKey = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toDateString();
};

export default function ProgressPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    setAttempts(loadAttempts());
  }, []);

  const stats = useMemo(() => {
    const ratingCounts: Record<SelfRating, number> = { 2: 0, 1: 0, 0: 0 };
    const todayKey = new Date().toDateString();
    let todayCount = 0;
    let latestAnswer = 0;

    const perWord = new Map<string, { low: number; total: number }>();

    attempts.forEach((attempt) => {
      ratingCounts[attempt.selfRating] += 1;

      const dateKey = toDateKey(attempt.answeredAt);
      if (dateKey === todayKey) {
        todayCount += 1;
      }

      const time = new Date(attempt.answeredAt).getTime();
      if (!Number.isNaN(time)) {
        latestAnswer = Math.max(latestAnswer, time);
      }

      const entry = perWord.get(attempt.wordId) ?? { low: 0, total: 0 };
      entry.total += 1;
      if (attempt.selfRating <= 1) {
        entry.low += 1;
      }
      perWord.set(attempt.wordId, entry);
    });

    const wordMap = new Map(words.map((word) => [word.id, word.word]));
    const weakWords = Array.from(perWord.entries())
      .map(([wordId, { low, total }]) => ({
        wordId,
        word: wordMap.get(wordId) ?? wordId,
        low,
        total
      }))
      .filter((item) => item.low > 0)
      .sort((a, b) => b.low - a.low || b.total - a.total)
      .slice(0, 5);

    const total = attempts.length;
    const strongRate = total > 0 ? Math.round((ratingCounts[2] / total) * 100) : 0;
    const latest = latestAnswer ? new Date(latestAnswer) : null;

    const recentAttempts = [...attempts]
      .sort(
        (a, b) =>
          new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime()
      )
      .slice(0, 5)
      .map((attempt) => ({
        ...attempt,
        word: wordMap.get(attempt.wordId) ?? attempt.wordId
      }));

    return {
      total,
      todayCount,
      ratingCounts,
      strongRate,
      latest,
      weakWords,
      recentAttempts
    };
  }, [attempts]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="space-y-3">
        <Link
          href="/"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← ホームに戻る
        </Link>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">学習記録</h1>
          <p className="mt-2 text-sm text-slate-600">
            暗記モードの自己評価履歴を集計しています。
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft">
          <p className="text-xs font-semibold text-slate-500">今日の学習回数</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {stats.todayCount}
          </p>
          <p className="mt-2 text-xs text-slate-500">※ 端末内の記録のみ</p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft">
          <p className="text-xs font-semibold text-slate-500">覚えてる率</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {stats.strongRate}%
          </p>
          <p className="mt-2 text-xs text-slate-500">
            総記録数: {stats.total}
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {([2, 1, 0] as SelfRating[]).map((rating) => (
          <div
            key={rating}
            className="rounded-2xl border border-white/70 bg-white/80 p-4 text-center shadow-soft"
          >
            <p className="text-xs font-semibold text-slate-500">
              {ratingLabels[rating]}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {stats.ratingCounts[rating]}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <h2 className="text-sm font-semibold text-slate-500">苦手になりやすい単語</h2>
        {stats.weakWords.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            まだ記録がありません。暗記モードで記録を増やしましょう。
          </p>
        ) : (
          <div className="mt-3 grid gap-2">
            {stats.weakWords.map((item) => (
              <div
                key={item.wordId}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="font-medium text-slate-700">{item.word}</span>
                <span className="text-xs text-slate-500">
                  低評価 {item.low} / 記録 {item.total}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <h2 className="text-sm font-semibold text-slate-500">最近の記録</h2>
        {stats.recentAttempts.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">記録がありません。</p>
        ) : (
          <div className="mt-3 grid gap-2">
            {stats.recentAttempts.map((attempt) => (
              <div
                key={`${attempt.wordId}-${attempt.answeredAt}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="font-medium text-slate-700">{attempt.word}</span>
                <span className="text-xs text-slate-500">
                  {ratingLabels[attempt.selfRating]} / {attempt.answeredAt}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-2">
        <Link
          href="/memorize"
          className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800"
        >
          暗記モードへ
        </Link>
        <Link
          href="/words"
          className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          単語一覧へ
        </Link>
      </section>
    </main>
  );
}
