"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    path: "/",
    label: "소개",
    desc: "SALT의 핵심 관점과 현재 공개 검증 상태를 먼저 소개하는 입문 허브",
    links: [
      { href: "/", label: "소개", note: "SALT의 기본 관점과 검증 개요" },
      { href: "/core", label: "핵심 아이디어", note: "상태변수와 논리 전환" },
      { href: "/verification", label: "내용 검증", note: "공개 비교 결과와 채널 읽기" },
    ],
  },
  {
    path: "/core",
    label: "핵심 아이디어",
    desc: "SALT가 무엇을 새롭게 읽는지 이야기 순서로 따라가는 핵심 허브",
    links: [
      { href: "/core", label: "핵심 아이디어 개요", note: "문제의식과 중심 전환" },
      { href: "/core/logic-map", label: "논리 지도", note: "문제에서 검증으로 이어지는 흐름" },
      { href: "/core/chapters", label: "장별 인덱스", note: "17·18·19장 중심 허브" },
      { href: "/engineering", label: "왜 중요한가", note: "공학적 함의와 해석 확장" },
    ],
  },
  {
    path: "/verification",
    label: "내용 검증",
    desc: "무엇이 어떻게 비교되었는지, 그리고 어디까지 재현 가능한지 확인하는 후면 허브",
    links: [
      { href: "/verification", label: "검증 개요", note: "무엇을 비교하는지 먼저 보기" },
      { href: "/verification/results", label: "판정 결과", note: "현재 공개된 비교 결과" },
      { href: "/verification/pending", label: "검증 대기", note: "아직 잠기지 않은 항목" },
      { href: "/audit", label: "감사 자료", note: "재현 절차와 provenance" },
      { href: "/runs", label: "실행 이력", note: "run provenance" },
    ],
  },
  {
    path: "/reference",
    label: "참고자료",
    desc: "책-웹 대응, 용어, FAQ, 도해로 이해를 안정화하는 보조 허브",
    links: [
      { href: "/reference", label: "참고자료 개요", note: "이해 보조 허브" },
      { href: "/reference/book-map", label: "책-웹 대응표", note: "책과 웹 구조 대응" },
      { href: "/reference/glossary", label: "용어집", note: "용어 정리" },
      { href: "/reference/faq", label: "FAQ", note: "자주 생기는 오해 정리" },
      { href: "/reference/visual-atlas", label: "시각 자료", note: "도해와 그래프 흐름" },
    ],
  },
  {
    path: "/discussion",
    label: "게시판",
    desc: "방문자 질문, 독서 메모, 해석을 주제형으로 모으는 공개 대화 공간",
    links: [
      { href: "/discussion", label: "게시판 개요", note: "공개 토론과 질문 읽기" },
      { href: "/", label: "소개", note: "토론 전 SALT 기본 관점 확인" },
      { href: "/audit/comments", label: "운영 관리", note: "moderation 및 신고 관리" },
    ],
  },
] as const;

type SiteStructureMapProps = {
  authConfigured: boolean;
};

export default function SiteStructureMap({ authConfigured }: SiteStructureMapProps) {
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
              <a
                href={`/api/auth/signin?callbackUrl=${encodeURIComponent(pathname || "/")}`}
                className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                로그인
              </a>
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
