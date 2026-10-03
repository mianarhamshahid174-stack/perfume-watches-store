import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  Watch,
  Flame,
  ShieldCheck,
  Droplets,
  Sun,
  Magnet,
  Sparkles,
  ExternalLink,
  ArrowRight,
  MapPin,
  Wrench,
} from "lucide-react";

export default function CareGuidePage() {
  return (
    <div className="min-h-screen bg-obsidian text-foreground pt-28 pb-24 transition-colors duration-300">
      <Container size="wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-600 dark:text-gold-400 text-[11px] font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preservation & Mastery</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-light text-foreground tracking-tight">
            Care & Maintenance Guide
          </h1>

          <p className="text-xs sm:text-sm text-neutral-stone font-light max-w-xl mx-auto leading-relaxed">
            Essential protocols to preserve the mechanical precision of your timepieces and the olfactory depth of your artisanal perfume formulations for generations.
          </p>
        </div>

        {/* Section 1: Watch Care */}
        <div className="max-w-4xl mx-auto bg-card border border-border p-6 sm:p-10 shadow-sm space-y-8 mb-12">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Watch className="w-6 h-6 text-gold-500" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 font-semibold block">
                Part I
              </span>
              <h2 className="font-serif-luxury text-2xl text-foreground font-light">
                Luxury Timepiece Preservation
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 p-4 bg-background border border-border">
              <div className="flex items-center gap-2 text-gold-500">
                <Wrench className="w-4 h-4" />
                <h4 className="text-sm font-semibold text-foreground">Winding & Power Reserve</h4>
              </div>
              <p className="text-xs text-neutral-stone font-light leading-relaxed">
                If your automatic watch has stopped, gently turn the crown clockwise 25–30 times in position 0. Avoid adjusting the rapid date between 9:00 PM and 3:00 AM when internal gears are engaged.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-background border border-border">
              <div className="flex items-center gap-2 text-gold-500">
                <Droplets className="w-4 h-4" />
                <h4 className="text-sm font-semibold text-foreground">Water Resistance & Seals</h4>
              </div>
              <p className="text-xs text-neutral-stone font-light leading-relaxed">
                Always ensure the crown is fully pushed in or screwed down before exposure to water. Do not operate chronograph pushers underwater. Rinse with fresh water after exposure to sea salt.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-background border border-border">
              <div className="flex items-center gap-2 text-gold-500">
                <Magnet className="w-4 h-4" />
                <h4 className="text-sm font-semibold text-foreground">Magnetic Field Protection</h4>
              </div>
              <p className="text-xs text-neutral-stone font-light leading-relaxed">
                Avoid placing mechanical watches directly on laptop speakers, tablet covers, or MRI units. Strong magnetic fields can cause the balance spring to oscillate faster than calibrated.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-background border border-border">
              <div className="flex items-center gap-2 text-gold-500">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-sm font-semibold text-foreground">Cleaning & Sapphire Care</h4>
              </div>
              <p className="text-xs text-neutral-stone font-light leading-relaxed">
                Use a soft microfiber cloth for regular crystal polishing. Metal bracelets can be cleansed with lukewarm water and mild soap; genuine leather straps should be kept away from excessive moisture.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Fragrance Care */}
        <div className="max-w-4xl mx-auto bg-card border border-border p-6 sm:p-10 shadow-sm space-y-8 mb-12">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Flame className="w-6 h-6 text-gold-500" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 font-semibold block">
                Part II
              </span>
              <h2 className="font-serif-luxury text-2xl text-foreground font-light">
                Artisanal Perfume Preservation
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 p-4 bg-background border border-border">
              <div className="flex items-center gap-2 text-gold-500">
                <Sun className="w-4 h-4" />
                <h4 className="text-sm font-semibold text-foreground">Storage Away From UV & Heat</h4>
              </div>
              <p className="text-xs text-neutral-stone font-light leading-relaxed">
                Pure perfume extracts contain concentrated raw botanical and oud oils. Store your crystal bottle in a cool, shaded environment below 24°C, away from direct sunlight and bathroom humidity.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-background border border-border">
              <div className="flex items-center gap-2 text-gold-500">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-sm font-semibold text-foreground">Application & Longevity</h4>
              </div>
              <p className="text-xs text-neutral-stone font-light leading-relaxed">
                Spray onto pulse points: wrists, sides of the neck, and inner elbows. Allow the fragrance to settle naturally—do not rub your wrists together, as friction disrupts delicate top notes.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Official Servicing Centers */}
        <div className="max-w-4xl mx-auto bg-card border border-border p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <ShieldCheck className="w-6 h-6 text-gold-500" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 font-semibold block">
                Part III
              </span>
              <h2 className="font-serif-luxury text-2xl text-foreground font-light">
                5-Year Official Warranty & Servicing in Pakistan
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-stone font-light leading-relaxed">
            Every VELORA timepiece purchased in Pakistan includes our comprehensive 5-year movement warranty. Complimentary ultrasonic bracelet cleaning and accuracy regulation are available at all three official showrooms:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-background border border-border space-y-1">
              <span className="font-mono text-xs font-semibold text-gold-600 dark:text-gold-400 block">
                Lahore Service Workshop
              </span>
              <p className="text-xs text-foreground">M.M. Alam Road, Gulberg III</p>
              <p className="text-[11px] text-neutral-stone">Mon – Sat: 11:00 AM – 8:00 PM</p>
            </div>

            <div className="p-4 bg-background border border-border space-y-1">
              <span className="font-mono text-xs font-semibold text-gold-600 dark:text-gold-400 block">
                Karachi Flagship Bar
              </span>
              <p className="text-xs text-foreground">Clifton Block 4</p>
              <p className="text-[11px] text-neutral-stone">Mon – Sat: 11:00 AM – 8:00 PM</p>
            </div>

            <div className="p-4 bg-background border border-border space-y-1">
              <span className="font-mono text-xs font-semibold text-gold-600 dark:text-gold-400 block">
                Islamabad Boutique
              </span>
              <p className="text-xs text-foreground">Beverly Centre, Blue Area</p>
              <p className="text-[11px] text-neutral-stone">Mon – Sat: 11:00 AM – 8:00 PM</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
            <span className="text-xs text-neutral-stone font-light">
              Need a service appointment or warranty verification?
            </span>

            <a
              href="https://wa.me/923001234567?text=Hi%20Velora%2C%20I%20would%20like%20to%20book%20a%20watch%20service%20or%20cleaning%20appointment."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-metallic hover:bg-gold-500 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <span>Book Service via WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
