import Link from "next/link";
import CommentsPanel from "@/components/comments-panel";

const PENDING_ITEMS = [
  {
    id: "P1",
    title: "양자 확률성 재해석",
    verified: "양자역학의 확률적 예측은 실험적으로 매우 정밀하게 검증되어 있다.",
    hypothesis: "SALT는 확률성을 보셀 상태 갱신과 내부 위상 재배열의 통계적 결과로 해석한다.",
    prediction: "같은 관측 채널에서 ρ 와 n = ρ² 를 구분하면 측정 해석 일관성이 높아져야 한다.",
    rows: [
      { item: "보셀 상태 갱신", status: "검증 대기", missing: "직접 대응하는 공개 관측량 정의 필요" },
      { item: "내부 위상 재배열", status: "검증 대기", missing: "채널별 추출 규칙과 판정식 필요" },
      { item: "ρ vs n 분리", status: "검증 대기", missing: "동일 데이터에서 두 해석 성능 비교 규칙 필요" },
      { item: "−∇μ 축 매핑", status: "검증 대기", missing: "공개 데이터 열과의 운영형 매핑 필요" },
    ],
  },
  {
    id: "P2",
    title: "질량의 형성과 해방",
    verified: "질량-에너지 등가는 핵반응과 입자물리 관측 결과에서 반복 검증되었다.",
    hypothesis: "SALT는 질량을 보셀 매질의 고밀도 고착 상태로 해석한다.",
    prediction: "질량 형성 / 해방 채널에서 위상과 밀도 상태변수의 추적 가능성이 높아야 한다.",
    rows: [
      { item: "질량 형성 채널", status: "검증 대기", missing: "고밀도 고착 상태를 직접 읽는 관측량과 score 정의 필요" },
      { item: "질량 해방 채널", status: "검증 대기", missing: "에너지 방출과 위상/밀도 상태변수 함께 추적하는 비교 규칙 필요" },
      { item: "위상·밀도 상태변수 추적", status: "검증 대기", missing: "형성 전후 상태를 같은 채널에서 이어 읽는 운영형 매핑 필요" },
    ],
  },
  {
    id: "P3",
    title: "중력의 보편성과 유효 경사도",
    verified: "자유낙하, 중력렌즈, 시간지연은 중력의 보편성을 지지한다.",
    hypothesis: "SALT는 이를 유효 경사도에 따른 공간 흐름으로 해석한다.",
    prediction: "동일 변수 집합 (n, μ)으로 낙하·렌즈·전파지연을 교차 설명할 수 있어야 한다.",
    rows: [
      { item: "자유낙하 / 궤적", status: "검증 대기", missing: "유효 경사도와 관측 궤적을 직접 비교하는 운영형 예측식 필요" },
      { item: "시간지연 / 적색편이", status: "부분 검증", missing: "frozen 채널 있으나 n, μ 교차식은 미완성" },
      { item: "중력렌즈 / 렌즈 지연", status: "검증 대기", missing: "25장 13.2~13.4 식과 27장 운영 잠금 연결 필요" },
    ],
  },
  {
    id: "P4",
    title: "강력과 핵력의 분리",
    verified: "쿼크 가둠, 점근적 자유, 핵자 결합은 표준 핵입자 물리에서 정립된 축이다.",
    hypothesis: "SALT는 강력을 위상 잠금, 핵력을 잔류 유효 결속으로 해석한다.",
    prediction: "핵자 내부와 핵자 간 관측 채널에서 서로 다른 스케일 법칙이 나와야 한다.",
    rows: [
      { item: "핵자 내부 채널", status: "검증 대기", missing: "위상 잠금 구조와 내부 결속 스케일 비교 운영형 예측식 필요" },
      { item: "핵자 간 채널", status: "검증 대기", missing: "잔류 유효 결속과 거리/에너지 스케일 법칙 비교 규칙 필요" },
      { item: "고에너지 결속/분해 패턴", status: "검증 대기", missing: "충돌 데이터에서 결속과 분해 패턴을 채점하는 score 정의 필요" },
    ],
  },
];

const FORMULAS_READY = [
  { formula: "n = ρ²", desc: "밀도형 상태량" },
  { formula: "μ = ∂U/∂n", desc: "장력 퍼텐셜 국소 기울기" },
  { formula: "g_eff ∝ −∇μ", desc: "정적 흐름의 유효 구동 축" },
  { formula: "−∇ρ (저차 근사)", desc: "낮은 밀도 구간 근사식" },
  { formula: "σ > σ_c, W ≠ 0, τ_relax ≫ T_obs", desc: "질량화 임계 조건" },
  { formula: "c_eff(ρ)", desc: "유효 광속 — 거시 채널 연결식" },
];

const FORMULAS_NEEDED = [
  "상대론·양자 채널을 같은 변수로 끝까지 채점하는 운영형 예측식",
  "공개 데이터 열에서 ρ, θ, L, μ를 읽는 매핑식",
  "ρ 와 n = ρ² 를 동일 데이터에서 직접 비교하는 판정 규칙",
  "−∇μ 를 관측 지표와 연결하는 실무형 계산식",
  "양자 확률성 재해석을 frozen 파이프라인으로 채점하는 score 정의",
];

const FALSIFICATION = [
  {
    condition: "강중력장 시간 지연 / 적색편이",
    failure: "공간 밀도 지표와 시간 지연이 통계적으로 상관되지 않을 때",
    status: "부분 검증 진행 중",
    note: "강중력장 운영식 미완성",
  },
  {
    condition: "유효 경사도와 중력 경로",
    failure: "예측 흐름 경로와 관측 궤적이 체계적으로 불일치할 때",
    status: "검증 대기",
    note: "경사도-궤적 운영형 예측식 필요",
  },
  {
    condition: "위상 잠금 기반 강력 해석",
    failure: "고에너지 충돌 데이터의 결속/분해 패턴을 재현하지 못할 때",
    status: "검증 대기",
    note: "직접 score 정의와 비교식 없음",
  },
];

export default function VerificationPendingPage() {
  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="panel px-8 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Verification · Pending
          </p>
          <span className="badge-pending">검증 대기</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white">
          아직 계산되지 않은 이유를
          <br />
          드러내는 질문들
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-300">
          결과가 없다는 말은 때로 공백처럼 들리지만, 사실은 가장 솔직한 상태이기도 하다. 여기 있는 항목들은
          아이디어는 선명하지만 아직 관측량 매핑, 판정식, 데이터 열이 하나의 운영 규칙으로 잠기지 않았다.
          그래서 지금은 승패보다 부족한 조각이 무엇인지 먼저 보여 준다. 이미 채점된 결과는{" "}
          <Link href="/verification/results" className="text-cyan-400 hover:underline">
            판정 결과
          </Link>에서 확인한다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">1. 생각은 선명하다</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            책과 이론 안에서는 방향이 제시돼 있지만, 아직 운영형 검증 채널로는 완전히 잠기지 않았다.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">2. 시험대가 아직 덜 만들어졌다</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            공개 데이터 열, 비교식, score 규칙, 상태변수 매핑 중 하나 이상이 아직 비어 있다.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">3. 잠기면 결과로 넘어간다</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            필요한 조각이 잠기면 이 항목은 pending에서 results 또는 channels 축으로 이동한다.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Pending Themes</p>
          <p className="mt-2 text-3xl font-bold text-amber-300">{PENDING_ITEMS.length}</p>
          <p className="mt-1 text-xs text-slate-500">큰 가설 묶음 단위</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Ready Formulas</p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">{FORMULAS_READY.length}</p>
          <p className="mt-1 text-xs text-slate-500">이미 제시된 핵심 식</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Missing Pieces</p>
          <p className="mt-2 text-3xl font-bold text-slate-200">{FORMULAS_NEEDED.length}</p>
          <p className="mt-1 text-xs text-slate-500">운영형 매핑/score 공백</p>
        </div>
      </div>

      <div className="panel px-6 py-5">
        <h2 className="mb-4 text-sm font-semibold text-white">대기 상태를 읽는 방법</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Verified</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              기존 물리에서 이미 굳어진 사실이다. SALT는 이 사실을 다른 언어로 다시 설명하려 한다.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Hypothesis</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              SALT가 제안하는 연결 방식이다. 하지만 아직 데이터와 식과 판정 규칙이 하나로 고정되지는 않았다.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Prediction</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              실제 채널이 되려면 공개 데이터 열과 비교식, score 규칙까지 모두 닫혀야 한다.
          </p>
        </div>
      </div>
      </div>

      {/* Pending items */}
      <div className="space-y-6">
        {PENDING_ITEMS.map((item) => (
          <div key={item.id} className="rounded-xl border border-amber-500/15 bg-slate-950/40 p-6">
            <div className="flex items-start gap-3">
              <span className="rounded-lg bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-300">
                {item.id}
              </span>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-emerald-500/15 bg-emerald-950/10 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">검증됨</p>
                <p className="text-xs leading-relaxed text-slate-300">{item.verified}</p>
              </div>
              <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">가설</p>
                <p className="text-xs leading-relaxed text-slate-300">{item.hypothesis}</p>
              </div>
              <div className="rounded-lg border border-amber-500/15 bg-amber-950/10 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-amber-400">예측</p>
                <p className="text-xs leading-relaxed text-slate-300">{item.prediction}</p>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="px-3 py-2 text-slate-500">항목</th>
                    <th className="px-3 py-2 text-slate-500">현재 상태</th>
                    <th className="px-3 py-2 text-slate-500">부족한 것</th>
                  </tr>
                </thead>
                <tbody>
                  {item.rows.map((row) => (
                    <tr key={row.item} className="border-b border-slate-800/50">
                      <td className="px-3 py-2 text-slate-200">{row.item}</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                          row.status === "부분 검증" ? "bg-cyan-500/10 text-cyan-300" : "bg-amber-500/10 text-amber-300"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-400">{row.missing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Formula status */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/20 bg-slate-950/40 p-5">
          <h2 className="mb-4 text-sm font-bold text-white">이미 손에 쥔 식</h2>
          <ul className="space-y-2">
            {FORMULAS_READY.map((f) => (
              <li key={f.formula} className="flex items-start gap-3">
                <code className="shrink-0 rounded bg-emerald-950/50 px-2 py-0.5 text-xs text-emerald-300">
                  {f.formula}
                </code>
                <span className="text-xs text-slate-400">{f.desc}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-500/15 bg-slate-950/40 p-5">
          <h2 className="mb-4 text-sm font-bold text-white">아직 비어 있는 식</h2>
          <ul className="space-y-2">
            {FORMULAS_NEEDED.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="mt-0.5 text-amber-500">—</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Falsification table */}
      <div className="panel px-6 py-6">
        <h2 className="mb-2 text-sm font-bold text-white">SALT는 어디서 틀릴 수 있는가</h2>
        <p className="mb-4 text-xs text-slate-400">
          SALT가 스스로 내놓는 반증 조건. 아래 관측들이 체계적으로 어긋나면 SALT 해석 틀은 약화되거나 폐기된다.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-3 py-2 text-xs font-semibold text-slate-400">반증 조건</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-400">실패 기준</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-400">현재 상태</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {FALSIFICATION.map((row) => (
                <tr key={row.condition} className="border-b border-slate-800/50">
                  <td className="px-3 py-3 text-sm font-medium text-slate-200">{row.condition}</td>
                  <td className="px-3 py-3 text-sm text-slate-400">{row.failure}</td>
                  <td className="px-3 py-3">
                    <p className={`text-xs font-medium ${row.status === "부분 검증 진행 중" ? "text-cyan-300" : "text-amber-300"}`}>
                      {row.status}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{row.note}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-5">
        <Link href="/verification/results" className="text-sm text-slate-400 hover:text-white">← 판정 결과</Link>
        <div className="flex gap-3">
          <Link href="/verification" className="text-sm text-slate-400 hover:text-white">Verification 개요 →</Link>
          <Link href="/audit/reproduce" className="text-sm text-emerald-400 hover:underline">재현 방법 →</Link>
        </div>
      </div>

      <CommentsPanel
        pagePath="/verification/pending"
        description="어떤 가설이 아직 대기 상태인지, 어떤 식과 데이터가 더 필요한지에 대한 질문을 남길 수 있도록 준비 중입니다."
      />
    </section>
  );
}
