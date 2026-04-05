"use client";

import { useEffect } from "react";

export default function DevPerformanceGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }
    if (typeof window === "undefined" || typeof window.performance?.measure !== "function") {
      return;
    }

    const perf = window.performance as Performance & {
      __saltMeasureGuardInstalled?: boolean;
      __saltOriginalMeasure?: Performance["measure"];
    };

    if (perf.__saltMeasureGuardInstalled) {
      return;
    }

    const originalMeasure = perf.measure.bind(perf);
    perf.__saltOriginalMeasure = originalMeasure;
    perf.measure = ((...args: Parameters<Performance["measure"]>) => {
      try {
        return originalMeasure(...args);
      } catch (error) {
        if (
          error instanceof TypeError &&
          /negative time stamp/i.test(error.message)
        ) {
          return undefined as unknown as ReturnType<Performance["measure"]>;
        }
        throw error;
      }
    }) as Performance["measure"];
    perf.__saltMeasureGuardInstalled = true;
  }, []);

  return null;
}
