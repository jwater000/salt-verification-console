"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const TOP_LEVEL = [
  { path: "/evaluation", title: "Evaluation", subtitle: "Frozen dataset 기반 판정" },
  { path: "/monitoring", title: "Monitoring", subtitle: "GraceDB 실시간 후속 모니터" },
  { path: "/cosmic/overview", title: "Cosmic", subtitle: "LambdaCDM 기준 검증" },
  { path: "/micro/overview", title: "Micro", subtitle: "SM 기준 검증" },
  { path: "/audit", title: "Audit", subtitle: "출처/버전/재현성" },
];

export default function SiteStructureMap() {
  const pathname = usePathname();

  return (
    <section className="border-b border-slate-800 bg-slate-950/85 px-6 py-3">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Site Structure
          </p>
          <p className="text-xs text-cyan-300">현재 경로: {pathname}</p>
        </div>
        <p className="mb-2 text-[11px] text-slate-400">
          표준이론 범위: 거시 `ΛCDM`, 미시 `SM`. `Standard` 단독 표기는 거시 문맥에서만 사용합니다.
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

        <div className="mt-2 text-[11px] text-slate-400">
          분리 원칙: Evaluation(고정 데이터셋) / Monitoring(실시간 피드) / Audit(재현성)
        </div>
      </div>
    </section>
  );
}
