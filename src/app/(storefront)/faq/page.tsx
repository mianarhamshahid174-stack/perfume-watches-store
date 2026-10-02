import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { HelpCircle, ArrowRight, ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | VELORA",
  description:
    "Find answers to common questions about VELORA luxury watches, high perfumery, shipping, warranty, and returns.",
};

const FAQ_SECTIONS = [
  {
    category: "Orders & Payment",
    icon: CreditCard,
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit and debit cards (Visa, MasterCard, American Express), Bank Wire Transfers for high-value orders, and Cash on Delivery (COD) for eligible domestic addresses.",
      },
      {
        question: "Is shopping on VELORA secure?",
        answer:
          "Yes. All payment transactions are encrypted using 256-bit SSL encryption. We do not store your full card details on our servers.",
      },
      {
        question: "Can I cancel or modify my order after placing it?",
        answer:
          "Orders are processed quickly to ensure prompt delivery. If you need to make changes or cancel, please contact our support team immediately at concierge@velora-ateliers.com or +41 22 819 89 00.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    icon: Truck,
    items: [
      {
        question: "How much does shipping cost?",
        answer:
          "We provide complimentary, fully insured priority shipping on all orders worldwide. There are no additional shipping charges at checkout.",
      },
      {
        question: "How long will delivery take?",
        answer:
          "Domestic orders typically arrive within 2–4 business days. International express orders are delivered within 3–7 business days, depending on customs clearance.",
      },
      {
        question: "How can I track my shipment?",
        answer:
          "Once your order ships, you will receive an email with a secure tracking link. You can also view real-time shipping updates in your VELORA Account under 'My Orders'.",
      },
    ],
  },
  {
    category: "Authenticity & Warranty",
    icon: ShieldCheck,
    items: [
      {
        question: "Are all VELORA timepieces authentic?",
        answer:
          "Every VELORA watch is 100% original, designed in-house, and manufactured under strict quality standards. Each timepiece comes with an individually numbered certificate of authenticity and warranty card.",
      },
      {
        question: "What warranty coverage is included?",
        answer:
          "All mechanical timepieces include a 5-year international warranty against manufacturing and movement defects. Normal wear and tear, accidental impacts, and unauthorized servicing are not covered.",
      },
      {
        question: "How are VELORA fragrances produced?",
        answer:
          "Our extraits de parfum are formulated in Grasse, France using precious natural absolutes and aged oils. Every bottle is individually inspected and sealed to guarantee freshness and concentration.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    icon: RotateCcw,
    items: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 14-day return window from the date of delivery. Items must be unworn, undamaged, and returned in their original packaging with all protective films, boxes, and certificates intact.",
      },
      {
        question: "Are fragrance returns accepted?",
        answer:
          "For hygiene and safety reasons, fragrances may only be returned if the exterior security seal is unbroken and unopened.",
      },
      {
        question: "How long does a refund take to process?",
        answer:
          "Once our inspection team verifies the returned item, your refund will be credited back to your original payment method within 5–7 business days.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32">
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
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
            Help Center
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-sand-50 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Everything you need to know about purchasing, shipping, warranty, and maintaining your VELORA timepieces and fragrances.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="space-y-16">
          {FAQ_SECTIONS.map((section, sIdx) => {
            const Icon = section.icon;
            return (
              <div key={sIdx} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-gold-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
                    {section.category}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 bg-neutral-950/60 border border-white/10 rounded-xl space-y-3"
                    >
                      <h3 className="font-serif-luxury text-lg font-light text-sand-100">
                        {item.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
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
        <div className="mt-20 p-8 sm:p-10 bg-neutral-950 border border-gold-500/30 rounded-xl text-center max-w-2xl mx-auto space-y-4">
          <HelpCircle className="h-10 w-10 text-gold-400 mx-auto" />
          <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
            Still Have Questions?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
            Our client support team is always available to provide personal assistance, product advice, or order updates.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
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
