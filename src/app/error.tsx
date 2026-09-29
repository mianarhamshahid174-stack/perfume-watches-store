"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Atelier Application Exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian px-6 text-center">
      <div className="max-w-md space-y-6">
        <p className="text-[11px] font-medium tracking-ultra uppercase text-rose-400">
          Atelier System Disruption
        </p>

        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light tracking-wide text-sand-50">
          An Unexpected Variance Occurred
        </h1>

        <p className="text-xs text-platinum-400 font-light leading-relaxed">
          Our engineering ateliers have logged the variance. Please attempt to re-engage the mechanism or reach our concierge.
        </p>

        {error.digest && (
          <p className="text-[10px] font-mono text-platinum-500/60 tracking-wider">
            Digest Ref: {error.digest}
          </p>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="outline-gold" size="md" onClick={() => reset()}>
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Recalibrate Mechanism
          </Button>
        </div>
      </div>
    </div>
  );
}
