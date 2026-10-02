import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Truck, ShieldCheck, Clock, MapPin, PackageCheck, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery | VELORA",
  description:
    "Complimentary insured worldwide shipping, delivery timelines, packaging, and tracking for VELORA orders.",
};

export default function ShippingPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32">
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
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
            Worldwide Delivery
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-sand-50 tracking-tight mb-4">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Every VELORA creation is dispatched in secure, tamper-evident packaging with comprehensive insurance coverage from our facility directly to your hands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <Truck className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Free Insured Shipping
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              We provide free priority shipping on all orders worldwide. Every shipment is fully insured against damage or loss in transit.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Delivery Times
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Domestic deliveries take 2–4 business days. International express shipments take 3–7 business days.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <PackageCheck className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Signature on Delivery
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              To guarantee complete security, all deliveries require a physical signature upon receipt. Packages are never left unattended.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="max-w-4xl space-y-12">
          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              1. Order Processing & Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Orders placed before 2:00 PM CET on business days are processed and dispatched the same day. Orders placed on weekends or Swiss public holidays are prepared on the following business day. Before dispatch, each timepiece and fragrance undergoes final technical inspection and secure packaging.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              2. Packaging & Security
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              For security, orders arrive in discreet, unbranded exterior boxes that do not disclose the valuable contents inside. Inside the outer box, you will find our signature VELORA presentation case, accompanied by your warranty certificate, documentation, and protective travel pouch.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              3. Customs & Import Duties
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              For most international destinations, applicable taxes and duties are calculated and settled during checkout. If local customs authorities require additional documentation, our logistics team coordinates directly with the courier to prevent unnecessary delays.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              4. Tracking Your Order
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Once your shipment is handed over to our courier, you will receive an email containing your tracking number and expected delivery date. You can also monitor real-time tracking updates directly in your{" "}
              <Link href="/account" className="text-gold-300 underline hover:text-gold-200">
                VELORA Account
              </Link>
              .
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
