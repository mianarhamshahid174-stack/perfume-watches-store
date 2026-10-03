import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Exchanges in Pakistan | VELORA Pakistan",
  description:
    "7-day hassle-free returns and exchanges across Pakistan. Doorstep courier pickup or in-person exchange at our Lahore, Karachi, and Islamabad boutiques.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32 transition-colors duration-300">
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
            Customer Satisfaction Guarantee
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-sand-50 tracking-tight mb-4">
            Returns & Exchanges Policy
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            We want you to be completely delighted with your VELORA purchase. If you are not entirely satisfied, you may exchange or return eligible unworn items within 7 days of delivery across Pakistan.
          </p>
        </div>

        {/* 3 Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase bg-white/5 px-2.5 py-1 rounded">
              Step 01
            </span>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Contact Concierge
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Message us on WhatsApp at +92 300 1234567 or email concierge@velora.pk with your order number within 7 days of receiving your parcel.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase bg-white/5 px-2.5 py-1 rounded">
              Step 02
            </span>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Doorstep Pickup or Boutique Visit
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              We arrange a courier pickup via TCS/Leopard from your home, or you can exchange your item at our boutiques in Lahore, Karachi, or Islamabad.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase bg-white/5 px-2.5 py-1 rounded">
              Step 03
            </span>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Swift Exchange or Refund
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Following quick inspection, your replacement piece is dispatched or your refund is transferred via Raast / Direct Bank Transfer within 2–3 business days.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="max-w-4xl space-y-12">
          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              Item Condition Guidelines
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Watches:</strong> Must be unworn, undamaged, with no scratches on the sapphire crystal, bezel, case, or strap. All original protective plastics must remain intact.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Presentation Box & Cards:</strong> The original presentation box, user manual, and numbered 5-year warranty card must be returned in pristine condition.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Fragrances:</strong> For hygienic reasons, fragrance bottles can only be returned if the outer cellophane wrap and security seal remain completely unopened and intact.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              Exchange Process in Pakistan
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              If you wish to exchange a watch for a different dial color or strap, or a perfume for another signature scent, please let our concierge team know. We will reserve your preferred replacement item immediately so you don’t have to wait.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              Damaged or Incorrect Items
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              If you receive an item that appears damaged in courier transit or does not match your order, please notify us within 24 hours of delivery. We will arrange an immediate priority courier replacement at zero additional cost to you.
            </p>
          </div>
        </div>

        {/* Assistance Box */}
        <div className="mt-16 p-8 bg-neutral-950/60 border border-white/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl">
          <div>
            <h4 className="font-serif-luxury text-xl font-light text-sand-50 mb-1">
              Need Help With an Exchange?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 font-light">
              Our Pakistan customer care team in Lahore and Karachi is ready to assist you.
            </p>
          </div>
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-[0.2em] transition-colors whitespace-nowrap cursor-pointer"
          >
            WhatsApp Support
          </a>
        </div>
      </Container>
    </div>
  );
}
