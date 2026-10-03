"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { RotateCcw, Home } from "lucide-react";

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
        <p className="text-[11px] font-mono tracking-widest uppercase text-gold-400">
          Notice
        </p>

        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-sand-50">
          Something Went Wrong
        </h1>

        <p className="text-xs sm:text-sm text-platinum-400 font-light max-w-md mx-auto leading-relaxed">
          We encountered an issue loading this page. Please try refreshing or return to the home page.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline-gold" size="md" onClick={() => reset()}>
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Try Again
          </Button>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-white/20 hover:border-gold-500/40 text-sand-100 text-xs font-mono uppercase tracking-wider transition-colors"
          >
            <Home className="mr-2 h-3.5 w-3.5" />
            Return Home
          </Link>
        </div>
      </Container>
    </div>
  );
}
