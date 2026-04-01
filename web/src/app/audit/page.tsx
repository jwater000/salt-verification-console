import Link from "next/link";
import { loadFrozenManifest, loadModelEvalManifest } from "@/lib/data";

const AUDIT_STEPS = [
  {
    href: "/audit/reproduce",
    title: "Reproduce",
    body: "같은 코드와 같은 데이터로 실행했을 때 같은 산출 경로가 나오는지 확인할 수 있다.",
  },
  {
    href: "/snapshots",
    title: "Snapshots",
    body: "현재 공개 기준이 되는 frozen dataset과 linked run 집계를 확인할 수 있다.",
  },
  {
    href: "/runs",
    title: "Runs",
    body: "실행 명령, verdict, artifact hash를 따라가며 provenance를 점검할 수 있다.",
  },
  {
    href: "/audit/sources",
    title: "Sources",
    body: "외부 공개 데이터와 참조 문헌의 출처 목록을 확인할 수 있다.",
  },
] as const;

const PRINCIPLES = [
  "결과와 함께 계산 경로를 같이 확인할 수 있게 정리한다",
  "frozen dataset 기준이 바뀌면 snapshot 버전이 함께 바뀐다",
  "같은 데이터, 같은 식, 같은 판정 규칙이 재현의 최소 조건이다",
  "검증 대기 가설은 결과판에 섞지 않는다",
];

export default async function AuditPage() {
  const [frozen, manifest] = await Promise.all([loadFrozenManifest(), loadModelEvalManifest()]);

  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-amber-500/20 bg-[linear-gradient(135deg,#1d1206_0%,#020617_65%,#111827_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Audit</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          재현 경로와 감사 자료를
          <br />
          함께 모아 둔 영역
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          Audit 섹션에는 사용된 데이터, 코드, 잠금 규칙, provenance 자료가 함께 정리되어 있다.
          결과 집계와 별도로 산출 과정을 따라가려는 방문자를 위한 참고 영역이다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-500/20 bg-slate-950/45 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Frozen Dataset</p>
          <p className="mt-2 font-mono text-sm font-semibold text-slate-100">
            {frozen.dataset_version || "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">{frozen.created_at_utc || "—"}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Pipeline</p>
          <p className="mt-2 text-sm font-semibold text-slate-100">{manifest.pipeline || "run_model_eval"}</p>
          <p className="mt-1 text-xs text-slate-500">공개 결과 산출 기준 파이프라인</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Manifest SHA256</p>
          <p className="mt-2 break-all font-mono text-xs text-slate-200">
            {manifest.frozen.manifest_sha256 || "—"}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          감사 경로
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {AUDIT_STEPS.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="rounded-2xl border border-amber-500/20 bg-slate-950/45 p-5 transition hover:border-amber-400/40"
            >
              <h2 className="text-lg font-bold text-white">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-white">이 영역의 정리 원칙</h2>
          <ul className="mt-5 space-y-3">
            {PRINCIPLES.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-slate-300">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-white">바로 이동</h2>
          <div className="mt-5 space-y-3 text-sm">
            <Link href="/verification/results" className="block text-cyan-300 hover:text-cyan-200">
              판정 결과 보기 →
            </Link>
            <Link href="/verification/pending" className="block text-amber-300 hover:text-amber-200">
              검증 대기 항목 보기 →
            </Link>
            <Link href="/guide" className="block text-slate-300 hover:text-white">
              전체 사이트 가이드 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
