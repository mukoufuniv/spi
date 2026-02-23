import Link from "next/link";
import { getWords } from "@/lib/words";

const menuItems = [
  {
    title: "単語暗記",
    description: "カードで1語ずつ覚える",
    href: "/memorize",
    status: null
  },
  {
    title: "学習記録",
    description: "自己評価の履歴をチェック",
    href: "/progress",
    status: null
  },
  {
    title: "類義語クイズ",
    description: "4択で意味の近い語を確認",
    href: "/quiz/synonym",
    status: null
  },
  {
    title: "対義語クイズ",
    description: "4択で反対語を選ぶ",
    href: "/quiz/antonym",
    status: null
  },
  {
    title: "単語一覧",
    description: "登録語彙を見直して復習",
    href: "/words",
    status: null
  }
] as const;

export default async function Home() {
  const words = await getWords();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-4 py-10">
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm shadow-soft">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>SPI語彙トレーナー</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          1日10分、語彙力を着実に。
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          SPI頻出の日本語語彙を、短時間で反復できるミニ学習アプリです。
          まずは暗記モードでテンポよく復習しましょう。
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="rounded-full bg-white/80 px-3 py-1 shadow-soft">
            登録語数: {words.length} 語
          </div>
          <div className="rounded-full bg-white/80 px-3 py-1 shadow-soft">
            Milestone 5
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {menuItems.map((item) => {
          const cardBase =
            "rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft transition";

          if (item.href) {
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`${cardBase} hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60`}
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                    今すぐ
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </Link>
            );
          }

          return (
            <div
              key={item.title}
              aria-disabled="true"
              className={`${cardBase} opacity-70`}
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <h3 className="text-lg font-semibold">今日の使い方</h3>
        <div className="mt-3 grid gap-2 text-sm text-slate-600">
          <p>1. 暗記モードで1語ずつチェック</p>
          <p>2. 学習記録で苦手語を確認</p>
          <p>3. 類義語クイズで理解を確認</p>
          <p>4. 対義語クイズで反対語も覚える</p>
          <p>5. 一覧で全体像を見直す</p>
        </div>
      </section>
    </main>
  );
}
