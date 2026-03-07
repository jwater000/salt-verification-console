import EvidenceClient from "@/app/evidence/evidence-client";
import { loadAllResults } from "@/lib/data";

export default async function CosmicEvidencePage() {
  const rows = await loadAllResults();
  return <EvidenceClient rows={rows} />;
}
