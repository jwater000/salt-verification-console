export default function MicroMethodPage() {
  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Micro Method</p>
        <h1 className="mt-2 text-2xl font-semibold">미시 판정 프로토콜</h1>
      </header>

      <article className="panel p-5 text-sm text-slate-300">
        <p>- Standard (Micro): SM</p>
        <p>- 공통식: res_SM = O_meas - O_SM, res_SALT = O_meas - O_SALT</p>
        <p>- 판정: winner = argmin(|res_SM|, |res_SALT|)</p>
        <p>- 통계: chi2, RMSE, AIC/BIC, FDR(BH)</p>
        <p>- 상태: 운영잠금(관측량/비교식/파라미터/판정규칙 고정) 기준 검증대기</p>
      </article>
    </section>
  );
}
