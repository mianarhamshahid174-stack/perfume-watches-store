import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/storefront/contact-form";

export const metadata: Metadata = {
  title: "Contact VELORA Pakistan | Lahore, Karachi, Islamabad",
  description:
    "Get in touch with VELORA Pakistan customer care. Boutique showrooms in Lahore, Karachi, and Islamabad. WhatsApp assistance at +92 300 1234567.",
};

export default function ContactPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32 transition-colors duration-300">
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
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
            Pakistan Client Care
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-sand-50 tracking-tight mb-4">
            How Can We Assist You?
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Our team is available to assist you with order verification, watch sizing, fragrance recommendations, warranty service, and boutique appointments across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 sm:p-8 bg-neutral-950/60 border border-white/10 rounded-xl space-y-6">
              <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
                Direct Channels
              </h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gold-400 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                      WhatsApp & Phone
                    </span>
                    <a
                      href="https://wa.me/923001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sand-100 hover:text-gold-300 font-light transition-colors"
                    >
                      +92 300 1234567
                    </a>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Mon–Sat: 10:00 AM – 9:00 PM PKT
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gold-400 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Email Concierge
                    </span>
                    <a
                      href="mailto:concierge@velora.pk"
                      className="text-sand-100 hover:text-gold-300 font-light transition-colors"
                    >
                      concierge@velora.pk
                    </a>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Response within a few hours on business days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gold-400 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Operating Hours
                    </span>
                    <p className="text-sand-100 font-light">
                      Monday to Saturday: 10:00 AM – 9:00 PM
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Sunday: Online orders dispatched next day
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gold-400 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Showroom Boutiques
                    </span>
                    <p className="text-xs text-sand-100 font-light">
                      <strong>Lahore:</strong> M.M. Alam Road, Gulberg III
                    </p>
                    <p className="text-xs text-sand-100 font-light">
                      <strong>Karachi:</strong> Block 4, Clifton
                    </p>
                    <p className="text-xs text-sand-100 font-light">
                      <strong>Islamabad:</strong> Beverly Centre, Blue Area
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assurance Box */}
            <div className="p-6 bg-gold-950/20 border border-gold-500/20 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-gold-300 font-serif-luxury text-base">
                <ShieldCheck className="h-4 w-4" />
                <span>Authenticity & Official 5-Year Warranty</span>
              </div>
              <p className="text-xs text-sand-200/80 font-light leading-relaxed">
                Every timepiece includes a serialized 5-year warranty card with authorized service in Pakistan. Fragrances are batch-coded with tamper-evident seals.
              </p>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-neutral-950/60 border border-white/10 rounded-xl space-y-6">
              <div>
                <h2 className="font-serif-luxury text-2xl font-light text-sand-50 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-light">
                  Fill in the form below and an advisor will respond to you shortly.
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
