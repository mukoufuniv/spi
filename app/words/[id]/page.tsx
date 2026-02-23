import Link from "next/link";
import { notFound } from "next/navigation";
import { getWordById, getWords } from "@/lib/words";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const words = await getWords();
  return words.map((word) => ({ id: word.id }));
}

export default async function WordDetailPage({ params }: PageProps) {
  const word = await getWordById(params.id);

  if (!word) {
    notFound();
  }

  const meaning = word.meaning_long || word.meaning_short || "意味は準備中";
  const example = word.example || "例文は準備中";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="space-y-3">
        <Link
          href="/words"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← 一覧に戻る
        </Link>
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{word.word}</h1>
          <p className="mt-1 text-base text-slate-500">{word.reading}</p>
        </div>
      </header>

      <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <h2 className="text-sm font-semibold text-slate-500">意味</h2>
        <p className="mt-2 text-base text-slate-700">{meaning}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft">
          <h2 className="text-sm font-semibold text-slate-500">類義語</h2>
          <div className="mt-3 flex flex-wrap gap-2">
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
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft">
          <h2 className="text-sm font-semibold text-slate-500">対義語</h2>
          <div className="mt-3 flex flex-wrap gap-2">
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
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <h2 className="text-sm font-semibold text-slate-500">例文</h2>
        <p className="mt-2 text-base text-slate-700">{example}</p>
      </section>
    </main>
  );
}
