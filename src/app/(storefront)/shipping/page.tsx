import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Truck, ShieldCheck, Clock, MapPin, PackageCheck, Banknote, Phone, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Nationwide Shipping & Delivery in Pakistan | VELORA Pakistan",
  description:
    "Complimentary express shipping across Pakistan via TCS, Leopard, Trax, and Call Courier. Cash on delivery available with open parcel inspection and 7-day checking warranty.",
};

export default function ShippingPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen text-[var(--foreground)] pt-28 pb-32 transition-colors duration-300">
      <Container size="wide">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shipping & Delivery" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic block mb-3">
            Pakistan Courier & Logistics Services
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-[var(--foreground)] tracking-tight mb-4">
            Nationwide Shipping & Delivery
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-neutral-stone)] font-light leading-relaxed">
            Every VELORA timepiece and fragrance is dispatched with utmost care in secure, tamper-evident packaging. We provide complimentary express courier delivery to every city, district, and town across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          <div className="p-8 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-none space-y-4 shadow-sm">
            <div className="h-10 w-10 rounded-none bg-[var(--surface-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-metallic">
              <Truck className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-[var(--foreground)]">
              Free Express Delivery
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              We offer complimentary courier delivery on all orders nationwide across Pakistan. Zero shipping fees or hidden surcharges at checkout.
            </p>
          </div>

          <div className="p-8 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-none space-y-4 shadow-sm">
            <div className="h-10 w-10 rounded-none bg-[var(--surface-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-metallic">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-[var(--foreground)]">
              2–4 Business Days
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              Orders to Lahore, Karachi, Islamabad, Rawalpindi, and Faisalabad arrive within 2 to 3 business days. All other destinations arrive in 3 to 4 business days.
            </p>
          </div>

          <div className="p-8 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-none space-y-4 shadow-sm">
            <div className="h-10 w-10 rounded-none bg-[var(--surface-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-metallic">
              <Banknote className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-[var(--foreground)]">
              Cash on Delivery (COD)
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              Shop with absolute peace of mind. Pay in PKR upon arrival directly to the courier rider after inspecting your parcel.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="max-w-4xl space-y-12">
          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              1. Courier Networks & Coverage Across Pakistan
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              We partner with Pakistan’s most reliable logistics providers: <strong>TCS Express</strong>, <strong>Leopard Courier</strong>, <strong>Trax Logistics</strong>, and <strong>Call Courier</strong>. Your package is tracked in real-time from the moment it leaves our fulfillment facility until physical handoff at your doorstep.
            </p>
          </div>

          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              2. Order Verification & Dispatch Timelines
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              For Cash on Delivery orders, our customer concierge will contact you via WhatsApp or phone call from <strong>{BRAND.phone}</strong> to confirm your address and recipient details. Orders verified before 3:00 PM (PKT) Monday through Saturday are packed and handed to the courier the same afternoon.
            </p>
          </div>

          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              3. Open Parcel Inspection & 7-Day Checking Warranty
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
              Each timepiece arrives inside the luxury VELORA presentation case accompanied by an official 7-day checking warranty card and instruction manual. You are welcome to open and inspect your parcel before paying the courier rider. Perfumes arrive in sealed crystal bottles with tamper-evident authentication seals.
            </p>
          </div>

          <div className="space-y-4 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
              4. Real-Time Tracking & Direct Support
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed mb-4">
              Upon courier booking, you receive an automated SMS and WhatsApp update with your tracking code. For live tracking assistance or address modification:
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none font-sans font-medium uppercase tracking-wider transition-colors"
              >
                <span>WhatsApp: {BRAND.phone}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] rounded-none font-sans font-medium uppercase tracking-wider transition-colors"
              >
                <span>Email: {BRAND.email}</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
