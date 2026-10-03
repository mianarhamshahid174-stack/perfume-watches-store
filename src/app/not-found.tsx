import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian px-6 text-center">
      <div className="max-w-md space-y-6">
        <p className="text-[11px] font-medium tracking-ultra uppercase text-gold-400">
          Page Not Found • 404
        </p>
        
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light tracking-wide text-foreground">
          The Page You Are Looking For Does Not Exist
        </h1>

        <p className="text-xs text-neutral-stone font-light leading-relaxed">
          The requested watch, fragrance, or page may have been moved or is currently unavailable.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="md">
              Return to Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="md">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
