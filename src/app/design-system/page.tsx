"use client";

import * as React from "react";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { ImageReveal } from "@/components/ui/image-reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { ProductCard } from "@/components/ui/product-card";
import { CollectionCard } from "@/components/ui/collection-card";
import { Carousel } from "@/components/ui/carousel";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Modal } from "@/components/ui/modal";
import { Drawer } from "@/components/ui/drawer";
import {
  Sparkles,
  ShoppingBag,
  Eye,
  Sliders,
  Check,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [quickViewProduct, setQuickViewProduct] = React.useState<any>(null);

  const sampleProducts = [
    {
      id: "prod-1",
      name: "Chronographe Squelette Grade 5",
      slug: "chronographe-squelette",
      sku: "VA-920-TI",
      price: 48000,
      compareAtPrice: 54000,
      category: { name: "Grand Complications" },
      specs: "Grade 5 Titanium • 41mm • 72h Reserve",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
      secondaryImageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85",
      featured: true,
    },
    {
      id: "prod-2",
      name: "Tourbillon Celestial 18K",
      slug: "tourbillon-celestial",
      sku: "VA-880-RG",
      price: 95000,
      category: { name: "Tourbillons" },
      specs: "18K Rose Gold • Aventurine Dial • Flying Escapement",
      imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85",
      secondaryImageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
      featured: true,
    },
    {
      id: "prod-3",
      name: "Céleste Oud Pure Parfum Extrait",
      slug: "celeste-oud",
      sku: "EXT-001-OUD",
      price: 18500,
      category: { name: "Haute Parfumerie" },
      specs: "35% Concentration • Hand-Blown Smoked Crystal • 100ml",
      imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85",
      featured: false,
    },
    {
      id: "prod-4",
      name: "Nocturne d'Ambre Millésime",
      slug: "nocturne-d-ambre",
      sku: "EXT-002-AMB",
      price: 14200,
      category: { name: "Haute Parfumerie" },
      specs: "Baltic Amber Tears • Smoked Grasse Cedarwood • 50ml",
      imageUrl: "https://images.unsplash.com/photo-1547996160-71dfabb19286?auto=format&fit=crop&w=800&q=85",
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-ivory flex flex-col selection:bg-metallic/30 selection:text-metallic-light">
      {/* Real Interactive Header with Mega Menus */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-24 space-y-24 sm:space-y-32">
        <Container size="wide">
          {/* Breadcrumbs Preview */}
          <div className="pb-8 border-b border-white/10">
            <Breadcrumbs
              items={[
                { label: "Atelier Standards", href: "#" },
                { label: "Design System Specification" },
              ]}
            />
          </div>

          {/* Hero Intro */}
          <div className="py-12 space-y-4">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic">
              Maison Visual Identity • Geneva & Grasse
            </span>

            <AnimatedText
              as="h1"
              text="The Architecture of Quiet Splendor"
              className="text-4xl sm:text-6xl md:text-7xl font-serif-luxury font-light text-ivory tracking-tight"
            />

            <p className="text-sm sm:text-base text-neutral-stone max-w-3xl font-light leading-relaxed pt-2">
              An uncompromised design system built for high-touch luxury e-commerce. Merging editorial elegance, cinematic typography, warm ivory hues, deep charcoals, and micro-calibrated motion.
            </p>
          </div>

          {/* 1. COLOR PALETTE SYSTEM */}
          <section className="space-y-8 pt-8 border-t border-white/10">
            <SectionHeading
              align="left"
              eyebrow="Color Architecture"
              title="Curated Elemental Palette"
              subtitle="Pure ivory, deep velvety charcoals, timeless black obsidian, subtle warm metallics, and muted neutrals."
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Warm Ivory */}
              <div className="space-y-2">
                <div className="h-28 rounded-xl bg-ivory border border-white/20 shadow-md p-3 flex flex-col justify-end text-black">
                  <span className="text-xs font-semibold">Warm Ivory</span>
                  <span className="font-mono text-[10px] opacity-75">#FAF8F5</span>
                </div>
                <div className="text-[11px] text-neutral-stone">Background & Primary Text</div>
              </div>

              {/* Deep Charcoal */}
              <div className="space-y-2">
                <div className="h-28 rounded-xl bg-charcoal border border-white/10 shadow-md p-3 flex flex-col justify-end text-ivory">
                  <span className="text-xs font-semibold">Deep Charcoal</span>
                  <span className="font-mono text-[10px] opacity-75">#15161A</span>
                </div>
                <div className="text-[11px] text-neutral-stone">Elevated Panels & Cards</div>
              </div>

              {/* Obsidian Black */}
              <div className="space-y-2">
                <div className="h-28 rounded-xl bg-black border border-white/10 shadow-md p-3 flex flex-col justify-end text-ivory">
                  <span className="text-xs font-semibold">Obsidian Black</span>
                  <span className="font-mono text-[10px] opacity-75">#080808</span>
                </div>
                <div className="text-[11px] text-neutral-stone">Maison Floor & Backdrop</div>
              </div>

              {/* Warm Metallic */}
              <div className="space-y-2">
                <div className="h-28 rounded-xl bg-gradient-to-br from-metallic via-metallic-light to-metallic border border-metallic-light/40 shadow-md p-3 flex flex-col justify-end text-black">
                  <span className="text-xs font-semibold">Warm Metallic</span>
                  <span className="font-mono text-[10px] opacity-75">#C5A880</span>
                </div>
                <div className="text-[11px] text-neutral-stone">Accents, CTAs & Halos</div>
              </div>

              {/* Muted Cashmere */}
              <div className="space-y-2">
                <div className="h-28 rounded-xl bg-neutral-cashmere border border-white/10 shadow-md p-3 flex flex-col justify-end text-black">
                  <span className="text-xs font-semibold">Muted Cashmere</span>
                  <span className="font-mono text-[10px] opacity-75">#D6D0C6</span>
                </div>
                <div className="text-[11px] text-neutral-stone">Secondary Text & Dividers</div>
              </div>
            </div>
          </section>

          {/* 2. TYPOGRAPHY SCALE */}
          <section className="space-y-8 pt-16 border-t border-white/10">
            <SectionHeading
              align="left"
              eyebrow="Typography Hierarchy"
              title="Serif Editorial & Precision Sans"
              subtitle="Cormorant Garamond creates literary grandeur for headlines, while Geist delivers micro-legibility for horological specs, prices, and navigation."
            />

            <div className="p-8 rounded-2xl bg-charcoal-950 border border-white/10 space-y-8">
              <div className="space-y-2 border-b border-white/5 pb-6">
                <div className="flex justify-between text-[10px] font-mono text-neutral-stone">
                  <span>Display 1 • Serif Luxury</span>
                  <span>72px / 4.5rem</span>
                </div>
                <div className="font-serif-luxury text-4xl sm:text-6xl font-light text-ivory">
                  Celestial Tourbillon VA-880
                </div>
              </div>

              <div className="space-y-2 border-b border-white/5 pb-6">
                <div className="flex justify-between text-[10px] font-mono text-neutral-stone">
                  <span>Section Headline • Serif Luxury</span>
                  <span>48px / 3rem</span>
                </div>
                <div className="font-serif-luxury text-3xl sm:text-4xl font-light text-ivory">
                  Two Centuries of Uncompromising Horology
                </div>
              </div>

              <div className="space-y-2 border-b border-white/5 pb-6">
                <div className="flex justify-between text-[10px] font-mono text-neutral-stone">
                  <span>Product Title • Serif Luxury</span>
                  <span>24px / 1.5rem</span>
                </div>
                <div className="font-serif-luxury text-2xl font-light text-metallic">
                  Chronographe Squelette Grade 5 Titanium
                </div>
              </div>

              <div className="space-y-2 border-b border-white/5 pb-6">
                <div className="flex justify-between text-[10px] font-mono text-neutral-stone">
                  <span>Editorial Narrative Body • Sans</span>
                  <span>14px / 0.875rem</span>
                </div>
                <p className="font-sans text-sm text-neutral-stone font-light leading-relaxed max-w-2xl">
                  Each bridge is cut by wire spark erosion before being hand-beveled with diamond paste and wooden gentian pegs. In our Geneva atelier, horologists work under natural north-facing light to achieve flawless optical reflection.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-neutral-stone">
                  <span>Micro-Caps & Tracking • Sans Ultra</span>
                  <span>10px / 0.625rem</span>
                </div>
                <div className="font-sans text-xs uppercase tracking-ultra font-semibold text-metallic">
                  GENÈVE HAUTE HORLOGERIE • LIMITED ALLOCATION NO. 08/25
                </div>
              </div>
            </div>
          </section>

          {/* 3. BUTTONS & ACTIONS */}
          <section className="space-y-8 pt-16 border-t border-white/10">
            <SectionHeading
              align="left"
              eyebrow="Interactive Elements"
              title="Buttons & Concierge Triggers"
              subtitle="Engineered for tactile dignity with subtle hover glows and restrained micro-motion."
            />

            <div className="p-8 rounded-2xl bg-charcoal-950 border border-white/10 space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Primary Metallic</Button>
                <Button variant="metallic">Gradient Metallic</Button>
                <Button variant="ivory">Solid Ivory</Button>
                <Button variant="secondary">Charcoal Panel</Button>
                <Button variant="outline">Outline Ivory</Button>
                <Button variant="outline-gold">Outline Metallic</Button>
                <Button variant="ghost">Ghost Trigger</Button>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-6">
                <span className="text-xs text-neutral-stone">Editorial Link:</span>
                <Button variant="editorial-link">
                  <span>Discover Calibre VA-920</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button variant="primary" size="sm">Small Size</Button>
                <Button variant="primary" size="lg">Large Size</Button>
                <Button variant="primary" isLoading>Processing</Button>
              </div>
            </div>
          </section>

          {/* 4. PRODUCT CARDS */}
          <section className="space-y-8 pt-16 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Catalog Showcase"
                title="Product Cards with Dual Angle Peek"
                subtitle="Hover over any timepiece or perfume flacon to preview the secondary detail angle, quick inspect, or acquire."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sampleProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onAddToBag={(p) => {
                    alert(`Added ${p.name} to your private atelier allocation.`);
                  }}
                />
              ))}
            </div>
          </section>

          {/* 5. COLLECTION CARDS */}
          <section className="space-y-8 pt-16 border-t border-white/10">
            <SectionHeading
              align="left"
              eyebrow="Editorial Collections"
              title="Curated Series Cards"
              subtitle="Cinematic full-bleed imagery with subtle hover zoom and typography reveals."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CollectionCard
                title="Grand Complications 2026"
                slug="grand-complications"
                description="Perpetual calendars, minute repeaters, and split-second flyback chronographs."
                imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85"
                itemCount={8}
                featured={true}
                aspectRatio="portrait"
              />

              <CollectionCard
                title="The Olfactive Sanctuary"
                slug="olfactive-sanctuary"
                description="35% concentration pure parfum extraits compounded and macerated in Grasse."
                imageUrl="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85"
                itemCount={5}
                featured={true}
                aspectRatio="portrait"
              />

              <CollectionCard
                title="Sovereign Rose Gold"
                slug="sovereign-rose-gold"
                description="18K ethically sourced rose gold cases paired with midnight aventurine dials."
                imageUrl="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85"
                itemCount={6}
                aspectRatio="portrait"
              />
            </div>
          </section>

          {/* 6. CAROUSEL PREVIEW */}
          <section className="space-y-8 pt-16 border-t border-white/10">
            <SectionHeading
              align="left"
              eyebrow="Dynamic Horizontal Flow"
              title="Product & Reference Carousel"
              subtitle="Responsive multi-slide layout with smooth easing and navigation controls."
            />

            <Carousel itemsPerView={3} showArrows={true} showDots={true}>
              {sampleProducts.concat(sampleProducts).map((prod, idx) => (
                <ProductCard
                  key={`${prod.id}-${idx}`}
                  product={prod}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </Carousel>
          </section>

          {/* 7. IMAGE REVEAL & MOTION */}
          <section className="space-y-8 pt-16 border-t border-white/10">
            <SectionHeading
              align="left"
              eyebrow="Cinematic Motion"
              title="Image Curtain & Mask Reveals"
              subtitle="Images unveil with a vertical curtain clip-path when scrolled into view, respecting reduced motion settings."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <ImageReveal
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85"
                alt="Horologist at work in Geneva atelier"
                aspectRatio="landscape"
                caption="Geneva Horological Benchwork • Black-Polished Escapement Bridge"
              />

              <div className="space-y-4">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic">
                  Micro-Mechanical Finishing
                </span>
                <h3 className="font-serif-luxury text-3xl font-light text-ivory">
                  Hand-Angled Interior Corners
                </h3>
                <p className="text-xs text-neutral-stone leading-relaxed font-light">
                  No CNC machine can execute a sharp internal corner angle. Only a master artisan with a boxwood lap and graded diamond micro-pastes can produce the mirror-sharp junction that defines true Haute Horlogerie.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Open Atelier Modal
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* 8. MODAL & DRAWER TRIGGERS */}
          <section className="space-y-8 pt-16 border-t border-white/10">
            <SectionHeading
              align="left"
              eyebrow="Overlays & Sliders"
              title="Modals & Slide-Out Drawers"
              subtitle="Smooth backdrop blur, ESC key dismissal, and body scroll lock."
            />

            <div className="flex flex-wrap items-center gap-4 p-8 rounded-2xl bg-charcoal-950 border border-white/10">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Trigger Atelier Modal
              </Button>
              <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
                Trigger Concierge Drawer
              </Button>
            </div>
          </section>
        </Container>
      </main>

      {/* SAMPLE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Private Viewing Salon"
        subtitle="Reserve an intimate session at our Geneva Rue du Rhône or London Mayfair suite."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-stone mb-1 uppercase tracking-editorial text-[10px]">
              Patron Full Name
            </label>
            <Input
              placeholder="e.g. Lord Alexander Kensington"
              className="bg-charcoal-900 border-white/10 text-ivory text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-stone mb-1 uppercase tracking-editorial text-[10px]">
                Email Address
              </label>
              <Input
                placeholder="collector@domain.com"
                className="bg-charcoal-900 border-white/10 text-ivory text-xs"
              />
            </div>
            <div>
              <label className="block text-neutral-stone mb-1 uppercase tracking-editorial text-[10px]">
                Preferred Salon
              </label>
              <select className="w-full h-10 px-3 bg-charcoal-900 border border-white/10 rounded-md text-ivory text-xs focus:ring-1 focus:ring-metallic">
                <option>Geneva — Rue du Rhône Suite</option>
                <option>London — Mayfair Private Lounge</option>
                <option>Monaco — Port Hercule Penthouse</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                alert("Private viewing request submitted to Maison Concierge.");
                setIsModalOpen(false);
              }}
            >
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* SAMPLE DRAWER */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Bespoke Concierge Desk"
        subtitle="Direct connection to our Geneva Master Watchmakers"
        footer={
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setIsDrawerOpen(false)}
          >
            Confirm Connection
          </Button>
        }
      >
        <div className="space-y-4 text-xs text-neutral-stone leading-relaxed">
          <p>
            Whether requesting a bespoke unique piece allocation, engraved hallmark monogramming, or custom parfum extraction, our private client directors are at your disposal.
          </p>

          <div className="p-4 rounded-xl bg-charcoal-900 border border-white/5 space-y-2">
            <div className="text-ivory font-medium text-sm">Geneva Workshop Desk</div>
            <div className="text-[11px] font-mono text-metallic">+41 22 819 9200</div>
            <div className="text-[11px] text-neutral-stone">Hours: 09:00 – 19:00 CET</div>
          </div>
        </div>
      </Drawer>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <Modal
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          title={quickViewProduct.name}
          subtitle={`SKU: ${quickViewProduct.sku || "N/A"} • ${quickViewProduct.category?.name || "Haute Horlogerie"}`}
          size="lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="aspect-[3/4] bg-charcoal-900 rounded-lg overflow-hidden border border-white/10">
              <img
                src={quickViewProduct.imageUrl}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="text-2xl font-serif-luxury font-light text-metallic">
                ${quickViewProduct.price.toLocaleString()} USD
              </div>
              <p className="text-xs text-neutral-stone leading-relaxed font-light">
                {quickViewProduct.specs ||
                  "Handcrafted reference piece with black-polished anglage, silicon hairspring, and 72-hour power reserve."}
              </p>
              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    alert(`Allocated ${quickViewProduct.name}`);
                    setQuickViewProduct(null);
                  }}
                >
                  Acquire This Piece
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setQuickViewProduct(null)}
                >
                  Continue Browsing
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Real Interactive Footer */}
      <Footer />
    </div>
  );
}
