import EvidenceClient from "./evidence-client";
import { loadAllResults } from "@/lib/data";

export default async function EvidencePage() {
  const rows = await loadAllResults();
  return <EvidenceClient rows={rows} />;
}
