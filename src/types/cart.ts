import { ProductItem, ProductVariantItem } from "./product";

export interface CartItemType {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  product: Pick<ProductItem, "id" | "name" | "slug" | "sku" | "price" | "images">;
  variant?: ProductVariantItem | null;
}

export interface CartType {
  id: string;
  userId?: string | null;
  guestToken?: string | null;
  items: CartItemType[];
  subtotal: number;
  itemCount: number;
}
