import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | VELORA",
  description:
    "How VELORA collects, protects, and respects your personal information and privacy rights.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32">
      <Container size="wide">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Privacy Policy" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
            Privacy & Trust
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-sand-50 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            At VELORA, your privacy and trust are paramount. This policy outlines how we handle, protect, and respect your personal information when you visit our website or purchase our products.
          </p>
          <span className="text-xs font-mono text-neutral-500 block mt-4">
            Last Updated: October 2026
          </span>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl space-y-12">
          <div className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
              1. Information We Collect
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              When you purchase a product, create an account, or contact our team, we collect necessary information to fulfill your request. This may include:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-neutral-400 font-light space-y-2 pl-2">
              <li>Contact details such as your name, email address, telephone number, and physical delivery address.</li>
              <li>Billing and payment information processed through secure, encrypted payment providers.</li>
              <li>Purchase and order history, including product references, serial numbers, and warranty certificates.</li>
              <li>Technical usage data such as your IP address, browser type, and navigation preferences to optimize your browsing experience.</li>
            </ul>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
              2. How We Use Your Information
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              We use your information strictly for legitimate commercial and customer care purposes:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-neutral-400 font-light space-y-2 pl-2">
              <li>Processing, fulfilling, and delivering your orders with insured couriers.</li>
              <li>Maintaining your 5-year international warranty and ownership records.</li>
              <li>Responding promptly to your support requests, inquiries, and service requests.</li>
              <li>Sending relevant updates about new releases or journal articles, only if you have chosen to subscribe.</li>
            </ul>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
              3. Data Security & Storage
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              We employ robust administrative, technical, and physical safeguards to protect your personal data against unauthorized access, alteration, or disclosure. All financial transactions are encrypted with 256-bit SSL technology. <strong>We do not sell, rent, or trade your personal data to third parties.</strong>
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
              4. Your Rights
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Under applicable privacy laws (including GDPR and Swiss Federal Data Protection Act), you have the right to request access to the personal data we hold about you, request corrections, or request deletion. You may also unsubscribe from marketing emails at any time with a single click.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-serif-luxury text-2xl font-light text-sand-50">
              5. Contact Us Regarding Privacy
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              If you have any questions or requests regarding your personal data, please contact our Data Protection Officer at{" "}
              <a href="mailto:privacy@velora-ateliers.com" className="text-gold-300 underline">
                privacy@velora-ateliers.com
              </a>{" "}
              or write to us at Rue du Rhône 42, 1204 Geneva, Switzerland.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
