import { loadAuditManifest, loadModelEvalManifest } from "@/lib/data";
import Link from "next/link";

export default async function AuditFormulasPage() {
  const manifest = await loadAuditManifest();
  const evalManifest = await loadModelEvalManifest();
  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <h1 className="text-2xl font-semibold">Audit / Formulas</h1>
        <p className="mt-2 text-sm text-slate-300">
          다른 연구자가 동일 비교를 재현할 수 있도록 예측식(엔진 구현)을 공개합니다.
        </p>
      </header>

      <article className="panel p-5 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-slate-100">Cosmic (ΛCDM vs SALT)</h2>
        <p className="mt-2">
          redshift/distance sidecar(`data/processed/cosmic_observation_features.json`)가 있으면 해당 피처 기반 식을 사용하고,
          없으면 레거시 스캐폴드로 동작합니다.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded border border-slate-700 bg-slate-950/60 p-3">
            <p className="font-semibold text-slate-100">ΛCDM baseline (SM engine)</p>
            <pre className="mt-2 overflow-x-auto text-xs text-slate-300">
{`u = stable_unit(sha256(observable_id|dataset_id))
pred = 0.81 + 0.18*u - 0.015*(1-u)^2`}
            </pre>
          </div>
          <div className="rounded border border-slate-700 bg-slate-950/60 p-3">
            <p className="font-semibold text-slate-100">SALT baseline (SALT engine)</p>
            <pre className="mt-2 overflow-x-auto text-xs text-slate-300">
{`u = stable_unit(sha256(observable_id|dataset_id))
pred = 0.79 + 0.20*u^1.08 - 0.008*(u*(1-u))`}
            </pre>
          </div>
        </div>
      </article>

      <article className="panel p-5 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-slate-100">Micro (SM vs SALT)</h2>
        <p className="mt-2">
          채널별 baseline 상수 + collider tail 함수형 식을 사용합니다. `muon g-2` 상수는
          `tools/predictors/muon_gm2_constants.json`에서 로드합니다.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded border border-slate-700 bg-slate-950/60 p-3">
            <p className="font-semibold text-slate-100">SM predictor</p>
            <pre className="mt-2 overflow-x-auto text-xs text-slate-300">
{`if observable_id == "muon_g_minus_2":
  pred = (a_QED + a_EW + a_HVP_LO + a_HVP_NLO + a_HVP_NNLO + a_HLbL) * 1e-11
elif observable_id in SM_BASELINES:
  pred = SM_BASELINES[observable_id]
elif observable_id == "collider_high_pt_tail":
  pred = (450.0 / x_value) ** 1.15`}
            </pre>
          </div>
          <div className="rounded border border-slate-700 bg-slate-950/60 p-3">
            <p className="font-semibold text-slate-100">SALT predictor</p>
            <pre className="mt-2 overflow-x-auto text-xs text-slate-300">
{`if observable_id == "muon_g_minus_2":
  pred = (a_mu_SM + Delta_a_mu_SALT) * 1e-11
elif observable_id in SALT_BASELINES:
  pred = SALT_BASELINES[observable_id]
elif observable_id == "collider_high_pt_tail":
  pred = (450.0 / x_value) ** 1.12`}
            </pre>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          구현 파일: `tools/predictors/cosmic_sm_predict.py`, `cosmic_salt_predict.py`,
          `micro_sm_predict.py`, `micro_salt_predict.py`
        </p>
      </article>

      <article className="panel p-5 text-sm text-slate-300">
        <p>decision_rule_version: {manifest.decision_rule_version || "-"}</p>
        <p className="mt-2">formula_version:</p>
        <ul className="mt-1 list-disc pl-5">
          {manifest.formula_version.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
        <p className="mt-3">predictor engine versions:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>cosmic: {evalManifest.engine_versions.cosmic || "-"}</li>
          <li>micro: {evalManifest.engine_versions.micro || "-"}</li>
        </ul>
        <p className="mt-3">predictor formula versions:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>cosmic_sm: {evalManifest.formula_versions.cosmic_sm || "-"}</li>
          <li>cosmic_salt: {evalManifest.formula_versions.cosmic_salt || "-"}</li>
          <li>micro_sm: {evalManifest.formula_versions.micro_sm || "-"}</li>
          <li>micro_salt: {evalManifest.formula_versions.micro_salt || "-"}</li>
        </ul>
        <p className="mt-3 text-xs text-slate-400">
          비교 데이터/출처 확인:{" "}
          <Link href="/audit/sources" className="text-cyan-300 underline">
            /audit/sources
          </Link>
        </p>
      </article>
    </section>
  );
}
