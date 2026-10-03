export const BRAND = {
  name: "VELORA",
  formalName: "VELORA PAKISTAN",
  tagline: "Luxury Watches & Fine Fragrances",
  subtitle: "Pakistan's Premier Luxury Watch and Fragrance House",
  founded: "2020",
  atelierLocation: "Pakistan",
  currency: "PKR",
  currencySymbol: "Rs.",
  email: "concierge@velorawatches.pk",
  phone: "+92 300 1234567",
  whatsapp: "+92 300 1234567",
  whatsappUrl: "https://wa.me/923001234567?text=Hello%20VELORA%20Pakistan,%20I%20would%20like%20assistance%20with%20an%20order",
  boutiques: [
    { city: "Lahore", address: "M.M. Alam Road, Gulberg III" },
    { city: "Karachi", address: "E-Street, Clifton Block 4" },
    { city: "Islamabad", address: "Beverly Centre, Blue Area" },
  ],
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
            { label: "All Watches", href: "/watches", description: "Browse the complete luxury watch catalog" },
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
          title: "Pure Perfumes",
          items: [
            { label: "VELORA NOIR", href: "/product/velora-noir-extrait", description: "Smoked leather, dark birch, and aged agarwood" },
            { label: "VELORA AURA", href: "/product/velora-aura-extrait", description: "Citrus, solar jasmine, and warm amber" },
            { label: "VELORA ÉLAN", href: "/product/velora-elan-extrait", description: "Fresh juniper, green cypress, and vetiver" },
            { label: "VELORA OUD", href: "/product/velora-oud-extrait", description: "Rare Cambodian agarwood and saffron threads" },
            { label: "VELORA SANTÉ", href: "/product/velora-sante-extrait", description: "White tea, crisp pear, and soft rose" },
          ],
        },
        {
          title: "Explore",
          items: [
            { label: "All Fragrances", href: "/fragrances", description: "Browse all pure concentrated perfumes" },
            { label: "Nocturne Collection", href: "/collections/nocturne-prive", description: "Evening and contemplative perfumes" },
            { label: "Presentation Gift Boxes", href: "/fragrances", description: "Velvet gift boxes and coffrets" },
            { label: "Our Story", href: "/journal", description: "Read about our craftsmanship and distillation" },
          ],
        },
      ],
      featured: {
        title: "VELORA NOIR",
        subtitle: "32% perfume oil concentration in smoked crystal bottle",
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
            { label: "Nocturne Collection", href: "/collections/nocturne-prive", description: "Deep evening concentrated perfumes" },
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
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Track Order", href: "/track-order" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export const FOOTER_SECTIONS = [
  {
    title: "Watches",
    links: [
      { label: "Best Sellers", href: "/best-sellers" },
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
      { label: "Nocturne Collection", href: "/collections/nocturne-prive" },
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "All Collections", href: "/collections" },
      { label: "Search Catalog", href: "/search" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Track Your Order", href: "/track-order" },
      { label: "Care & Maintenance Guide", href: "/care-guide" },
      { label: "Contact Us", href: "/contact" },
      { label: "Nationwide Shipping", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Frequently Asked Questions", href: "/faq" },
      { label: "5-Year Warranty", href: "/warranty" },
    ],
  },
  {
    title: "About VELORA",
    links: [
      { label: "Our Story", href: "/journal" },
      { label: "The Journal", href: "/journal" },
      { label: "Showrooms", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
