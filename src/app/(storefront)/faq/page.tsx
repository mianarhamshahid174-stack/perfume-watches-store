import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { HelpCircle, ArrowRight, ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | VELORA Pakistan",
  description:
    "Find answers to common questions about VELORA luxury watches, perfumes, Cash on Delivery, warranty, and returns in Pakistan.",
};

const FAQ_SECTIONS = [
  {
    category: "Orders & Payment",
    icon: CreditCard,
    items: [
      {
        question: "What payment methods do you accept in Pakistan?",
        answer:
          "We offer Cash on Delivery (COD) nationwide, Raast / Direct Bank Transfer, JazzCash, EasyPaisa, and major debit/credit cards (Visa & MasterCard).",
      },
      {
        question: "Can I inspect the parcel before paying for COD?",
        answer:
          "Yes. We support open parcel verification on delivery so you can confirm the pristine condition of your timepiece or perfume before handing payment to the rider.",
      },
      {
        question: "Can I cancel or modify my order after placing it?",
        answer:
          "Yes. Simply contact our customer care team via WhatsApp at +92 335 6600174 or email shopzaven@gmail.com before the parcel is dispatched.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    icon: Truck,
    items: [
      {
        question: "What is the delivery fee across Pakistan?",
        answer:
          "Delivery is completely free on all orders across Pakistan. There are no courier charges or hidden fees.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Deliveries to major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad) take 2 to 3 business days. Other cities and towns take 3 to 5 business days.",
      },
      {
        question: "Which courier services do you use?",
        answer:
          "We ship using verified express courier networks including TCS Express, Leopard Courier, and Trax Logistics with full SMS and WhatsApp tracking.",
      },
    ],
  },
  {
    category: "Authenticity & 7-Day Checking Warranty",
    icon: ShieldCheck,
    items: [
      {
        question: "Are all VELORA products 100% authentic?",
        answer:
          "Yes, all VELORA watches and fragrances are 100% original. Each watch arrives in our luxury gift box with our official 7-day checking warranty and open parcel inspection.",
      },
      {
        question: "How does the 7-day checking warranty work in Pakistan?",
        answer:
          "Our 7-day checking warranty covers any movement defects, mechanical faults, or manufacturing issues noticed upon delivery. Message our WhatsApp concierge (+92 335 6600174) and we arrange an immediate courier exchange.",
      },
      {
        question: "What is the concentration and longevity of VELORA perfumes?",
        answer:
          "Our fragrances are formulated as pure high-concentration perfumes using premium fragrance oils. They provide exceptional longevity of 12+ hours with rich projection.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    icon: RotateCcw,
    items: [
      {
        question: "What is your return and exchange policy?",
        answer:
          "We offer an open parcel inspection policy upon delivery, plus a 3-day replacement window strictly for defective, damaged in transit, or incorrect items in original unworn condition with packaging intact.",
      },
      {
        question: "Do you have physical walk-in showrooms?",
        answer:
          "We operate exclusively as an online luxury store, allowing us to deliver premium timepieces and fine fragrances nationwide across Pakistan without retail showroom markups. Support is available via WhatsApp and email.",
      },
      {
        question: "How quickly are replacements or refunds processed?",
        answer:
          "Replacements are dispatched via priority courier. If eligible for refund, transfers are made to your bank account, Raast ID, JazzCash, or EasyPaisa within 2 to 3 business days.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen text-[var(--foreground)] pt-28 pb-32 transition-colors duration-300">
      <Container size="wide">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Frequently Asked Questions" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic block mb-3">
            Help Center & Client Care
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-[var(--foreground)] tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-neutral-stone)] font-light leading-relaxed">
            Everything you need to know about purchasing, shipping, warranty, and maintaining your VELORA timepieces and fragrances.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="space-y-16">
          {FAQ_SECTIONS.map((section, sIdx) => {
            const Icon = section.icon;
            return (
              <div key={sIdx} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
                  <div className="p-2 rounded-none bg-[var(--surface-hover)] border border-[var(--border-subtle)] text-metallic">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
                    {section.category}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-none space-y-3 shadow-sm"
                    >
                      <h3 className="font-serif-luxury text-lg font-light text-[var(--foreground)]">
                        {item.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-20 p-8 sm:p-10 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-none text-center max-w-2xl mx-auto space-y-4 shadow-sm">
          <HelpCircle className="h-10 w-10 text-metallic mx-auto" />
          <h3 className="font-serif-luxury text-2xl font-light text-[var(--foreground)]">
            Still Have Questions?
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed max-w-md mx-auto">
            Our online client concierge team is available Monday to Saturday, 10:00 AM – 7:00 PM PKT to provide personal assistance, product advice, or order updates.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-metallic hover:bg-gold-500 text-black text-xs font-semibold uppercase tracking-editorial transition-colors"
            >
              <span>Contact Us</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
