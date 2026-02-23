import Link from "next/link";
import { getWords } from "@/lib/words";

export default async function WordsPage() {
  const words = await getWords();

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
          <h1 className="text-2xl font-bold sm:text-3xl">単語一覧</h1>
          <p className="mt-2 text-sm text-slate-600">
            登録語数: {words.length} 語
          </p>
        </div>
      </header>

      <section className="grid gap-4">
        {words.map((word) => (
          <Link
            key={word.id}
            href={`/words/${word.id}`}
            className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold">{word.word}</h2>
                <p className="text-sm text-slate-500">{word.reading}</p>
              </div>
              <div className="text-xs font-medium text-slate-500">
                類義語 {word.synonyms.length} / 対義語 {word.antonyms.length}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              {word.meaning_short || word.meaning_long || "意味は準備中"}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
