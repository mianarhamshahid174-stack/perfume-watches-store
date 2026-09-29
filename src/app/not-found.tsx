import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian px-6 text-center">
      <div className="max-w-md space-y-6">
        <p className="text-[11px] font-medium tracking-ultra uppercase text-gold-400">
          Error 404 • Calibre Desynchronized
        </p>
        
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light tracking-wide text-sand-50">
          The Requested Atelier Record Cannot Be Found
        </h1>

        <p className="text-xs text-platinum-400 font-light leading-relaxed">
          The requested horological piece, fragrance formulation, or salon document has been moved or is restricted to private collector allocation.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="md">
              Return to Maison
            </Button>
          </Link>
          <Link href="/concierge">
            <Button variant="outline" size="md">
              Contact Concierge
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
