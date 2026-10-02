"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, ShieldCheck, Truck, RotateCcw, Compass, Feather } from "lucide-react";
import { ProductItem } from "@/types/product";

interface ProductAccordionProps {
  product: ProductItem;
}

export function ProductAccordion({ product }: ProductAccordionProps) {
  // Allow toggling multiple sections or one at a time
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    details: false,
    materials: false,
    movement: false,
    shipping: false,
    returns: false,
    warranty: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isWatch =
    product.category?.slug === "haute-horlogerie" ||
    !!product.movement ||
    !!product.caseMaterial;

  const sections = [
    {
      id: "description",
      title: "DESCRIPTION",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-platinum-300 font-light leading-relaxed">
          <p>{product.description}</p>
          <p>
            Every component in this creation is engineered to finite tolerances within our Geneva and Grasse ateliers. Form follows mechanical integrity, resulting in an aesthetic of disciplined restraint.
          </p>
        </div>
      ),
    },
    {
      id: "details",
      title: "DETAILS",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
          <div className="space-y-1 border-b border-white/5 pb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
              Reference Identifier
            </span>
            <p className="text-sand-100 font-mono">{product.sku}</p>
          </div>
          {product.caseDiameter && (
            <div className="space-y-1 border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                Case Diameter
              </span>
              <p className="text-sand-100">{product.caseDiameter}</p>
            </div>
          )}
          {product.caseThickness && (
            <div className="space-y-1 border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                Case Thickness
              </span>
              <p className="text-sand-100">{product.caseThickness}</p>
            </div>
          )}
          {product.waterResistance && (
            <div className="space-y-1 border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                Water Resistance
              </span>
              <p className="text-sand-100">{product.waterResistance}</p>
            </div>
          )}
          {product.dialColor && (
            <div className="space-y-1 border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                Dial Architecture
              </span>
              <p className="text-sand-100">{product.dialColor}</p>
            </div>
          )}
          {product.volumeMl && (
            <div className="space-y-1 border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                Flacon Volume
              </span>
              <p className="text-sand-100">{product.volumeMl} ml / 3.4 fl. oz.</p>
            </div>
          )}
          <div className="space-y-1 border-b border-white/5 pb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
              Atelier Provenance
            </span>
            <p className="text-sand-100">Geneva, Switzerland & Grasse, France</p>
          </div>
        </div>
      ),
    },
    {
      id: "materials",
      title: "MATERIALS",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-platinum-300 font-light leading-relaxed">
          {product.caseMaterial && (
            <div>
              <strong className="text-sand-100 font-normal">Metallurgy: </strong>
              <span>{product.caseMaterial} — surgically machined and hand-finished with dual satin and anglage polish.</span>
            </div>
          )}
          {product.crystal && (
            <div>
              <strong className="text-sand-100 font-normal">Crystal: </strong>
              <span>{product.crystal}.</span>
            </div>
          )}
          {product.strapMaterial && (
            <div>
              <strong className="text-sand-100 font-normal">Strap / Bracelet: </strong>
              <span>{product.strapMaterial} with handcrafted tone-on-tone French beeswax saddle stitching.</span>
            </div>
          )}
          {product.clasp && (
            <div>
              <strong className="text-sand-100 font-normal">Buckle / Clasp: </strong>
              <span>{product.clasp}.</span>
            </div>
          )}
          {!isWatch && product.concentration && (
            <div>
              <strong className="text-sand-100 font-normal">Essence Formulation: </strong>
              <span>{product.concentration} containing pure botanical absolutes and slow-macerated aged tinctures.</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "movement",
      title: isWatch ? "MOVEMENT" : "OLFACTORY ARCHITECTURE",
      content: isWatch ? (
        <div className="space-y-4 text-xs sm:text-sm text-platinum-300 font-light leading-relaxed">
          <div className="flex items-center gap-2 text-gold-400 font-mono text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>{product.movement || "In-House Swiss Calibre"}</span>
          </div>
          <p>
            Regulated across five positions and three temperatures in our Geneva ateliers. Components are adorned with hand-applied Côtes de Genève stripes, circular graining (perlage), and diamond-beveled bridges.
          </p>
          {product.powerReserve && (
            <div className="flex items-center gap-4 text-xs pt-1">
              <span className="text-neutral-400 uppercase tracking-widest font-mono text-[10px]">
                Power Reserve:
              </span>
              <span className="text-sand-50 font-mono font-medium">{product.powerReserve}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm text-platinum-300 font-light leading-relaxed">
          <div className="text-gold-400 font-mono text-xs uppercase tracking-wider">
            Family: {product.olfactiveFamily || "High Perfumery Extrait"}
          </div>
          <p>
            Formulated in Grasse over an uninterrupted 180-day cold maturation cycle. The formula combines rare natural raw absolutes, sustainable sandalwood, and aged ambergris to produce a lingering sillage of remarkable longevity.
          </p>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "SHIPPING",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-platinum-300 font-light leading-relaxed">
          <p>
            Every VELORA creation is dispatched in a climate-controlled, tamper-evident armored vault case. Delivery is coordinated by Ferrari Secure Armored Logistics with GPS tracking and white-glove personal handover.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-neutral-400">
            <li>Complimentary insured worldwide transit on all orders.</li>
            <li>Direct adult signature and photo identification required upon delivery.</li>
            <li>Delivery timeline: 2–4 business days within Europe & North America; 3–5 days worldwide.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "returns",
      title: "RETURNS",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-platinum-300 font-light leading-relaxed">
          <p>
            We offer a 14-day complimentary vault return policy from the moment of physical receipt. Timepieces and extraits must remain unworn, with all tamper-evident seals, stickers, and certificate papers intact.
          </p>
          <p className="text-xs text-neutral-400">
            To arrange a collection, contact our Private Concierge. An armored courier will be scheduled at your residence or private office at your convenience.
          </p>
        </div>
      ),
    },
    {
      id: "warranty",
      title: "WARRANTY",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-platinum-300 font-light leading-relaxed">
          <p>
            Your acquisition is accompanied by the VELORA 5-Year International Atelier Guarantee, recorded in our Geneva registry.
          </p>
          <p className="text-xs text-neutral-400">
            This covers any manufacturing or mechanical deviation, complimentary pressure testing, ultrasonic case hygiene, and one complimentary comprehensive movement service during the warranty tenure.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full border-t border-white/10 divide-y divide-white/10">
      {sections.map((sec) => {
        const isOpen = !!openSections[sec.id];
        return (
          <div key={sec.id} className="py-4 sm:py-5">
            <button
              type="button"
              onClick={() => toggleSection(sec.id)}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="text-xs sm:text-sm font-sans font-medium tracking-[0.2em] text-sand-100 group-hover:text-gold-300 transition-colors">
                {sec.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 group-hover:text-gold-300 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">{sec.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
