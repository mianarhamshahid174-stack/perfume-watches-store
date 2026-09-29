import Link from "next/link";
import { getProducts } from "@/services/product.service";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import { ArrowRight, Compass, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StorefrontHomePage() {
  const featuredProducts = await getProducts({ isFeatured: true, limit: 4 });

  return (
    <div className="flex flex-col space-y-24 sm:space-y-32 pb-24">
      {/* Editorial Luxury Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(197,160,89,0.15),rgba(8,8,8,0))]" />

        <Container size="default" className="relative z-10 text-center py-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            <span className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-gold-300">
              Geneva Ateliers • Grasse Laboratories
            </span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-sand-50 max-w-5xl mx-auto leading-[1.08] mb-6">
            Where Mechanical Precision Meets Olfactive Artistry.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-platinum-400 font-light max-w-2xl mx-auto leading-relaxed mb-10 tracking-wide">
            ZAVEN engineers hand-beveled architectural timepieces and extraits de parfum distilled from aged natural botanicals. Produced exclusively in finite, numbered editions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/watches">
              <Button variant="primary" size="lg">
                Explore Haute Horlogerie
              </Button>
            </Link>
            <Link href="/fragrances">
              <Button variant="outline-gold" size="lg">
                Discover High Perfumery
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Flagship Creations Gallery */}
      <section>
        <Container size="wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-mono tracking-ultra uppercase text-gold-400 block mb-2">
                Curated Selection
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-sand-50">
                Flagship Masterworks
              </h2>
            </div>
            <Link
              href="/collections"
              className="mt-4 md:mt-0 inline-flex items-center text-xs tracking-luxury uppercase text-platinum-300 hover:text-gold-400 transition-colors group"
            >
              <span>View Full Repertoire</span>
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      {/* The Pillars of Maison ZAVEN */}
      <section className="border-y border-white/5 py-24 bg-noir-950/60">
        <Container size="default">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-mono tracking-ultra uppercase text-gold-400 block mb-2">
              Uncompromising Standards
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-sand-50">
              The Architecture of Luxury
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Pillar 1 */}
            <div className="border border-white/5 bg-noir-900/40 p-8 space-y-4 hover:border-gold-500/20 transition-colors duration-300">
              <div className="h-10 w-10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-serif-luxury text-xl font-normal text-sand-50">
                Architectural Horology
              </h3>
              <p className="text-xs text-platinum-400 font-light leading-relaxed">
                Proprietary calibres featuring hand-beveled anglages, titanium bridges, and flying tourbillons tuned to precision chronometer thresholds.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="border border-white/5 bg-noir-900/40 p-8 space-y-4 hover:border-gold-500/20 transition-colors duration-300">
              <div className="h-10 w-10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-serif-luxury text-xl font-normal text-sand-50">
                Artisanal Extractions
              </h3>
              <p className="text-xs text-platinum-400 font-light leading-relaxed">
                Extraits de parfum matured for six months in Grasse laboratories, incorporating sustainable Mysore sandalwood, aged Cambodian oud, and rare ambers.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="border border-white/5 bg-noir-900/40 p-8 space-y-4 hover:border-gold-500/20 transition-colors duration-300">
              <div className="h-10 w-10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-serif-luxury text-xl font-normal text-sand-50">
                Armored Provenance
              </h3>
              <p className="text-xs text-platinum-400 font-light leading-relaxed">
                Every acquisition is sealed in specialized climate cases, accompanied by digital certificates of origin and delivered via armored logistics.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Private Concierge Banner */}
      <section>
        <Container size="default">
          <div className="relative overflow-hidden border border-gold-500/30 bg-gradient-to-r from-noir-900 via-noir-850 to-noir-900 p-8 sm:p-14 text-center">
            <div className="relative z-10 max-w-xl mx-auto space-y-5">
              <span className="text-[10px] font-mono tracking-ultra uppercase text-gold-400">
                Private Client Services
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-sand-50">
                Request a Private Salon Consultation
              </h2>
              <p className="text-xs text-platinum-400 font-light leading-relaxed">
                Reserve an appointment with a ZAVEN horological consultant or request allocation priority for upcoming limited complication releases.
              </p>
              <div className="pt-2">
                <Link href="/concierge">
                  <Button variant="primary" size="md">
                    Initiate Private Inquiry
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
