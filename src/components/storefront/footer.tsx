"use client";

import * as React from "react";
import Link from "next/link";
import { BRAND, FOOTER_SECTIONS } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { ArrowRight, ShieldCheck, Truck, Sparkles, MapPin, Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 4000);
    }
  };

  return (
    <footer className="border-t border-white/10 bg-black text-ivory pt-20 pb-14">
      <Container size="wide">
        {/* Top Newsletter & Brand Invitation Banner */}
        <div className="pb-16 mb-16 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic">
              Private Patron Inquiries
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-ivory">
              Receive Private Salon Invitations & Masterpiece Allocations
            </h3>
            <p className="text-xs text-neutral-stone font-light leading-relaxed max-w-lg">
              Join the private circle of collectors for confidential previews of numbered timepieces, rare extraction releases, and invitation-only viewings.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter collector email address..."
                  required
                  className="flex-1 h-12 px-4 rounded-none bg-charcoal-900 border border-white/15 text-xs text-ivory placeholder:text-neutral-stone focus:outline-none focus:border-metallic"
                />
                <button
                  type="submit"
                  disabled={isSubscribed}
                  className="h-12 px-6 bg-metallic hover:bg-metallic-light text-black text-xs font-semibold uppercase tracking-editorial transition-colors shrink-0 flex items-center gap-1.5"
                >
                  {isSubscribed ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <span>Join Circle</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-neutral-slate font-light">
                Discretion guaranteed. No spam. You may withdraw at any time.
              </p>
            </form>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 pb-16 border-b border-white/5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif-luxury text-3xl font-light tracking-[0.25em] text-ivory block">
                {BRAND.name}
              </span>
              <span className="text-[8px] font-sans tracking-ultra uppercase text-neutral-stone block -mt-1">
                {BRAND.subtitle}
              </span>
            </Link>

            <p className="text-xs text-neutral-stone font-light leading-relaxed max-w-sm pt-2">
              Precision born in solitude. Handcrafted mechanical calibers and 35% pure parfum extraits compounded without concession between our Geneva horological ateliers and Grasse botanical laboratory.
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-neutral-stone">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-metallic shrink-0 mt-0.5" />
                <span>Rue du Rhône 42, 1204 Genève, Switzerland</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-metallic shrink-0 mt-0.5" />
                <span>Chemin des Parfumeurs, 06130 Grasse, France</span>
              </div>
            </div>
          </div>

          {/* 4 Thematic Columns */}
          {FOOTER_SECTIONS.map((sec, idx) => (
            <div key={idx} className="space-y-3.5">
              <h4 className="text-[11px] font-sans font-semibold tracking-ultra uppercase text-metallic">
                {sec.title}
              </h4>
              <ul className="space-y-2 text-xs text-neutral-stone font-light">
                {sec.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="hover:text-ivory transition-colors duration-200 block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Trust & Copyright Bar */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-neutral-stone">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-metallic" />
              <span>Armored Courier Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-metallic" />
              <span>5-Year Manufacture Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-metallic" />
              <span>Geneva Hallmarked Metallurgy</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-neutral-slate">
              © {new Date().getFullYear()} {BRAND.formalName}. All rights reserved.
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
