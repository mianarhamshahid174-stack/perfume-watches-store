import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShieldCheck, Award, Wrench, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Warranty & Servicing | VELORA",
  description:
    "Details of VELORA's 5-year international warranty, precision movement servicing, and care instructions.",
};

export default function WarrantyPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32">
      <Container size="wide">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Warranty & Servicing" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
            5-Year International Guarantee
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-sand-50 tracking-tight mb-4">
            Warranty & Servicing
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Every VELORA timepiece is built to rigorous mechanical standards. To ensure lasting precision and peace of mind, every watch is backed by our comprehensive 5-year international warranty.
          </p>
        </div>

        {/* Warranty Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              5-Year Coverage
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Full international coverage on mechanical movement components, escapements, and manufacturing tolerances from the date of original purchase.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <Award className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Numbered Certificate
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Each watch includes a digital and physical certificate of authenticity detailing its individual caliber reference, case serial number, and testing dossier.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <Wrench className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Certified Watchmakers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              All warranty repairs and routine servicing are executed exclusively by certified watchmakers using genuine in-house parts.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="max-w-4xl space-y-12">
          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              What Is Covered
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Mechanical Movement:</strong> Irregular timekeeping exceeding standard tolerances, balance wheel regulation, and premature component fatigue.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dial & Hands:</strong> Loose hands, indices, dial alignment issues, or internal dust under the sapphire crystal resulting from assembly.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Case & Crown:</strong> Crown screw-down failures and water resistance issues under rated depth conditions (assuming crown is properly fastened).
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              What Is Not Covered
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
                <span>
                  Normal aesthetic wear and tear (surface scratches on titanium or gold cases, leather patina, clasp scuffs).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
                <span>
                  Damage caused by accidents, severe physical impacts, dropping, or operating the crown underwater.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
                <span>
                  Any watch opened, modified, or repaired by an unauthorized third party.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              How to Request Service
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              If your watch requires servicing or inspection, please email us at{" "}
              <a href="mailto:concierge@velora-ateliers.com" className="text-gold-300 underline">
                concierge@velora-ateliers.com
              </a>{" "}
              with your reference number, serial number, and a brief description of the issue. We will arrange insured shipping to our service atelier in Geneva and provide a comprehensive diagnostic report prior to commencing any work.
            </p>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="mt-16 p-8 bg-neutral-950/60 border border-white/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl">
          <div>
            <h4 className="font-serif-luxury text-xl font-light text-sand-50 mb-1">
              Have a Question About Your Warranty?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 font-light">
              Our horological advisors are available to review your warranty status or guide you through routine maintenance.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-[0.2em] transition-colors whitespace-nowrap"
          >
            Contact Support
          </Link>
        </div>
      </Container>
    </div>
  );
}
