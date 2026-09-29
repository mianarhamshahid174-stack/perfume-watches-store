import Link from "next/link";
import Image from "next/image";
import { ProductItem } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

  const collectionName = product.collections?.[0]?.collection?.name || product.category?.name || "Haute Horlogerie";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block relative"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-noir-900 border border-white/5 transition-all duration-500 group-hover:border-gold-500/30">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.featured && <Badge variant="gold">Maison Masterwork</Badge>}
        </div>

        {/* Primary Image */}
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-all duration-700 ease-luxury group-hover:scale-105 group-hover:opacity-90"
          />
        )}

        {/* Subtle dark luxury vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

        {/* Quick Specs Peek on Hover */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="glass-panel-subtle p-2.5 text-[10px] text-platinum-300">
            <p className="truncate">
              {product.movement || product.concentration || product.caseMaterial || "Haute Horlogerie"}
            </p>
          </div>
        </div>
      </div>

      {/* Meta info below */}
      <div className="pt-4 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] tracking-luxury uppercase text-platinum-500">
          <span>{collectionName}</span>
          <span className="font-mono">{product.sku}</span>
        </div>

        <h3 className="font-serif-luxury text-base sm:text-lg font-light tracking-wide text-sand-50 group-hover:text-gold-300 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-xs font-sans text-gold-400 font-medium tracking-wide">
          {formatCurrency(product.price * 100)}
        </p>
      </div>
    </Link>
  );
}
