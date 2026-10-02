export const BRAND = {
  name: "VELORA",
  formalName: "VELORA ATELIERS",
  tagline: "Luxury Watches & Fine Fragrances",
  subtitle: "Handcrafted Swiss Timepieces and Artisanal Perfumes",
  founded: "1892",
  atelierLocation: "Geneva & Grasse",
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
          title: "Featured Models",
          items: [
            { label: "VELORA SIGNATURE 01", href: "/product/velora-signature-01", description: "39mm steel with ivory dial and blued hands" },
            { label: "VELORA SIGNATURE 02", href: "/product/velora-signature-02", description: "18k Rose Gold with charcoal fumé dial" },
            { label: "VELORA NOIR 01", href: "/product/velora-noir-01", description: "Grade 5 DLC Titanium with matte black dial" },
            { label: "VELORA NOIR 02", href: "/product/velora-noir-02", description: "Openworked ceramic skeleton watch" },
            { label: "VELORA CLASSIC 01", href: "/product/velora-classic-01", description: "Ultra-slim dress watch with white enamel dial" },
            { label: "VELORA AUREL 01", href: "/product/velora-aurel-01", description: "18k Champagne Gold with brick-link bracelet" },
          ],
        },
        {
          title: "By Collection",
          items: [
            { label: "Signature Collection", href: "/collections/signature", description: "Timeless everyday proportions" },
            { label: "Noir Collection", href: "/collections/noir", description: "Monochrome titanium and ceramic" },
            { label: "Classic Collection", href: "/collections/classic", description: "Ultra-thin dress watches" },
            { label: "All Watches", href: "/watches", description: "Browse the complete horology catalog" },
          ],
        },
      ],
      featured: {
        title: "VELORA SIGNATURE 01",
        subtitle: "In-house automatic movement with 68 hours power reserve",
        imageUrl: "/images/products/watches/velora-signature-01/front.jpg",
        href: "/product/velora-signature-01",
        tag: "Flagship Model",
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
          title: "Extrait de Parfum",
          items: [
            { label: "VELORA NOIR", href: "/product/velora-noir-extrait", description: "Smoked leather, dark birch, and agarwood" },
            { label: "VELORA AURA", href: "/product/velora-aura-extrait", description: "Calabrian bergamot, jasmine, and warm amber" },
            { label: "VELORA ÉLAN", href: "/product/velora-elan-extrait", description: "Fresh juniper, green cypress, and vetiver" },
            { label: "VELORA OUD", href: "/product/velora-oud-extrait", description: "Wild Cambodian agarwood and saffron" },
            { label: "VELORA SANTÉ", href: "/product/velora-sante-extrait", description: "Imperial white tea, pear, and soft rose" },
          ],
        },
        {
          title: "Explore",
          items: [
            { label: "All Fragrances", href: "/fragrances", description: "Browse all pure extraits de parfum" },
            { label: "Nocturne Privé", href: "/collections/nocturne-prive", description: "Evening and contemplative perfumes" },
            { label: "Fragrance Gift Sets", href: "/fragrances", description: "Luxury packaging and presentation boxes" },
            { label: "Our Story in Grasse", href: "/journal", description: "Read about our botanical distillation" },
          ],
        },
      ],
      featured: {
        title: "VELORA NOIR Extrait",
        subtitle: "32% oil concentration in smoked obsidian crystal",
        imageUrl: "/images/products/fragrances/velora-noir-extrait/bottle-front.jpg",
        href: "/product/velora-noir-extrait",
        tag: "Bestseller",
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
          title: "Watch Collections",
          items: [
            { label: "Signature", href: "/collections/signature", description: "Classic everyday luxury" },
            { label: "Noir", href: "/collections/noir", description: "Stealth titanium & black ceramic" },
            { label: "Classic", href: "/collections/classic", description: "Slim formal dress timepieces" },
          ],
        },
        {
          title: "Fragrance Lines",
          items: [
            { label: "Nocturne Privé", href: "/collections/nocturne-prive", description: "Deep evening extraits" },
            { label: "All Collections", href: "/collections", description: "View all curations" },
            { label: "All Watches", href: "/watches", description: "View all timepieces" },
            { label: "All Fragrances", href: "/fragrances", description: "View all perfumes" },
          ],
        },
      ],
      featured: {
        title: "The Signature Collection",
        subtitle: "Minimalist dials and surgical steel cases",
        imageUrl: "/images/products/watches/velora-signature-01/editorial.jpg",
        href: "/collections/signature",
        tag: "Core Line",
      },
    },
  },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export const FOOTER_SECTIONS = [
  {
    title: "Watches",
    links: [
      { label: "Signature Collection", href: "/collections/signature" },
      { label: "Noir Collection", href: "/collections/noir" },
      { label: "Classic Collection", href: "/collections/classic" },
      { label: "All Watches", href: "/watches" },
    ],
  },
  {
    title: "Fragrances",
    links: [
      { label: "All Fragrances", href: "/fragrances" },
      { label: "Nocturne Privé", href: "/collections/nocturne-prive" },
      { label: "All Collections", href: "/collections" },
      { label: "Search Catalog", href: "/search" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Frequently Asked Questions", href: "/faq" },
    ],
  },
  {
    title: "About VELORA",
    links: [
      { label: "Our Story", href: "/journal" },
      { label: "The Journal", href: "/journal" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
