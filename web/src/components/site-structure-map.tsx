"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppViewerSession } from "@/lib/auth/session";

const NAV_ITEMS = [
  {
    path: "/guide",
    label: "가이드",
    desc: "읽기 순서 안내",
    links: [
      { href: "/guide", label: "가이드", note: "전체 읽기 순서 안내" },
      { href: "/core", label: "핵심 이론", note: "주요 개념부터 확인" },
      { href: "/reference/faq", label: "FAQ", note: "자주 나오는 질문 정리" },
    ],
  },
  {
    path: "/core",
    label: "핵심 이론",
    desc: "이론 구조와 장별 압축",
    links: [
      { href: "/core", label: "핵심 이론 개요", note: "핵심 개념 요약" },
      { href: "/core/logic-map", label: "논리 지도", note: "문제에서 검증까지의 구조" },
      { href: "/core/chapters", label: "장별 인덱스", note: "17·18·19장 허브" },
      { href: "/core/chapters/17", label: "17장", note: "이론의 토대" },
      { href: "/core/chapters/18", label: "18장", note: "검증 채널과 판정" },
      { href: "/core/chapters/19", label: "19장", note: "공학적 함의" },
    ],
  },
  {
    path: "/verification",
    label: "검증",
    desc: "검증 자료와 판정",
    links: [
      { href: "/verification", label: "검증 개요", note: "검증 자료 구성" },
      { href: "/verification/channels", label: "채널 인덱스", note: "고정 채널 인덱스" },
      { href: "/verification/results", label: "판정 결과", note: "집계 결과와 판정" },
      { href: "/verification/pending", label: "검증 대기", note: "검증 대기 항목" },
      { href: "/verification/candidate-hypotheses", label: "후보 가설", note: "잠금 전 가설 목록" },
    ],
  },
  {
    path: "/engineering",
    label: "공학적 함의",
    desc: "공학적 함의와 응용 가능성",
    links: [
      { href: "/engineering", label: "공학적 함의", note: "기술적 해석과 가설" },
      { href: "/verification", label: "검증", note: "관련 검증 자료" },
      { href: "/reference/visual-atlas", label: "시각 자료", note: "관련 도해 참고" },
    ],
  },
  {
    path: "/reference",
    label: "참고 자료",
    desc: "도해 · 용어 · 책-웹 대응",
    links: [
      { href: "/reference", label: "참고 자료", note: "참고 자료 모음" },
      { href: "/reference/visual-atlas", label: "시각 자료", note: "도해 모음" },
      { href: "/reference/glossary", label: "용어집", note: "용어 정리" },
      { href: "/reference/book-map", label: "책-웹 대응표", note: "책과 웹 구조 대응" },
    ],
  },
  {
    path: "/audit",
    label: "감사/재현",
    desc: "재현 경로와 provenance",
    links: [
      { href: "/audit", label: "감사/재현", note: "감사 자료 개요" },
      { href: "/audit/reproduce", label: "재현 절차", note: "재현 절차" },
      { href: "/audit/comments", label: "댓글 관리", note: "댓글 운영 관리" },
      { href: "/runs", label: "실행 이력", note: "실행 provenance" },
      { href: "/snapshots", label: "스냅샷", note: "dataset snapshot" },
    ],
  },
] as const;

type SiteStructureMapProps = {
  viewer: AppViewerSession | null;
  authConfigured: boolean;
};

export default function SiteStructureMap({ viewer, authConfigured }: SiteStructureMapProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex h-12 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-slate-100 hover:text-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded bg-cyan-500/20 text-[10px] font-bold text-cyan-300">
              S
            </span>
            <span>물리학에 시공간은 없다</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.path || pathname.startsWith(item.path + "/");
              return (
                <div key={item.path} className="group relative">
                  <Link
                    href={item.path}
                    className={`rounded-md px-3 py-1.5 text-sm transition-all duration-150 ${
                      active
                        ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </Link>

                  <div className="pointer-events-none invisible absolute left-0 top-full z-30 w-72 translate-y-2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.45)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">{item.label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                      <div className="mt-4 space-y-2">
                        {item.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 transition hover:border-slate-600 hover:bg-slate-900/70"
                          >
                            <p className="text-sm font-medium text-slate-100">{link.label}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{link.note}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {authConfigured ? (
              viewer ? (
                <>
                  <span className="max-w-[220px] truncate text-xs text-slate-400">
                    {viewer.displayName} · {viewer.role}
                  </span>
                  <a
                    href={`/api/auth/signout?callbackUrl=${encodeURIComponent(pathname || "/")}`}
                    className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
                  >
                    로그아웃
                  </a>
                </>
              ) : (
                <a
                  href={`/api/auth/signin?callbackUrl=${encodeURIComponent(pathname || "/")}`}
                  className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  로그인
                </a>
              )
            ) : (
              <span className="text-xs text-slate-500">auth not configured</span>
            )}
            <span className="text-xs text-slate-500">{pathname}</span>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.path || pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs transition-all duration-150 ${
                  active
                    ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
