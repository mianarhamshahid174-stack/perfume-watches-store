export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_CONFIRMED"
  | "IN_ATELIER_ASSEMBLY"
  | "DISPATCHED_SECURE_COURIER"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderAddress {
  firstName: string;
  lastName: string;
  company?: string | null;
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
}

export interface OrderItemSummary {
  id: string;
  productName: string;
  productSku: string;
  unitPriceInCents: number;
  quantity: number;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalInCents: number;
  subtotalInCents: number;
  taxInCents: number;
  shippingInCents: number;
  currency: string;
  paymentStatus: string;
  carrier?: string | null;
  trackingNumber?: string | null;
  createdAt: Date | string;
  items: OrderItemSummary[];
  shippingAddress?: OrderAddress | null;
}
