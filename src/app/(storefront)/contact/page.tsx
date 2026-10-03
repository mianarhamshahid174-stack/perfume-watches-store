import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Mail, Phone, Globe, Clock, Truck, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/storefront/contact-form";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact VELORA Pakistan | Online Concierge & Client Care",
  description:
    "Get in touch with VELORA Pakistan online client concierge. WhatsApp & phone at +92 335 6600174, email at shopzaven@gmail.com. Nationwide express delivery across Pakistan.",
};

export default function ContactPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen text-[var(--foreground)] pt-28 pb-32 transition-colors duration-300">
      <Container size="wide">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Contact Us" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic block mb-3">
            Pakistan Online Concierge
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-[var(--foreground)] tracking-tight mb-4">
            How Can We Assist You?
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-neutral-stone)] font-light leading-relaxed">
            Our dedicated online client advisors are available to assist you with order status, nationwide courier dispatch, timepiece selection, and bespoke fragrance curation across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border-subtle)] space-y-6 shadow-sm">
              <h2 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
                Direct Channels
              </h2>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[var(--surface-hover)] border border-[var(--border-subtle)] text-metallic shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[var(--color-neutral-stone)] block mb-1">
                      WhatsApp & Direct Phone
                    </span>
                    <a
                      href={BRAND.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--foreground)] hover:text-metallic font-mono text-base font-medium transition-colors block"
                    >
                      {BRAND.phone}
                    </a>
                    <p className="text-xs text-[var(--color-neutral-stone)] mt-1">
                      Mon–Sat: 10:00 AM – 7:00 PM PKT
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[var(--surface-hover)] border border-[var(--border-subtle)] text-metallic shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[var(--color-neutral-stone)] block mb-1">
                      Email Concierge
                    </span>
                    <a
                      href={`mailto:${BRAND.email}`}
                      className="text-[var(--foreground)] hover:text-metallic font-light transition-colors text-sm"
                    >
                      {BRAND.email}
                    </a>
                    <p className="text-xs text-[var(--color-neutral-stone)] mt-1">
                      We reply within one business day
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[var(--surface-hover)] border border-[var(--border-subtle)] text-metallic shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[var(--color-neutral-stone)] block mb-1">
                      Operating Hours
                    </span>
                    <p className="text-[var(--foreground)] font-light text-sm">
                      {BRAND.supportHours}
                    </p>
                    <p className="text-xs text-[var(--color-neutral-stone)] mt-1">
                      Sunday: Orders processed next business day
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[var(--surface-hover)] border border-[var(--border-subtle)] text-metallic shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[var(--color-neutral-stone)] block mb-1">
                      Store Model & Delivery
                    </span>
                    <p className="text-sm text-[var(--foreground)] font-light">
                      Official Online Luxury Boutique
                    </p>
                    <p className="text-xs text-[var(--color-neutral-stone)] mt-1">
                      Nationwide express delivery to all cities across Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Courier & Delivery Info Card */}
            <div className="p-6 bg-[var(--surface)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center gap-2.5 text-metallic font-serif-luxury text-base">
                <Truck className="h-4 w-4" />
                <span>Nationwide Express Logistics</span>
              </div>
              <p className="text-xs text-[var(--color-neutral-stone)] font-light leading-relaxed">
                Free express delivery on all orders via Pakistan’s premier courier networks: TCS Express, Leopard Courier, Trax Logistics, and Call Courier. Cash on Delivery (COD) with open parcel inspection supported nationwide.
              </p>
            </div>

            {/* Assurance Box */}
            <div className="p-6 bg-[var(--surface)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center gap-2.5 text-metallic font-serif-luxury text-base">
                <ShieldCheck className="h-4 w-4" />
                <span>7-Day Checking Warranty & 3-Day Returns</span>
              </div>
              <p className="text-xs text-[var(--color-neutral-stone)] font-light leading-relaxed">
                Every timepiece includes a 7-day checking warranty covering movement and manufacturing defects. Enjoy open parcel inspection upon delivery before paying Cash on Delivery.
              </p>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-[var(--surface)] border border-[var(--border-subtle)] space-y-6 shadow-sm">
              <div>
                <h2 className="font-serif-luxury text-2xl font-light text-[var(--foreground)] mb-2">
                  Send Us a Message
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light">
                  Fill in the form below and our online client concierge team will get back to you promptly.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
