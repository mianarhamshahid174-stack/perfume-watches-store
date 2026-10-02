"use client";

import * as React from "react";
import { ProductCardData } from "@/components/storefront/product-card";
import { FilterBar } from "./filter-bar";
import { ProductGrid } from "./product-grid";
import { FilterOptionsData } from "./filter-drawer";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface CatalogViewProps {
  products: ProductCardData[];
  mode: "watches" | "fragrances" | "all";
  filterOptions: FilterOptionsData;
  defaultColumns?: 3 | 4;
}

export function CatalogView({
  products,
  mode,
  filterOptions,
  defaultColumns = 4,
}: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [columns, setColumns] = React.useState<3 | 4>(defaultColumns);

  const handleResetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="w-full">
      <FilterBar
        totalCount={products.length}
        mode={mode}
        options={filterOptions}
        columns={columns}
        onColumnsChange={setColumns}
      />

      <ProductGrid
        products={products}
        onResetFilters={handleResetFilters}
        columns={columns}
      />
    </div>
  );
}
