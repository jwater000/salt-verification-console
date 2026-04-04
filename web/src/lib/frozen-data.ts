import { promises as fs } from "node:fs";
import path from "node:path";
import type { FrozenManifest, ModelEvalManifest, MicroSnapshot, ResultRow } from "@/lib/data";

const root = path.resolve(process.cwd(), "..");
const currentFrozenDir = path.join(root, "data", "frozen", "current");

async function readJson<T>(fullPath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(fullPath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadFrozenManifest(): Promise<FrozenManifest> {
  return readJson<FrozenManifest>(path.join(currentFrozenDir, "manifest.json"), {
    dataset_version: "",
    created_at_utc: "",
    source_base: "",
    files: [],
  });
}

export function loadModelEvalManifest(): Promise<ModelEvalManifest> {
  return readJson<ModelEvalManifest>(path.join(currentFrozenDir, "model_eval_manifest.json"), {
    generated_at_utc: "",
    pipeline: "",
    commands: [],
    engine_versions: {},
    formula_versions: {},
    prediction_locks: {},
    frozen: {},
  });
}

export function loadMicroSnapshot(): Promise<MicroSnapshot> {
  return readJson<MicroSnapshot>(path.join(currentFrozenDir, "micro_snapshot.json"), {
    generated_at_utc: "",
    decision_rule_version: "",
    sources: [],
    observations: [],
    scores: [],
    fit_runs: [],
  });
}

export async function loadAllResults(): Promise<ResultRow[]> {
  try {
    const files = await fs.readdir(currentFrozenDir);
    const resultFiles = files.filter((file) => file.startsWith("results_") && file.endsWith(".json"));
    const groups = await Promise.all(
      resultFiles.map((file) => readJson<ResultRow[]>(path.join(currentFrozenDir, file), [])),
    );
    return groups.flat();
  } catch {
    return [];
  }
}
