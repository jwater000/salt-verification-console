"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const TOP_LEVEL = [
  { path: "/evaluation", title: "결론 Results", subtitle: "SALT vs 표준이론 승/무/패" },
  { path: "/evidence", title: "근거 Evidence", subtitle: "실측 vs SM/ΛCDM vs SALT 비교" },
  { path: "/audit/reproduce", title: "재현 Reproduce", subtitle: "동일 데이터/동일 식/동일 판정 재실행" },
];

export default function SiteStructureMap() {
  const pathname = usePathname();

  return (
    <section className="border-b border-slate-800 bg-slate-950/85 px-6 py-3">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            SALT Verification Console
          </p>
          <p className="text-xs text-cyan-300">현재 경로: {pathname}</p>
        </div>
        <p className="mb-2 text-[11px] text-slate-400">
          목적: SALT가 표준이론(거시: ΛCDM, 미시: SM) 대비 예측력에서 밀리지 않는지 검증
        </p>

        <div className="hidden items-center gap-2 md:flex">
          {TOP_LEVEL.map((page, i) => {
            const active = pathname.startsWith(page.path.split("/")[1] ? `/${page.path.split("/")[1]}` : page.path);
            return (
              <div key={page.path} className="flex min-w-0 flex-1 items-center gap-2">
                <Link
                  href={page.path}
                  className={`block flex-1 rounded-lg border p-3 text-xs transition ${
                    active
                      ? "border-cyan-500 bg-cyan-950/40"
                      : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
                  }`}
                >
                  <p className="font-semibold text-slate-100">{page.title}</p>
                  <p className="mt-1 text-slate-400">{page.subtitle}</p>
                </Link>
                {i < TOP_LEVEL.length - 1 ? (
                  <div className="shrink-0 text-slate-500" aria-hidden="true">
                    <svg viewBox="0 0 60 20" className="h-5 w-12">
                      <line x1="2" y1="10" x2="52" y2="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M52 10 L46 6 M52 10 L46 14" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="grid gap-2 md:hidden">
          {TOP_LEVEL.map((page, i) => {
            const active = pathname.startsWith(page.path.split("/")[1] ? `/${page.path.split("/")[1]}` : page.path);
            return (
              <div key={page.path}>
                <Link
                  href={page.path}
                  className={`block rounded-lg border p-3 text-xs transition ${
                    active
                      ? "border-cyan-500 bg-cyan-950/40"
                      : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
                  }`}
                >
                  <p className="font-semibold text-slate-100">{page.title}</p>
                  <p className="mt-1 text-slate-400">{page.subtitle}</p>
                </Link>
                {i < TOP_LEVEL.length - 1 ? (
                  <p className="py-1 text-center text-xs text-slate-500" aria-hidden="true">
                    ↓
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <span>원칙: 공개 판정은 Evaluation(frozen) 기준으로만 산출</span>
          <Link href="/audit/sources" className="text-cyan-300 hover:underline">
            출처 공개
          </Link>
          <Link href="/audit/formulas" className="text-cyan-300 hover:underline">
            예측식 공개
          </Link>
        </div>
      </div>
    </section>
  );
}
