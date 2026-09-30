export const BRAND = {
  name: "VELORA",
  formalName: "VELORA ATELIERS",
  tagline: "Haute Horlogerie & Pure Parfum Extraits",
  subtitle: "Maison de Haute Horlogerie & Parfumerie d'Auteur",
  founded: "1892",
  atelierLocation: "Genève • Grasse",
  currency: "USD",
  currencySymbol: "$",
  email: "concierge@velora-ateliers.com",
  phone: "+41 22 819 9200",
} as const;

export interface MegaMenuColumn {
  title: string;
  items: Array<{ label: string; href: string; description?: string }>;
}

export interface MegaMenuFeatured {
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  tag: string;
}

export interface StorefrontNavItem {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
  megaMenu?: {
    columns: MegaMenuColumn[];
    featured: MegaMenuFeatured;
  };
}

export const STOREFRONT_NAV: StorefrontNavItem[] = [
  {
    label: "Watches",
    href: "/watches",
    hasMegaMenu: true,
    megaMenu: {
      columns: [
        {
          title: "Horological Complications",
          items: [
            { label: "Grand Complications", href: "/collections/grand-complications", description: "Perpetual calendars & minute repeaters" },
            { label: "Tourbillon Celestial", href: "/watches/tourbillon-celestial", description: "Free-sprung flying tourbillons" },
            { label: "Chronographe Squelette", href: "/watches/chronographe-squelette", description: "Column-wheel flyback calibers" },
            { label: "Monolithic Automatique", href: "/watches/monolithic-automatique", description: "Grade 5 Titanium daily references" },
          ],
        },
        {
          title: "Atelier Craftsmanship",
          items: [
            { label: "Hand-Beveled Anglage", href: "/journal/art-of-anglage", description: "Black-polished steel & interior angles" },
            { label: "Grand Feu Enameling", href: "/journal/grand-feu-enamel", description: "800°C kiln-fired artisan dials" },
            { label: "In-House Calibers", href: "/our-story#calibers", description: "Engineered in our Geneva workshop" },
            { label: "Bespoke Commissions", href: "/concierge#bespoke", description: "Custom engraved & unique piece builds" },
          ],
        },
      ],
      featured: {
        title: "Chronographe Squelette Grade 5",
        subtitle: "Flyback Calibre VA-920 with 72-Hour Reserve",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
        href: "/watches/chronographe-squelette",
        tag: "Reference Masterpiece",
      },
    },
  },
  {
    label: "Fragrances",
    href: "/fragrances",
    hasMegaMenu: true,
    megaMenu: {
      columns: [
        {
          title: "Pure Parfum Extraits",
          items: [
            { label: "Céleste Oud Pure Extrait", href: "/fragrances/celeste-oud", description: "35% concentration wild Assamese oud" },
            { label: "Nocturne d'Ambre", href: "/fragrances/nocturne-d-ambre", description: "Rare Baltic amber & smoked cedar" },
            { label: "Santal Impérial", href: "/fragrances/santal-imperial", description: "Mysore sandalwood aged in Grasse oak" },
            { label: "Rose Sépia Extrait", href: "/fragrances/rose-sepia", description: "May rose with frankincense tears" },
          ],
        },
        {
          title: "Artisanal Sanctuary",
          items: [
            { label: "The Grasse Atelier", href: "/our-story#grasse", description: "Field-to-flacon botanical compounding" },
            { label: "Discovery Coffret", href: "/fragrances/discovery-coffret", description: "Complete five-piece extrait curation" },
            { label: "Crystal Decanters", href: "/collections/crystal-flacons", description: "Hand-blown heavy crystal vessels" },
            { label: "Private Blending Salon", href: "/concierge#perfume", description: "Personal signature olfactive creation" },
          ],
        },
      ],
      featured: {
        title: "Céleste Oud Pure Parfum",
        subtitle: "Hand-Numbered Flacon in Heavy Smoked Crystal",
        imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85",
        href: "/fragrances/celeste-oud",
        tag: "Grasse Extract",
      },
    },
  },
  {
    label: "Collections",
    href: "/collections",
    hasMegaMenu: true,
    megaMenu: {
      columns: [
        {
          title: "Curated Editions",
          items: [
            { label: "Grand Complications 2026", href: "/collections/grand-complications", description: "Limited numbered allocations" },
            { label: "Grasse Reserve Parfums", href: "/collections/grasse-reserve", description: "Aged botanical extraits" },
            { label: "Sovereign Rose Gold", href: "/collections/sovereign-rose-gold", description: "18K ethical gold complications" },
            { label: "Titanium Monolith", href: "/collections/titanium-monolith", description: "Ultra-lightweight modern sports pieces" },
          ],
        },
        {
          title: "Maison Archive",
          items: [
            { label: "Past Masterpieces", href: "/collections/archive", description: "Closed numbered series" },
            { label: "Salon QP Special Releases", href: "/collections/salon-qp", description: "London and Geneva exhibition pieces" },
            { label: "Certified Pre-Owned", href: "/collections/cpo", description: "Maison-inspected and guaranteed" },
          ],
        },
      ],
      featured: {
        title: "The Sovereign Gold Series",
        subtitle: "18K Rose Gold with Aventurine Dials",
        imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85",
        href: "/collections/sovereign-rose-gold",
        tag: "Limited to 25 Pieces",
      },
    },
  },
  { label: "Gifts", href: "/gifts" },
  { label: "Our Story", href: "/our-story" },
  { label: "Journal", href: "/journal" },
];

export const FOOTER_SECTIONS = [
  {
    title: "Atelier Creations",
    links: [
      { label: "Grand Complications", href: "/collections/grand-complications" },
      { label: "Tourbillon Timepieces", href: "/watches" },
      { label: "Pure Parfum Extraits", href: "/fragrances" },
      { label: "Bespoke Horology", href: "/concierge" },
      { label: "Discovery Coffrets", href: "/gifts" },
    ],
  },
  {
    title: "The Maison",
    links: [
      { label: "Our Heritage", href: "/our-story" },
      { label: "Geneva Workshop", href: "/our-story#geneva" },
      { label: "Grasse Laboratory", href: "/our-story#grasse" },
      { label: "Maison Journal", href: "/journal" },
      { label: "Private Viewing Salons", href: "/salons" },
    ],
  },
  {
    title: "Client Care & Concierge",
    links: [
      { label: "Private Concierge Desk", href: "/concierge" },
      { label: "Armored Delivery & Insurance", href: "/shipping" },
      { label: "Five-Year Warranty & Service", href: "/warranty" },
      { label: "Authentication & Hallmarks", href: "/authentication" },
      { label: "Schedule Private Viewing", href: "/viewing" },
    ],
  },
  {
    title: "Legal & Ethics",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Acquisition", href: "/terms" },
      { label: "Ethical Gold & Sourcing", href: "/ethics" },
      { label: "Cookie Preferences", href: "#cookies" },
    ],
  },
];
