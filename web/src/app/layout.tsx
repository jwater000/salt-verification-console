import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./markdown.css";
import { loadFrozenManifest } from "@/lib/data";
import SiteStructureMap from "@/components/site-structure-map";

export const metadata: Metadata = {
  title: "SALT 검증 · 설명 콘솔",
  description: "SALT의 핵심 주장, 검증 결과, 재현 경로, 기술적 함의를 웹에 맞게 재구성한 설명형 콘솔.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const frozen = await loadFrozenManifest();

  return (
    <html lang="en">
      <body className="antialiased">
        {/* Frozen dataset micro-bar */}
        <div className="border-b border-slate-800/60 bg-slate-950/80 px-6 py-1 text-[11px] text-slate-500">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <span>
              frozen dataset: <span className="font-mono text-slate-400">{frozen.dataset_version || "—"}</span>
              {" / "}
              <span className="font-mono text-slate-400">{frozen.created_at_utc || "—"}</span>
            </span>
            <Link href="/notice" className="text-amber-400/80 hover:text-amber-300">
              공지 보기
            </Link>
          </div>
        </div>
        <SiteStructureMap />
        <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
