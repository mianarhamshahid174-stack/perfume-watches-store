"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { BRAND } from "@/lib/constants";

export function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);

  const phoneClean = "923001234567";
  const defaultMessage = encodeURIComponent(
    "Hello VELORA Pakistan, I would like assistance with your luxury watches and perfumes."
  );
  const whatsappUrl = `https://wa.me/${phoneClean}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Mini popup message */}
      {isOpen && (
        <div className="mb-3 w-72 rounded-2xl bg-white dark:bg-charcoal-900 border border-neutral-200 dark:border-white/10 p-4 shadow-2xl animate-fade-in text-neutral-900 dark:text-sand-100">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Pakistan Concierge
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-sand-100 p-1"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs mt-2.5 text-neutral-600 dark:text-platinum-400 leading-relaxed">
            Need help choosing a watch or fragrance? Chat directly with our Pakistan customer care team in Lahore & Karachi.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      )}

      {/* Floating Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md border border-neutral-200 dark:border-white/10 text-[11px] font-sans font-medium text-neutral-800 dark:text-sand-100 shadow-lg cursor-pointer hover:border-emerald-500/50 transition-colors"
          >
            WhatsApp Support
          </button>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Chat with VELORA Pakistan on WhatsApp"
          title="Chat with VELORA Pakistan on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
