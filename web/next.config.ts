import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  outputFileTracingExcludes: {
    "/*": [
      "assets/images/public/**/*",
      "assets/images/graph/**/*",
      "data/processed/live_events.json",
      "results/reports/cosmic_submission_candidates.csv",
    ],
  },
};

export default nextConfig;
