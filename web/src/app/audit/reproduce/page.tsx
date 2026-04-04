import Link from "next/link";
import { loadPageMarkdown, markdownToHtml } from "@/lib/markdown";
import { loadModelEvalManifest } from "@/lib/data";

export default async function AuditReproducePage() {
  const md = await loadPageMarkdown("02_재현_방법.md");
  const html = markdownToHtml(md);
  const evalManifest = await loadModelEvalManifest();

  return (
    <section className="space-y-4">
      <article className="panel p-6 text-slate-200">
        <h1 className="text-2xl font-bold text-white">재현 방법</h1>
        <p className="mt-2 text-slate-300">
          이 페이지는 같은 데이터와 같은 코드로 실행했을 때 같은 산출 경로가 나오는지 확인하는 절차를 정리한다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">1단계</p>
            <p className="mt-1 text-sm text-slate-100">평가 파이프라인 실행</p>
          </div>
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">2단계</p>
            <p className="mt-1 text-sm text-slate-100">잠금 해시 검증</p>
          </div>
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">3단계</p>
            <p className="mt-1 text-sm text-slate-100">frozen manifest 검증</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4">
            <p className="text-xs text-cyan-200/80">기본 확인 항목</p>
            <p className="mt-1 text-sm text-cyan-100">3개 명령 실행 + 해시 4종 일치</p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4">
            <p className="text-xs text-emerald-200/80">현재 기준 데이터셋</p>
            <p className="mt-1 text-sm text-emerald-100">{evalManifest.frozen.dataset_version || "-"}</p>
          </div>
        </div>
      </article>
      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">이 페이지의 용도</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          이 페이지는 SALT와 기준선의 비교 결과를 같은 조건에서 다시 따라가 볼 수 있도록 구성되어 있다.
          핵심은 결론의 강도보다 비교 절차와 잠금 조건의 일치 여부를 확인하는 데 있다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">같은 데이터</span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">같은 판정 규칙</span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">같은 코드 버전</span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">같은 해시 검증</span>
        </div>
      </article>
      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">Provenance 보기</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          설명 문서와 함께 현재 공개 snapshot과 연결된 실행 provenance를 바로 따라갈 수 있다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Link
            href="/runs"
            className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-4 transition hover:border-cyan-400"
          >
            <p className="text-xs text-cyan-200/80">Runs</p>
            <p className="mt-1 text-sm font-semibold text-cyan-100">{evalManifest.pipeline || "run_model_eval"}</p>
            <p className="mt-2 text-xs text-slate-400">실행 명령, verdict, artifact hash 확인</p>
          </Link>
          <Link
            href="/snapshots"
            className="rounded-lg border border-emerald-500/30 bg-emerald-950/25 p-4 transition hover:border-emerald-400"
          >
            <p className="text-xs text-emerald-200/80">Snapshots</p>
            <p className="mt-1 text-sm font-semibold text-emerald-100">{evalManifest.frozen.dataset_version || "-"}</p>
            <p className="mt-2 text-xs text-slate-400">dataset_version, manifest hash, linked runs 확인</p>
          </Link>
        </div>
      </article>
      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">30초 이해 지도</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-sm leading-6 text-slate-200">
{`[관측 데이터]
      |
      v
[표준이론 예측]   [SALT 예측]
      |              |
      +------ 오차 비교 ------+
                 |
                 v
        [승 / 무 / 패 집계]
                 |
                 v
          [결론 + 재현 검증]`}
        </pre>
        <p className="mt-3 text-sm text-slate-400">
          결과 자체는{" "}
          <Link className="text-cyan-300 underline underline-offset-4" href="/verification/results">
            /verification/results
          </Link>
          에서 확인할 수 있고, 이 페이지에서는 같은 절차로 같은 산출 경로가 나오는지를 살펴볼 수 있다.
        </p>
      </article>
      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">자료 공개 방식</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          이 페이지는 결과 문장보다 근거 자료를 함께 공개하는 방식을 기준으로 한다.
          따라서 같은 조건인지 먼저 확인할 수 있어야 한다.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>데이터 출처 공개</li>
          <li>모델식 공개</li>
          <li>실행 명령 공개</li>
          <li>잠금 해시 공개</li>
        </ul>
      </article>
      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">SALT와 표준이론은 무엇이 다른가</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          두 모델 모두 같은 관측값을 입력으로 받는다. 다른 점은 입력을 해석하는 함수형이다.
          이 페이지에서는 인상적 표현보다 실제 오차가 어떻게 비교되는지를 기준으로 본다.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>표준이론: 기존 문헌 기반 기준식을 중심으로 예측</li>
          <li>SALT: 일부 구간에서 다른 곡률항 또는 보정항을 둔 대안식으로 예측</li>
        </ul>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          표준측 기준선은 PDG, NuFIT, T2K, NOvA, IceCube, Super-K, Daya Bay 등과 muon g-2 분해합 문헌
          (Aoyama et al., 2020, doi:10.1016/j.physrep.2020.07.006)에 기반합니다. SALT 보정항은 새 변수를
          무한정 늘리기보다 잔차 패턴이 체계적으로 줄어드는지 시험하는 최소 추가 가정입니다.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-700 text-left text-slate-100">
                <th className="px-3 py-2">구분</th>
                <th className="px-3 py-2">표준이론 기준</th>
                <th className="px-3 py-2">SALT 기준</th>
                <th className="px-3 py-2">핵심 차이</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-2">거시</td>
                <td className="px-3 py-2">완만한 선형+포화형</td>
                <td className="px-3 py-2">약한 곡률항(z^2) 포함</td>
                <td className="px-3 py-2">고 z 잔차 구조 가설 검정</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-2">미시</td>
                <td className="px-3 py-2">문헌 기반 baseline + 보수 지수</td>
                <td className="px-3 py-2">delta 보정 + 지수 미세조정</td>
                <td className="px-3 py-2">정밀/고에너지 잔차 개선 검정</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-2">판정</td>
                <td className="px-3 py-2">동일 데이터/동일 규칙</td>
                <td className="px-3 py-2">동일 데이터/동일 규칙</td>
                <td className="px-3 py-2">함수형 가정만 비교</td>
              </tr>
              <tr>
                <td className="px-3 py-2">검증</td>
                <td className="px-3 py-2">해시/manifest 일치 필수</td>
                <td className="px-3 py-2">해시/manifest 일치 필수</td>
                <td className="px-3 py-2">재현 가능성으로 객관화</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">아직 웹에서 구현하지 못한 검증 항목</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          20장의 감도 매트릭스와 27장의 차별 예측 프로토콜에 나온 항목 가운데, 현재 웹 콘솔이 직접 채점하지 못하는 검증축도 있습니다.
          이유는 크게 두 가지입니다. 첫째, 공개 데이터가 아직 운영형 입력으로 충분히 정리되지 않았습니다. 둘째,
          예측모델식과 score 규칙이 frozen 파이프라인 수준으로 아직 잠기지 않았습니다.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-700 text-left text-slate-100">
                <th className="px-3 py-2">검증 항목</th>
                <th className="px-3 py-2">현재 미구현 이유</th>
                <th className="px-3 py-2">무엇이 갖춰지면 가능한가</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-2">LIGO-HF 급 초고주파 스냅백</td>
                <td className="px-3 py-2">공개 이벤트 표준 포맷과 직접 비교 가능한 운영형 채널이 아직 없음</td>
                <td className="px-3 py-2">고주파 이벤트 카탈로그, 대역별 score 정의, 예측식 lock</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-2">CMB-S4 / 21cm 분산·비등방성 채널</td>
                <td className="px-3 py-2">현재 웹 파이프라인은 시간 지연·적색편이 중심이고 편광/전파 맵 score가 없음</td>
                <td className="px-3 py-2">맵 기반 residual metric, 방향 의존 비교 규칙, 공개 데이터 인덱싱</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-2">초고에너지 LIV / LHAASO 채널</td>
                <td className="px-3 py-2">에너지 컷오프 근방 전파 잔차를 채점하는 운영형 식이 아직 미완성</td>
                <td className="px-3 py-2">고에너지 광자 생존율/도달시간 모델, 이벤트 품질 규칙, 판정 기준 고정</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-2">중성미자 배경 밀도 의존성</td>
                <td className="px-3 py-2">환경 밀도와 진동 확률을 함께 넣는 데이터 결합 구조가 아직 없음</td>
                <td className="px-3 py-2">환경 태깅된 중성미자 세트, 밀도 변수 매핑, 교차 채점식</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-2">암흑 성분의 밀도장 재해석</td>
                <td className="px-3 py-2">회전곡선·렌즈·밀도맵을 같은 score로 묶는 통합 채널이 아직 없음</td>
                <td className="px-3 py-2">은하 밀도맵 결합 데이터, 다중 관측 결합식, 잔차 규칙 잠금</td>
              </tr>
              <tr>
                <td className="px-3 py-2">중력-강력 연속 스펙트럼 / 충돌기 패턴</td>
                <td className="px-3 py-2">핵자 내부와 핵자 간, 고에너지 분해 패턴을 한 체계로 채점하는 score가 아직 없음</td>
                <td className="px-3 py-2">충돌기 산출물 표준화, 결속/분해 패턴 metric, 스케일 법칙 예측식 고정</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          요약하면, 위 항목들은 원리상 검증이 불가능해서 빠진 것이 아니다. 공개 데이터 정규화, 예측모델식의 세밀화,
          그리고 판정 규칙의 운영잠금이 갖춰지면 같은 콘솔 구조 안으로 편입할 수 있다. 그 전까지는
          <a className="ml-1 text-cyan-300 underline underline-offset-4" href="/verification/pending">
            /verification/pending
          </a>
          에서 검증 대기 가설로 분리해 두는 편이 적절하다.
        </p>
      </article>
      <article className="panel p-6 text-slate-300">
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <article className="panel p-5 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-slate-100">현재 잠금 해시</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>micro_prediction_lock_sha256: <code>{evalManifest.prediction_locks.micro_prediction_lock_sha256 || "-"}</code></li>
          <li>micro_sm_prediction_sha256: <code>{evalManifest.prediction_locks.micro_sm_prediction_sha256 || "-"}</code></li>
          <li>micro_salt_prediction_sha256: <code>{evalManifest.prediction_locks.micro_salt_prediction_sha256 || "-"}</code></li>
          <li>frozen_manifest_sha256: <code>{evalManifest.frozen.manifest_sha256 || "-"}</code></li>
        </ul>
        <p className="mt-4 text-slate-400">
          결과를 먼저 보고 싶다면{" "}
          <a className="text-cyan-300 underline underline-offset-4" href="/verification/results">
            /verification/results
          </a>
          , 그림으로 먼저 이해하고 싶다면{" "}
          <a className="text-cyan-300 underline underline-offset-4" href="/reference/visual-atlas">
            /reference/visual-atlas
          </a>
          를 차례로 참고할 수 있다.
        </p>
      </article>
    </section>
  );
}
