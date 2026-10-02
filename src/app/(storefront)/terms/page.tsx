import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service | VELORA",
  description:
    "Terms and conditions governing purchases, use of the website, and services provided by VELORA.",
};

export default function TermsPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32">
      <Container size="wide">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Terms of Service" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
            Legal Terms
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-sand-50 tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Please read these terms and conditions carefully before placing an order or using our website. By using VELORA, you agree to be bound by these terms.
          </p>
          <span className="text-xs font-mono text-neutral-500 block mt-4">
            Last Updated: October 2026
          </span>
        </div>

        {/* Content */}
        <div className="max-w-4xl space-y-12">
          <div className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
              1. General Provisions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              These Terms of Service apply to all sales of watches, fragrances, and accessories concluded between VELORA and you, the client, through our official online boutique or authorized client advisors.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
              2. Product Orders & Confirmation
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              All orders placed on our website are subject to acceptance and product availability. Upon placing an order, you will receive an automatic order acknowledgment email. Formal acceptance of your order and formation of the sales contract occurs once the product has been dispatched and tracking information is issued.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
              3. Pricing & Payment
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              All prices are listed in United States Dollars (USD) or Pakistani Rupees (PKR) depending on your currency selection. We reserve the right to correct any typographical or computational errors in pricing. Payment must be confirmed in full before dispatch, unless selecting Cash on Delivery for eligible domestic orders.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
              4. Original Intellectual Property
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              All designs, watch models, fragrance compositions, texts, photographs, and trademarks appearing on this website are the original intellectual property of VELORA. Reproduction, modification, or commercial exploitation without prior written consent is strictly prohibited.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
              5. Governing Law & Jurisdiction
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              These terms are governed by and construed in accordance with the substantive laws of Switzerland, excluding the United Nations Convention on Contracts for the International Sale of Goods (CISG). Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts of the Canton of Geneva, Switzerland.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
