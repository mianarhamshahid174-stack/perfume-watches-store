"use client";

import * as React from "react";
import Link from "next/link";
import { X, Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import { DEFAULT_MARKETING_CONFIG } from "@/app/api/marketing/settings/route";

export function VipWelcomePopup() {
  const [popupConfig, setPopupConfig] = React.useState(DEFAULT_MARKETING_CONFIG.popup);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    // Check if dismissed before
    const dismissed = sessionStorage.getItem("velora_vip_popup_dismissed");
    if (dismissed === "true") return;

    fetch("/api/marketing/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config?.popup) {
          const cfg = data.config.popup;
          setPopupConfig(cfg);

          if (cfg.enabled) {
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, (cfg.delaySeconds || 5) * 1000);
            return () => clearTimeout(timer);
          }
        }
      })
      .catch((err) => console.error("Popup settings fetch error:", err));
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("velora_vip_popup_dismissed", "true");
  };

  const handleCopyCode = () => {
    if (popupConfig.couponCode) {
      navigator.clipboard.writeText(popupConfig.couponCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  if (!isOpen || !popupConfig.enabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50 duration-300">
      <div className="relative w-full max-w-lg bg-obsidian border border-metallic/30 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-sand-100 hover:text-metallic hover:bg-black/90 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Feature Visual Banner */}
        <div className="relative h-44 sm:h-52 w-full bg-charcoal-900 overflow-hidden">
          <img
            src={popupConfig.imageUrl || "/images/velora-signature-01.jpg"}
            alt="Velora Pakistan Exclusive"
            className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-[10px] font-sans uppercase tracking-ultra px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-metallic border border-metallic/40">
              {popupConfig.badge || "EXCLUSIVE WELCOME OFFER"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-4 text-center">
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-ivory tracking-wide leading-snug">
            {popupConfig.title}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-stone font-light leading-relaxed max-w-md mx-auto">
            {popupConfig.subtitle}
          </p>

          {/* Coupon Code Pill */}
          {popupConfig.couponCode && (
            <div className="pt-2">
              <div
                onClick={handleCopyCode}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-charcoal-900 border border-white/10 hover:border-metallic/50 cursor-pointer transition-colors"
              >
                <div className="text-left">
                  <div className="text-[9px] uppercase font-sans tracking-ultra text-neutral-slate">
                    Discount Code
                  </div>
                  <div className="font-mono text-sm font-semibold text-metallic tracking-wider">
                    {popupConfig.couponCode}
                  </div>
                </div>

                <div className="pl-3 border-l border-white/10 text-xs text-neutral-stone flex items-center gap-1.5">
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-metallic" />
                      <span>Copy</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-3">
            <Link
              href="/watches"
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-none bg-metallic hover:bg-metallic-light text-black text-xs font-semibold uppercase tracking-editorial transition-colors shadow-lg"
            >
              <span>{popupConfig.ctaText || "SHOP NEW ARRIVALS"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="text-[10px] text-neutral-slate pt-1">
            Discount applicable at checkout. Valid across all watches and luxury fragrances.
          </p>
        </div>
      </div>
    </div>
  );
}
