"use client";

import React, { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="py-12 text-center space-y-4 bg-neutral-900/60 border border-gold-500/30 rounded-xl p-8">
        <CheckCircle2 className="h-12 w-12 text-gold-400 mx-auto" />
        <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
          Message Received
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. A dedicated client advisor will review your inquiry and respond within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-gold-300 border border-gold-500/20 text-xs font-mono uppercase tracking-wider transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Alexander Vance"
            className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-sm text-sand-100 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/60 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="e.g. alexander@example.com"
            className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-sm text-sand-100 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/60 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            placeholder="e.g. +41 22 123 4567"
            className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-sm text-sand-100 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/60 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Topic *
          </label>
          <select
            required
            className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-sm text-sand-100 focus:outline-none focus:border-gold-500/60 transition-colors"
          >
            <option value="order">Order Status & Tracking</option>
            <option value="product">Product Information & Sizing</option>
            <option value="warranty">Warranty, Service & Repairs</option>
            <option value="appointment">Private Appointment in Geneva</option>
            <option value="other">General Inquiry</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
          Your Message *
        </label>
        <textarea
          required
          rows={6}
          placeholder="How may our advisors assist you today?"
          className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-sm text-sand-100 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/60 transition-colors resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-obsidian font-semibold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <span>{loading ? "Sending..." : "Send Message"}</span>
        <Send className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
