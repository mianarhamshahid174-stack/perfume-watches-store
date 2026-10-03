import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShieldCheck, PackageCheck, Headphones, CheckCircle2, AlertCircle, ArrowRight, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "7-Day Checking Warranty & Guarantee | VELORA Pakistan",
  description:
    "Details of VELORA Pakistan's official 7-day checking warranty, open parcel inspection upon delivery, and WhatsApp client concierge support.",
};

export default function WarrantyPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen text-[var(--foreground)] pt-28 pb-32 transition-colors duration-300">
      <Container size="wide">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Warranty & Guarantee" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic block mb-3">
            Peace of Mind Assurance
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-[var(--foreground)] tracking-tight mb-4">
            7-Day Checking Warranty & Guarantee
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-neutral-stone)] font-light leading-relaxed">
            At VELORA Pakistan, every timepiece and fragrance is inspected with meticulous precision before dispatch. To ensure total confidence, we back every watch with our official 7-Day Checking Warranty and an Open Parcel Inspection policy on Cash on Delivery.
          </p>
        </div>

        {/* Warranty Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          <div className="p-8 bg-[var(--surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div className="h-10 w-10 bg-[var(--surface-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-metallic">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-[var(--foreground)]">
              7-Day Checking Warranty
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              Full replacement warranty covering all manufacturing, movement, or mechanical defects detected within 7 days of receiving your order.
            </p>
          </div>

          <div className="p-8 bg-[var(--surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div className="h-10 w-10 bg-[var(--surface-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-metallic">
              <PackageCheck className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-[var(--foreground)]">
              Open Parcel Inspection
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              You are entitled to open and inspect the contents of your parcel with the courier rider before paying Cash on Delivery (COD).
            </p>
          </div>

          <div className="p-8 bg-[var(--surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div className="h-10 w-10 bg-[var(--surface-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-metallic">
              <Headphones className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-[var(--foreground)]">
              Direct Online Concierge
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              Fast, courteous support directly via WhatsApp and email. No lengthy warranty claims or complicated procedures.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="max-w-4xl space-y-12">
          {/* Covered */}
          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              What Is Covered Under the 7-Day Checking Warranty
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Mechanical Movement Defects:</strong> Stoppage, irregular timekeeping, or non-functioning balance wheel/winding mechanism present upon delivery.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Dial & Assembly Imperfections:</strong> Loose hands, loose indices, misaligned dial markers, or internal particles under the crystal resulting from factory assembly.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Transit & Packaging Damage:</strong> Any damage incurred during courier handling prior to delivery to your address.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Crown & Clasp Functionality:</strong> Faulty crown threading or defective deployment clasps out of the box.
                </span>
              </li>
            </ul>
          </div>

          {/* Exclusions */}
          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              Warranty Exclusions & Limitations
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Normal wear and tear after usage (scratches on steel cases, bracelets, leather strap creasing, or crystal scratches resulting from daily wear).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Accidental damage caused by dropping, hard impacts, sports abuse, or operating the crown underwater.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Water damage resulting from exceeding the rated depth or failing to secure the crown properly.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Any timepiece opened, altered, or serviced by third-party local technicians or unauthorized workshops.
                </span>
              </li>
            </ul>
          </div>

          {/* Fragrance Policy */}
          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              Fragrance & Perfume Policy
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              Due to cosmetic and hygienic standards, fragrance bottles can only be returned or replaced if the parcel arrives damaged, leaking, or with defective atomizers. If exchanging an unopened scent, the outer cellophane seal and security packaging must remain completely intact and untampered.
            </p>
          </div>

          {/* How to Claim */}
          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              How to Claim Your Checking Warranty
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              If your watch has an issue upon arrival, simply contact our WhatsApp concierge within 7 days of delivery:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light pl-2">
              <li>Record a short video or photos clearly showing the defect or issue.</li>
              <li>Send the media along with your order number or recipient phone number to our WhatsApp concierge at <a href={BRAND.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-metallic underline font-mono">{BRAND.phone}</a> or email <a href={`mailto:${BRAND.email}`} className="text-metallic underline font-mono">{BRAND.email}</a>.</li>
              <li>Our team will verify the issue and immediately schedule a courier pickup or replacement piece to your address.</li>
            </ol>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="mt-16 p-8 bg-[var(--surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl shadow-sm">
          <div>
            <h4 className="font-serif-luxury text-xl font-light text-[var(--foreground)] mb-1">
              Need Assistance With Your Order?
            </h4>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light">
              Our online client concierge is available Monday to Saturday, 10:00 AM – 7:00 PM PKT.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-editorial transition-colors whitespace-nowrap inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 bg-[var(--surface-hover)] border border-[var(--border-subtle)] hover:bg-[var(--surface)] text-[var(--foreground)] text-xs font-semibold uppercase tracking-editorial transition-colors whitespace-nowrap"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
