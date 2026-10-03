"use client";

import * as React from "react";
import Link from "next/link";
import { BRAND, FOOTER_SECTIONS } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  MapPin,
  Check,
} from "lucide-react";
import { DEFAULT_MARKETING_CONFIG } from "@/app/api/marketing/settings/route";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [marketingConfig, setMarketingConfig] = React.useState(DEFAULT_MARKETING_CONFIG);

  React.useEffect(() => {
    fetch("/api/marketing/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setMarketingConfig(data.config);
        }
      })
      .catch((err) => console.error("Footer marketing config error:", err));
  }, []);

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

  const newsletter = marketingConfig.newsletter;
  const socials = marketingConfig.socialLinks;

  return (
    <footer className="border-t border-white/10 bg-black text-ivory pt-20 pb-14">
      <Container size="wide">
        {/* Top Newsletter & Brand Invitation Banner (Controlled via CMS) */}
        {newsletter.enabled && (
          <div className="pb-16 mb-16 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic">
                {newsletter.incentiveText || "Stay Connected"}
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-ivory">
                {newsletter.title || "Join the VELORA Newsletter"}
              </h3>
              <p className="text-xs text-neutral-stone font-light leading-relaxed max-w-lg">
                {newsletter.subtitle || "Be the first to hear about new timepieces, fragrance releases, and private events."}
              </p>
            </div>

            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
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
                        <span>Subscribe</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-slate font-light">
                  {newsletter.disclaimer || "We respect your privacy. You can unsubscribe at any time."}
                </p>
              </form>
            </div>
          </div>
        )}

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
              Original luxury timepieces and artisanal perfumes, curated with uncompromising excellence for discerning patrons across Pakistan.
            </p>

            {/* Social Links controlled live via CMS */}
            <div className="pt-3 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block">
                Follow Us
              </span>
              <div className="flex items-center gap-3 text-neutral-stone">
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-metallic hover:text-black transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {socials.x && (
                  <a
                    href={socials.x}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-metallic hover:text-black transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {socials.facebook && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-metallic hover:text-black transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.694 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
                    </svg>
                  </a>
                )}
                {socials.youtube && (
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-metallic hover:text-black transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {socials.linkedin && (
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-metallic hover:text-black transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-neutral-stone">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-metallic shrink-0 mt-0.5" />
                <span>Gulberg III, M.M. Alam Road, Lahore, Pakistan</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-metallic shrink-0 mt-0.5" />
                <span>Clifton Block 4, Karachi, Pakistan</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-metallic shrink-0 mt-0.5" />
                <span>Beverly Centre, Blue Area, Islamabad, Pakistan</span>
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
              <span>Complimentary Pakistan Delivery (TCS / Leopard)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-metallic" />
              <span>Cash on Delivery & 5-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-metallic" />
              <span>100% Original Certified Products</span>
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
