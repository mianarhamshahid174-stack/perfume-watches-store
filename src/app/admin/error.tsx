"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Admin dashboard exception:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-md space-y-4">
        <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h2 className="text-lg font-semibold text-zinc-100 font-mono">
          Dashboard Service Interrupted
        </h2>

        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          The atelier data service encountered an unhandled exception while aggregating administrative metrics.
        </p>

        {error.digest && (
          <p className="text-[10px] font-mono text-zinc-500">
            Error digest: {error.digest}
          </p>
        )}

        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={() => reset()}>
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Reload Admin View
          </Button>
        </div>
      </div>
    </div>
  );
}
