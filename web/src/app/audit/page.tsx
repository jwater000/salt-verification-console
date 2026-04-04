import { loadFrozenManifest, loadModelEvalManifest } from "@/lib/frozen-data";
import CommentsPanel from "@/components/comments-panel";
import NextSteps from "@/components/next-steps";

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
          Audit은 재현 경로와 감사 자료를 위한 허브이며, 결과 집계의 공식 허브를 대신하지 않는다.
          판정 결과는 Verification에서, 사이트 입문 흐름은 Guide에서 따로 본다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            재현 · provenance 허브
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            판정 결과는 Verification
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            입문 안내는 Guide
          </span>
        </div>
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
          <h2 className="text-sm font-semibold text-white">재현에 필요한 3요소</h2>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-100">1. 잠긴 기준</p>
              <p className="mt-1 text-sm text-slate-400">
                어느 frozen dataset과 어떤 판정 규칙을 기준으로 결과가 공개됐는지 먼저 확인한다.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">2. 실행 provenance</p>
              <p className="mt-1 text-sm text-slate-400">
                run, snapshot, manifest hash를 따라가며 산출물이 어떤 파이프라인에서 나왔는지 본다.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">3. 입력 출처</p>
              <p className="mt-1 text-sm text-slate-400">
                외부 공개 데이터와 참고 문헌의 출처가 결과와 어떤 관계로 연결되는지 확인한다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <NextSteps
        title="감사 자료 더 보기"
        steps={[
          {
            href: "/audit/reproduce",
            title: "Reproduce",
            body: "같은 코드와 같은 데이터로 같은 산출 경로가 나오는지 재현 절차를 확인한다.",
          },
          {
            href: "/runs",
            title: "Runs",
            body: "실행 단위의 verdict, artifact hash, provenance 상세를 추적한다.",
          },
          {
            href: "/audit/sources",
            title: "Sources",
            body: "외부 공개 데이터와 참조 문헌의 계보를 출처 단위로 확인한다.",
          },
        ]}
      />

      <CommentsPanel
        pagePath="/audit"
        description="재현 경로, provenance, frozen 기준에서 더 확인이 필요한 지점을 남길 수 있도록 준비 중입니다."
      />
    </section>
  );
}
