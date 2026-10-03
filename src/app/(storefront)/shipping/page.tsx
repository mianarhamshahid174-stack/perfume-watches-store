import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Truck, ShieldCheck, Clock, MapPin, PackageCheck, Banknote } from "lucide-react";

export const metadata: Metadata = {
  title: "Nationwide Shipping & Delivery in Pakistan | VELORA Pakistan",
  description:
    "Complimentary express shipping across Pakistan via TCS, Leopard, and Trax. Cash on delivery available with open parcel verification.",
};

export default function ShippingPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32 transition-colors duration-300">
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
            Pakistan Delivery Services
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-sand-50 tracking-tight mb-4">
            Nationwide Shipping & Delivery
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Every VELORA timepiece and fragrance is dispatched with utmost care in secure, tamper-proof packaging. We provide complimentary express courier delivery to every city and town across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <Truck className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Complimentary Delivery
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              We offer free express courier delivery on all orders nationwide across Pakistan. No hidden delivery fees or extra charges at checkout.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Delivery Timelines
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Major cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad) receive orders within 2 to 3 business days. Other cities and towns arrive in 3 to 5 business days.
            </p>
          </div>

          <div className="p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-4">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <Banknote className="h-5 w-5" />
            </div>
            <h2 className="font-serif-luxury text-xl font-light text-sand-50">
              Cash on Delivery (COD)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Shop with total confidence. Pay in Pakistani Rupees upon arrival directly to the courier rider after verifying your parcel.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="max-w-4xl space-y-12">
          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              1. Courier Partners & Nationwide Coverage
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              We partner with Pakistan’s leading courier networks including TCS Express, Leopard Courier, and Trax Logistics to ensure quick, dependable delivery to your doorstep. All packages are tracked online from the moment of dispatch until physical handoff.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              2. Order Verification & Dispatch Timelines
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              For Cash on Delivery orders, our customer care concierge in Lahore or Karachi will contact you via phone or WhatsApp to verify your delivery address. Orders verified before 3:00 PM (PKT) Monday through Saturday are packed and handed over to the courier the same day.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              3. Packaging & Parcel Inspection
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Your timepiece or fragrance arrives in our signature VELORA presentation box with a stamped 5-year official warranty certificate, user guide, and serialized authenticity card. We pack each piece in an impact-resistant, tamper-evident security box for safe transit.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
              4. Real-Time Tracking & WhatsApp Support
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              As soon as your shipment is booked with the courier, you will receive an SMS and WhatsApp message with your tracking number and direct tracking link. For live tracking inquiries or delivery rescheduling, you can message our Pakistan concierge on WhatsApp at{" "}
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="text-gold-300 underline hover:text-gold-200">
                +92 300 1234567
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
