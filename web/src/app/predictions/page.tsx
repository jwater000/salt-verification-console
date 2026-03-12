export default function PredictionsPage() {
  return (
    <section className="space-y-5">
      <article className="panel p-6 text-slate-200">
        <h1 className="text-2xl font-bold text-white">예측과 검증 대기 항목</h1>
        <p className="mt-2 text-slate-300">
          이 페이지는 SALT가 제시하는 예측 가운데, 아직 frozen 데이터와 판정 규칙으로 직접 채점되지 않은 항목을
          모아 둔 곳입니다.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          이미 채점이 끝난 항목은{" "}
          <a className="text-cyan-300 underline underline-offset-4" href="/evaluation">
            /evaluation
          </a>
          에서 보고, 동일 조건 재실행 방법은{" "}
          <a className="text-cyan-300 underline underline-offset-4" href="/audit/reproduce">
            /audit/reproduce
          </a>
          에서 확인하면 됩니다.
        </p>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">현재 상태 기준</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">검증됨</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              시간지연, 적색편이, 고에너지 tail, 뮤온 g-2, 중성미자 채널처럼 현재 frozen 데이터와 비교 규칙이
              있는 항목
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/25 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">검증 대기</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              가설은 있으나 관측량 매핑, 데이터 열, 판정식이 아직 연결되지 않아 직접 채점할 수 없는 항목
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">원칙</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              이 페이지의 내용은 결과 보고가 아니라 예측 목록입니다. 데이터가 없는 항목은 그대로{" "}
              <code>검증 불가</code> 또는 <code>검증 대기</code>로 표기합니다.
            </p>
          </div>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">예측 항목 1: 양자 확률성의 재해석</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>
            <code>[검증됨]</code> 양자역학의 확률적 예측은 실험적으로 매우 정밀하게 검증되어 있다.
          </li>
          <li>
            <code>[가설]</code> SALT는 확률성을 보셀 상태 갱신과 내부 위상 재배열의 통계적 결과로 해석한다.
          </li>
          <li>
            <code>[예측]</code> 같은 관측 채널에서 <code>rho</code>와 <code>n = rho^2</code>를 구분하면 측정
            해석의 일관성이 높아져야 한다.
          </li>
        </ul>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950/40 p-4 text-sm leading-6 text-slate-300">
          <p>
            정의 고정: <code>rho = |Psi|</code>는 진폭, <code>n = rho^2 = |Psi|^2</code>는 밀도형 상태량입니다.
          </p>
          <p className="mt-2">
            상호작용의 정적 구동 축은 <code>-nabla mu</code>이며, 저차 근사에서는 <code>-nabla rho</code>로
            읽습니다.
          </p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-3 py-2 font-semibold text-white">항목</th>
                <th className="px-3 py-2 font-semibold text-white">현재 상태</th>
                <th className="px-3 py-2 font-semibold text-white">부족한 것</th>
              </tr>
            </thead>
            <tbody className="align-top text-slate-300">
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">보셀 상태 갱신</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">직접 대응하는 공개 관측량 정의 필요</td>
              </tr>
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">내부 위상 재배열</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">실험 채널별 추출 규칙과 판정식 필요</td>
              </tr>
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">rho vs n 분리</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">동일 데이터에서 두 해석의 성능 비교 규칙 필요</td>
              </tr>
              <tr>
                <td className="px-3 py-3">-nabla mu 축 매핑</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">공개 데이터 열과의 운영형 매핑 필요</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">예측 항목 2: 질량의 형성과 해방</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>
            <code>[검증됨]</code> 질량-에너지 등가는 핵반응과 입자물리 관측 결과에서 반복 검증되었다.
          </li>
          <li>
            <code>[가설]</code> SALT는 질량을 보셀 매질의 고밀도 고착 상태로 해석한다.
          </li>
          <li>
            <code>[예측]</code> 질량 형성 / 해방 채널에서 위상과 밀도 상태변수의 추적 가능성이 높아야 한다.
          </li>
        </ul>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-3 py-2 font-semibold text-white">항목</th>
                <th className="px-3 py-2 font-semibold text-white">현재 상태</th>
                <th className="px-3 py-2 font-semibold text-white">부족한 것</th>
              </tr>
            </thead>
            <tbody className="align-top text-slate-300">
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">질량 형성 채널</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">고밀도 고착 상태를 직접 읽는 공개 관측량과 score 정의 필요</td>
              </tr>
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">질량 해방 채널</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">에너지 방출과 위상/밀도 상태변수를 함께 추적하는 비교 규칙 필요</td>
              </tr>
              <tr>
                <td className="px-3 py-3">위상·밀도 상태변수 추적</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">형성 전후 상태를 같은 채널에서 이어 읽는 운영형 매핑 필요</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">예측 항목 3: 중력의 보편성과 유효 경사도</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>
            <code>[검증됨]</code> 자유낙하, 중력렌즈, 시간지연 같은 관측 사실은 중력의 보편성을 지지한다.
          </li>
          <li>
            <code>[가설]</code> SALT는 이를 유효 경사도에 따른 공간 흐름으로 해석한다.
          </li>
          <li>
            <code>[예측]</code> 동일 변수 집합 <code>(n, mu)</code>으로 낙하, 렌즈, 전파지연을 교차 설명할 수 있어야
            한다.
          </li>
          <li>
            <code>[검증 절차 연결]</code> 관측 판정은 25장 13.2~13.4와 27장 프로토콜 기준을
            따른다.
          </li>
        </ul>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-3 py-2 font-semibold text-white">항목</th>
                <th className="px-3 py-2 font-semibold text-white">현재 상태</th>
                <th className="px-3 py-2 font-semibold text-white">비고</th>
              </tr>
            </thead>
            <tbody className="align-top text-slate-300">
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">자유낙하 / 궤적</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">유효 경사도와 관측 궤적을 직접 비교하는 운영형 예측식 필요</td>
              </tr>
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">시간지연 / 적색편이</td>
                <td className="px-3 py-3">부분 검증</td>
                <td className="px-3 py-3">frozen 채널은 있으나 <code>n</code>, <code>mu</code> 교차식은 미완성</td>
              </tr>
              <tr>
                <td className="px-3 py-3">중력렌즈 / 렌즈 지연</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">25장 13.2~13.4 식과 27장 운영 잠금을 연결한 판정 규칙이 더 필요</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">예측 항목 4: 강력과 핵력의 분리</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>
            <code>[검증됨]</code> 쿼크 가둠, 점근적 자유, 핵자 결합은 표준 핵입자 물리에서 검증 또는 정립된 축이다.
          </li>
          <li>
            <code>[가설]</code> SALT는 강력을 위상 잠금, 핵력을 그 잔류 유효 결속으로 해석한다.
          </li>
          <li>
            <code>[예측]</code> 강력-핵력 구분이 맞다면, 핵자 내부와 핵자 간 관측 채널에서 서로 다른 스케일 법칙이
            나와야 한다.
          </li>
          <li>
            <code>[검증 절차 연결]</code> 관측 판정은 25장 기술식과 27장 프로토콜, 그리고 고에너지 충돌의 결속 / 분해 패턴 비교를
            함께 따른다.
          </li>
        </ul>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-3 py-2 font-semibold text-white">항목</th>
                <th className="px-3 py-2 font-semibold text-white">현재 상태</th>
                <th className="px-3 py-2 font-semibold text-white">부족한 것</th>
              </tr>
            </thead>
            <tbody className="align-top text-slate-300">
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">핵자 내부 채널</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">위상 잠금 구조와 내부 결속 스케일을 비교하는 운영형 예측식 필요</td>
              </tr>
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">핵자 간 채널</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">잔류 유효 결속과 거리/에너지 스케일 법칙 비교 규칙 필요</td>
              </tr>
              <tr>
                <td className="px-3 py-3">고에너지 결속 / 분해 패턴</td>
                <td className="px-3 py-3">검증 대기</td>
                <td className="px-3 py-3">충돌 데이터에서 결속과 분해 패턴을 채점하는 직접 score 정의 필요</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">예측식은 어디까지 제시됐는가</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          SALT는 이미 핵심 변수와 일부 연결식은 제시하고 있습니다. 다만 상대론 채널과 양자 채널 전체를 하나의
          운영형 예측 파이프라인으로 끝까지 묶는 완결된 식은 아직 일부만 구현된 상태입니다. 현재 책 구조로 보면
          17장은 양자 코어, 18장은 스피너 확장 조건, 19장은 GR 정합 개요, 25장은 기술식, 27장은 운영 잠금 역할로 분리됩니다.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">이미 제시된 식</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>
                <code>n = rho^2</code>: 밀도형 상태량
              </li>
              <li>
                <code>mu = partial U / partial n</code>: 장력 퍼텐셜의 국소 기울기 축
              </li>
              <li>
                <code>g_eff ∝ -nabla mu</code>: 정적 흐름의 유효 구동 축
              </li>
              <li>
                저차 근사 <code>-nabla rho</code>
              </li>
              <li>
                질량화 임계 조건 <code>sigma &gt; sigma_c</code>, <code>W != 0</code>,{" "}
                <code>tau_relax &gt;&gt; T_obs</code>
              </li>
              <li>
                거시 채널 연결식 <code>c_eff(rho)</code>, 시간 지연/적색편이 해석축
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/25 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">아직 필요한 식</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>상대론 채널과 양자 채널을 같은 변수 집합으로 끝까지 채점하는 운영형 예측식</li>
              <li>공개 데이터 열에서 <code>rho</code>, <code>theta</code>, <code>L</code>, <code>mu</code>를 읽는 매핑식</li>
              <li>
                <code>rho</code>와 <code>n = rho^2</code>를 같은 데이터에서 직접 비교하는 판정 규칙
              </li>
              <li>
                <code>-nabla mu</code>를 관측 지표와 연결하는 실무형 계산식
              </li>
              <li>양자 확률성 재해석을 frozen 파이프라인으로 채점하는 score 정의</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-3 py-2 font-semibold text-white">구분</th>
                <th className="px-3 py-2 font-semibold text-white">현재 상태</th>
                <th className="px-3 py-2 font-semibold text-white">비고</th>
              </tr>
            </thead>
            <tbody className="align-top text-slate-300">
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">핵심 변수 집합</td>
                <td className="px-3 py-3">제시됨</td>
                <td className="px-3 py-3">
                  <code>rho</code>, <code>n</code>, <code>theta</code>, <code>L</code>, <code>mu</code>
                </td>
              </tr>
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">부분 연결식</td>
                <td className="px-3 py-3">제시됨</td>
                <td className="px-3 py-3">
                  <code>n = rho^2</code>, <code>g_eff ∝ -nabla mu</code>, <code>c_eff(rho)</code>
                </td>
              </tr>
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">거시 채널 운영형 예측</td>
                <td className="px-3 py-3">부분 구현</td>
                <td className="px-3 py-3">시간 지연, 적색편이, tail 채널 일부 연결</td>
              </tr>
              <tr>
                <td className="px-3 py-3">양자-상대론 통합 운영식</td>
                <td className="px-3 py-3">미완성</td>
                <td className="px-3 py-3">현재는 예측 단계, 직접 채점 파이프라인 없음</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">SALT는 어디서 틀릴 수 있는가</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          아래 항목은 SALT가 스스로 내놓는 반증 조건입니다. 즉 이 관측들이 체계적으로 어긋나면, SALT의 해석 틀은
          약화되거나 폐기되어야 합니다.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-3 py-2 font-semibold text-white">반증 조건</th>
                <th className="px-3 py-2 font-semibold text-white">실패 기준</th>
                <th className="px-3 py-2 font-semibold text-white">현재 상태</th>
              </tr>
            </thead>
            <tbody className="align-top text-slate-300">
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">강한 중력장 시간 지연 / 적색편이</td>
                <td className="px-3 py-3">
                  공간 밀도 지표와 시간 지연 또는 적색편이가 통계적으로 상관되지 않을 때
                </td>
                <td className="px-3 py-3">부분 검증 진행 중. 시간 지연/적색편이 채널은 있으나 강중력장 운영식은 미완성</td>
              </tr>
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3">유효 경사도와 중력 경로</td>
                <td className="px-3 py-3">
                  동일한 유효 경사도 <code>(-nabla mu, low-order -nabla rho)</code> 조건에서 예측 흐름 경로와
                  관측 궤적이 체계적으로 불일치할 때
                </td>
                <td className="px-3 py-3">검증 대기. 경사도-궤적 운영형 예측식과 공개 데이터 매핑이 아직 필요</td>
              </tr>
              <tr>
                <td className="px-3 py-3">위상 잠금 기반 강력 해석</td>
                <td className="px-3 py-3">
                  위상 잠금 기반 강력 해석이 고에너지 충돌 데이터의 결속 / 분해 패턴을 재현하지 못할 때
                </td>
                <td className="px-3 py-3">검증 대기. 고에너지 충돌 채널에 대한 직접 score 정의와 비교식이 아직 없음</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">왜 여기 두는가</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          `/evaluation`은 이미 frozen 데이터로 채점된 결과만 올립니다. 반면 이 페이지는 공개 관측 채널, 변수 정의,
          판정 규칙이 아직 완성되지 않은 예측을 모아 두는 공간입니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          즉 이 페이지는 &quot;증명 완료&quot;가 아니라 &quot;검증 가능한데 아직 채점 파이프라인이 없는 항목&quot;을 투명하게
          공개하는 역할을 합니다.
        </p>
      </article>
    </section>
  );
}
