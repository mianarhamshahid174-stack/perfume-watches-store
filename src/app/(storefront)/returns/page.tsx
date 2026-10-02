import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Exchanges | VELORA",
  description:
    "Information on VELORA's 14-day return policy, exchange procedure, and refund processing.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32">
      <Container size="wide">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Returns & Exchanges" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
            Customer Guarantee
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-sand-50 tracking-tight mb-4">
            Returns & Exchanges Policy
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            We want you to be completely delighted with your VELORA purchase. If you are not entirely satisfied, you may return or exchange eligible items within 14 days of delivery.
          </p>
        </div>

        {/* 3 Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase bg-white/5 px-2.5 py-1 rounded">
              Step 01
            </span>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Request Return
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Email our support team at concierge@velora-ateliers.com within 14 days of receiving your item with your order number.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase bg-white/5 px-2.5 py-1 rounded">
              Step 02
            </span>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Prepaid Collection
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              We provide a prepaid, fully insured courier shipping label and schedule an armored pickup at your preferred address.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase bg-white/5 px-2.5 py-1 rounded">
              Step 03
            </span>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Prompt Refund
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Following inspection by our quality specialists, your refund is processed to your original payment method within 5–7 business days.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="max-w-4xl space-y-12">
          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              Item Condition Requirements
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Watches:</strong> Must be unworn, undamaged, with no scratches on the crystal, bezel, case, or strap. All original protective plastics and stickers must remain in place.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Documentation:</strong> The original presentation box, instruction manual, and numbered certificate of authenticity must be included in pristine condition.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Fragrances:</strong> Due to hygiene and health regulations, perfume bottles can only be returned if the cellophane wrapping and tamper-evident security seal are unopened and intact.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              Exchanges
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              If you wish to exchange a watch or fragrance for a different reference or size, please notify us when requesting your return. We will reserve the replacement item for you and dispatch it once the returned piece has passed inspection.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              Damaged or Defective Items
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              In the unlikely event that your order arrives damaged or defective, please contact us within 48 hours of delivery. We will immediately arrange an urgent priority exchange and cover all associated transit costs.
            </p>
          </div>
        </div>

        {/* Assistance Box */}
        <div className="mt-16 p-8 bg-neutral-950/60 border border-white/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl">
          <div>
            <h4 className="font-serif-luxury text-xl font-light text-sand-50 mb-1">
              Need Help With a Return?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 font-light">
              Our concierge team is available to assist you with every step of the return process.
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
