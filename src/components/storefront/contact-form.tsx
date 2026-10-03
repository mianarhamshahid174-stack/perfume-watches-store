"use client";

import React, { useState } from "react";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    topic: "order",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        topic: "order",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "An error occurred while sending your message.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-12 text-center space-y-4 bg-card border border-gold-500/30 rounded-xl p-8 transition-colors duration-300">
        <CheckCircle2 className="h-12 w-12 text-gold-500 mx-auto" />
        <h3 className="font-serif-luxury text-2xl font-light text-foreground">
          Inquiry Received
        </h3>
        <p className="text-xs sm:text-sm text-neutral-stone font-light max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to VELORA Pakistan. Your request has been logged in our client database and a personal concierge will review and connect with you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2.5 bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-stone">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="e.g. Arham Shahid"
            className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-neutral-500 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-stone">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="e.g. arham@example.com"
            className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-neutral-500 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-stone">
            Phone Number (Pakistan)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +92 335 6600174"
            className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-neutral-500 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-stone">
            Topic *
          </label>
          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
          >
            <option value="order">Order Status & Tracking</option>
            <option value="product">Product Information & Styling Advice</option>
            <option value="warranty">7-Day Checking Warranty Claim</option>
            <option value="returns">3-Day Defect Return or Exchange Request</option>
            <option value="other">General Concierge Inquiry</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-stone">
          Your Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder="How may our advisors assist you today?"
          className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-neutral-500 focus:outline-none focus:border-gold-500 transition-colors resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3.5 bg-metallic hover:bg-gold-500 disabled:opacity-50 text-black font-semibold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
      >
        <span>{loading ? "Registering Inquiry..." : "Send Message"}</span>
        <Send className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
