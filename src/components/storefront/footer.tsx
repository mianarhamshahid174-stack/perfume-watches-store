import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-noir-950 text-sand-100 pt-16 pb-12">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-white/5">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif-luxury text-2xl font-light tracking-[0.25em] text-sand-50 block">
              {BRAND.name}
            </span>
            <p className="text-[11px] font-sans tracking-luxury uppercase text-gold-400 font-medium">
              {BRAND.tagline}
            </p>
            <p className="text-xs text-platinum-400 font-light leading-relaxed max-w-sm pt-2">
              Born from a pursuit of architectural mechanical complications and rare olfactive extractions. Crafted without concession between our Geneva horological ateliers and Grasse fragrance laboratories.
            </p>
          </div>

          {/* Timepieces Column */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-medium tracking-luxury uppercase text-platinum-200">
              Haute Horlogerie
            </h4>
            <ul className="space-y-2 text-xs text-platinum-400 font-light">
              <li>
                <Link href="/watches" className="hover:text-gold-400 transition-colors">
                  Flyback Chronographs
                </Link>
              </li>
              <li>
                <Link href="/watches" className="hover:text-gold-400 transition-colors">
                  Flying Tourbillons
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-gold-400 transition-colors">
                  The Aethelgard Series
                </Link>
              </li>
              <li>
                <Link href="/concierge" className="hover:text-gold-400 transition-colors">
                  Bespoke Commissions
                </Link>
              </li>
            </ul>
          </div>

          {/* Perfumery Column */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-medium tracking-luxury uppercase text-platinum-200">
              High Perfumery
            </h4>
            <ul className="space-y-2 text-xs text-platinum-400 font-light">
              <li>
                <Link href="/fragrances" className="hover:text-gold-400 transition-colors">
                  Extraits de Parfum
                </Link>
              </li>
              <li>
                <Link href="/fragrances" className="hover:text-gold-400 transition-colors">
                  Rare Woods & Resins
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-gold-400 transition-colors">
                  Nocturne & Ambre
                </Link>
              </li>
              <li>
                <Link href="/concierge" className="hover:text-gold-400 transition-colors">
                  Private Olfactory Discovery
                </Link>
              </li>
            </ul>
          </div>

          {/* Private Concierge Column */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-medium tracking-luxury uppercase text-platinum-200">
              Collector Care
            </h4>
            <ul className="space-y-2 text-xs text-platinum-400 font-light">
              <li>
                <Link href="/concierge" className="hover:text-gold-400 transition-colors">
                  Salon Appointment
                </Link>
              </li>
              <li>
                <Link href="/concierge" className="hover:text-gold-400 transition-colors">
                  Certificate of Authenticity
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold-400 transition-colors">
                  Atelier Administration
                </Link>
              </li>
              <li>
                <span className="text-platinum-500 block pt-1">{BRAND.phone}</span>
                <span className="text-platinum-500 block">{BRAND.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-platinum-500 font-light space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} {BRAND.name} Ateliers S.A. All rights reserved. Registered trademark.</p>
          <div className="flex space-x-6 text-[10px] tracking-wider uppercase">
            <Link href="/legal/privacy" className="hover:text-platinum-300 transition-colors">
              Confidentiality
            </Link>
            <Link href="/legal/terms" className="hover:text-platinum-300 transition-colors">
              Terms of Acquisition
            </Link>
            <Link href="/legal/authenticity" className="hover:text-platinum-300 transition-colors">
              Provenance
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
