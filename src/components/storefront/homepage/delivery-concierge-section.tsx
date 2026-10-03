"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Truck, ShieldCheck, Phone, RotateCcw, ArrowRight, MessageCircle, MapPin } from "lucide-react";
import { BRAND } from "@/lib/constants";

interface DeliveryConciergeSectionProps {
  title?: string;
  subtitle?: string;
  content?: Record<string, any>;
}

export function DeliveryConciergeSection({
  title = "Nationwide Courier & Concierge Care",
  subtitle = "Complimentary express delivery across Pakistan via TCS, Leopard, Trax, and Call Courier with Cash on Delivery.",
}: DeliveryConciergeSectionProps) {
  const features = [
    {
      icon: Truck,
      title: "Free Express Nationwide Delivery",
      description:
        "Every timepiece and fragrance order is dispatched with complimentary express delivery across all cities and towns in Pakistan.",
      detail: "2–4 Business Days via TCS, Leopard, Trax, Call Courier",
    },
    {
      icon: ShieldCheck,
      title: "Cash on Delivery & Parcel Inspection",
      description:
        "Pay in PKR directly to the courier rider upon arrival. Inspect your securely packed parcel before releasing payment.",
      detail: "Zero extra COD fees nationwide",
    },
    {
      icon: MessageCircle,
      title: "Direct WhatsApp Concierge",
      description:
        "Real-time order tracking updates, styling guidance, and concierge advice directly with our client care team.",
      detail: `${BRAND.phone} · Mon–Sat 10:00 AM – 7:00 PM PKT`,
    },
    {
      icon: ShieldCheck,
      title: "7-Day Checking Warranty & 3-Day Returns",
      description:
        "Every creation includes our 7-day checking warranty covering movement and manufacturing defects, plus a 3-day replacement window for defective pieces.",
      detail: "100% Online Store with WhatsApp Concierge",
    },
  ];

  return (
    <section className="py-28 sm:py-36 bg-[var(--surface)] text-[var(--foreground)] border-t border-b border-[var(--border-subtle)] relative overflow-hidden transition-colors duration-300">
      <Container size="wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic block">
            Client Care & Delivery
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[var(--foreground)]">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="p-8 bg-[var(--background)] border border-[var(--border-subtle)] hover:border-metallic/40 transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-none bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center text-metallic group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif-luxury text-lg font-light text-[var(--foreground)] leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[var(--color-neutral-stone)] font-light leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] text-[10px] font-sans font-medium uppercase tracking-wider text-metallic">
                  {feat.detail}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Courier Network & Quick Actions Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="p-8 sm:p-10 bg-[var(--background)] border border-[var(--border-subtle)] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm"
        >
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic block">
              Official Delivery Networks
            </span>
            <h4 className="font-serif-luxury text-xl font-light text-[var(--foreground)]">
              Express Delivery Across Pakistan
            </h4>
            <p className="text-xs text-[var(--color-neutral-stone)] font-light">
              We partner with Pakistan’s most reliable express couriers: <strong>TCS Express</strong>, <strong>Leopard Courier</strong>, <strong>Trax Logistics</strong>, and <strong>Call Courier</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Link
              href="/track-order"
              className="px-6 py-3.5 bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] text-xs font-semibold uppercase tracking-editorial transition-colors inline-flex items-center gap-2"
            >
              <span>Track Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-metallic hover:bg-gold-500 text-black text-xs font-semibold uppercase tracking-editorial transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
