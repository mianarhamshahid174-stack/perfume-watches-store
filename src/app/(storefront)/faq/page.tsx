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
          "Yes. Simply contact our Pakistan customer care team via WhatsApp at +92 300 1234567 or email concierge@velora.pk before the parcel is dispatched.",
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
    category: "Authenticity & 5-Year Warranty",
    icon: ShieldCheck,
    items: [
      {
        question: "Are all VELORA products 100% authentic?",
        answer:
          "Yes, all VELORA watches and fragrances are 100% original. Each watch arrives in our luxury gift box with a serialized certificate and stamped 5-year official warranty card.",
      },
      {
        question: "How does the 5-year warranty work in Pakistan?",
        answer:
          "Our official 5-year warranty covers all internal movement defects and manufacturing issues. Local service and warranty support are available through our boutiques in Lahore and Karachi.",
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
        question: "What is your exchange and return policy?",
        answer:
          "We offer a 7-day hassle-free exchange and return policy. Items must be unworn, undamaged, and returned in original packaging with all warranty cards intact.",
      },
      {
        question: "Can I exchange an item at a physical boutique?",
        answer:
          "Yes! You can visit our showrooms in Lahore (Gulberg III), Karachi (Clifton), or Islamabad (Beverly Centre, Blue Area) for direct, in-person exchange.",
      },
      {
        question: "How quickly are refunds processed?",
        answer:
          "Refunds are transferred directly to your bank account, Raast ID, JazzCash, or EasyPaisa account within 2 to 3 business days following quick quality inspection.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32 transition-colors duration-300">
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
