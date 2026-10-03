import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShieldCheck, Award, Wrench, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "5-Year Official Warranty & Servicing | VELORA Pakistan",
  description:
    "Details of VELORA Pakistan's 5-year official warranty, precision movement servicing, and boutique support in Lahore, Karachi, and Islamabad.",
};

export default function WarrantyPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32 transition-colors duration-300">
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
            5-Year Official Guarantee
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-sand-50 tracking-tight mb-4">
            Warranty & Servicing
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Every VELORA timepiece is crafted to exacting mechanical standards. To ensure lasting precision and peace of mind across Pakistan, every watch is backed by our comprehensive 5-year official warranty.
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
              Full coverage on automatic and mechanical movement components, timing regulation, and manufacturing tolerances from the date of original purchase.
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
              Each watch includes a physical, stamped warranty card detailing its individual serial number, model reference, and verification QR code.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <Wrench className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Expert Watchmakers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              All warranty adjustments, timing regulations, and servicing are performed by skilled watchmakers using authentic parts in Lahore and Karachi.
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
                  <strong>Mechanical Movement:</strong> Irregular timekeeping exceeding standard tolerances, balance wheel regulation, and internal component performance.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dial & Hands:</strong> Loose hands, markers, dial alignment issues, or internal particles under the sapphire crystal resulting from manufacturing.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Case & Crown:</strong> Crown screw-down mechanisms and water resistance seals under rated depth conditions.
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
                  Normal surface wear and tear (scratches on steel cases, strap creasing, or clasp scratches).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
                <span>
                  Damage caused by severe physical impacts, dropping, or operating the crown underwater.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
                <span>
                  Any timepiece opened, modified, or repaired by unauthorized third-party technicians.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              How to Request Service in Pakistan
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              If your watch requires inspection or adjustment, message our Pakistan concierge on WhatsApp at{" "}
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="text-gold-300 underline">
                +92 300 1234567
              </a>{" "}
              or email{" "}
              <a href="mailto:concierge@velora.pk" className="text-gold-300 underline">
                concierge@velora.pk
              </a>{" "}
              with your warranty card details. You can drop off your watch at our boutiques in Lahore (Gulberg III), Karachi (Clifton), or Islamabad (Blue Area), or arrange complimentary secure courier pickup.
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
              Our watch specialists in Pakistan are available to review your warranty status or guide you through routine maintenance.
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
