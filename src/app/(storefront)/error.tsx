"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Storefront Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="py-32">
      <Container size="narrow" className="text-center space-y-6">
        <p className="text-[11px] font-mono tracking-ultra uppercase text-gold-400">
          Atelier Synchronisation Fault
        </p>

        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-sand-50">
          The Gallery Could Not Be Rendered
        </h1>

        <p className="text-xs text-platinum-400 font-light max-w-md mx-auto">
          We experienced an interruption retrieving this collection. Please re-engage or refresh your connection.
        </p>

        <div className="pt-2">
          <Button variant="outline-gold" size="md" onClick={() => reset()}>
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Retry Connection
          </Button>
        </div>
      </Container>
    </div>
  );
}
