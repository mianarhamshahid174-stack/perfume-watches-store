import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { RotateCcw, PackageCheck, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "3-Day Returns & Exchanges Policy | VELORA Pakistan",
  description:
    "Official policy on 3-day replacement for defective or incorrect items, open parcel inspection upon delivery, and 7-day checking warranty across Pakistan.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen text-[var(--foreground)] pt-28 pb-32 transition-colors duration-300">
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
          <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic block mb-3">
            Fair & Transparent Policy
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-[var(--foreground)] tracking-tight mb-4">
            Returns, Exchanges & Inspection
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-neutral-stone)] font-light leading-relaxed">
            We are dedicated to providing a flawless shopping experience. We offer an Open Parcel Inspection policy with your delivery rider, alongside a dedicated 3-day replacement window for defective, damaged, or incorrect items.
          </p>
        </div>

        {/* 3 Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          <div className="p-8 bg-[var(--surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <span className="text-[10px] font-sans font-semibold tracking-wider text-metallic uppercase bg-[var(--surface-hover)] border border-[var(--border-subtle)] px-2.5 py-1">
              Step 01
            </span>
            <h2 className="font-serif-luxury text-xl font-light text-[var(--foreground)]">
              Open Parcel Inspection
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              When the courier arrives, you can open and verify the parcel before handing over your Cash on Delivery (COD) payment.
            </p>
          </div>

          <div className="p-8 bg-[var(--surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <span className="text-[10px] font-sans font-semibold tracking-wider text-metallic uppercase bg-[var(--surface-hover)] border border-[var(--border-subtle)] px-2.5 py-1">
              Step 02
            </span>
            <h2 className="font-serif-luxury text-xl font-light text-[var(--foreground)]">
              Notify Within 3 Days
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              If an item is defective, damaged in transit, or incorrect, message us on WhatsApp at {BRAND.phone} within 3 days of delivery with photos/video.
            </p>
          </div>

          <div className="p-8 bg-[var(--surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <span className="text-[10px] font-sans font-semibold tracking-wider text-metallic uppercase bg-[var(--surface-hover)] border border-[var(--border-subtle)] px-2.5 py-1">
              Step 03
            </span>
            <h2 className="font-serif-luxury text-xl font-light text-[var(--foreground)]">
              Doorstep Exchange
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              We arrange a courier exchange directly at your doorstep via TCS, Leopard, Trax, or Call Courier with zero hassle.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="max-w-4xl space-y-12">
          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              Item Condition Guidelines
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Watches:</strong> Must be unworn, undamaged, with no scratches or signs of usage. Protective films and stickers must remain intact.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Presentation Packaging:</strong> The luxury watch presentation box, manual, cushion, and 7-day checking warranty card must be returned in pristine condition.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Fragrances & Perfumes:</strong> Due to hygiene and cosmetic health standards, perfume bottles can only be replaced if damaged or leaking upon delivery. If requesting an exchange for another scent, the outer cellophane wrap and security seal must be completely unopened and untampered.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              Defective or Incorrect Deliveries
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              In the unlikely event that you receive a defective watch movement or an incorrect order, please notify our client concierge within 3 days. We take full responsibility and dispatch an expedited courier replacement free of charge.
            </p>
          </div>

          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              Non-Eligible Situations
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Items with signs of wear, resized bracelets, removed links, or scratched crystals cannot be returned or exchanged.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Perfumes that have been opened, sprayed, or unsealed cannot be accepted for return due to hygiene regulations.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Requests made after the 3-day reporting window has elapsed.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Assistance Box */}
        <div className="mt-16 p-8 bg-[var(--surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl shadow-sm">
          <div>
            <h4 className="font-serif-luxury text-xl font-light text-[var(--foreground)] mb-1">
              Need Help With an Order or Exchange?
            </h4>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light">
              Our online client concierge team is ready to assist you on WhatsApp and phone.
            </p>
          </div>
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-editorial transition-colors whitespace-nowrap cursor-pointer inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Concierge</span>
          </a>
        </div>
      </Container>
    </div>
  );
}
