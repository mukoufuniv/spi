import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "SPI語彙トレーナー",
  description: "SPI向けの語彙を日本語UIで学ぶミニアプリ"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notoSans.className} min-h-screen bg-mist text-ink`}>
        <div className="min-h-screen bg-gradient-to-br from-sand via-white to-tea">
          {children}
        </div>
      </body>
    </html>
  );
}
