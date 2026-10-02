export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface WatchSpecifications {
  movement?: string | null;
  powerReserve?: string | null;
  caseMaterial?: string | null;
  caseDiameter?: string | null;
  caseThickness?: string | null;
  crystal?: string | null;
  waterResistance?: string | null;
  dialColor?: string | null;
  strapMaterial?: string | null;
  clasp?: string | null;
}

export interface FragranceSpecifications {
  concentration?: string | null;
  olfactiveFamily?: string | null;
  gender?: string | null;
  volumeMl?: number | null;
}

export interface ProductImageItem {
  id: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductVideoItem {
  id: string;
  url: string;
  title?: string | null;
  posterUrl?: string | null;
  sortOrder: number;
}

export interface MacroDetailItem {
  part: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  title: string;
  price: number;
  stock: number;
  attributes?: Record<string, string> | null;
}

export interface ProductItem extends WatchSpecifications, FragranceSpecifications {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number; // Decimal converted to number for UI
  compareAtPrice?: number | null;
  cost?: number | null;
  tags?: string[];
  status: ProductStatus;
  featured: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  images: ProductImageItem[];
  videos?: ProductVideoItem[];
  variants?: ProductVariantItem[];
  macroDetails?: MacroDetailItem[];
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  collections?: Array<{
    collection: {
      id: string;
      name: string;
      slug: string;
      bannerUrl?: string | null;
    };
  }>;
  inventory?: {
    quantity: number;
    warehouseLocation?: string | null;
  } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProductFilterParams {
  categorySlug?: string;
  collectionSlug?: string;
  isFeatured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  movement?: string;
  strap?: string;
  caseMaterial?: string;
  dialColor?: string;
  fragranceFamily?: string;
  gender?: string;
  availability?: "in_stock" | "all";
  sortBy?: "featured" | "newest" | "price-asc" | "price-desc" | "best-selling";
  page?: number;
  limit?: number;
}
