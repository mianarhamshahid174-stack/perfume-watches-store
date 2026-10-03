export interface CachedOrder {
  id: string;
  orderNumber: string;
  status: string;
  fulfillmentStatus: string;
  createdAt: string;
  trackingNumber: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  notes?: string;
  items: Array<{
    id: string;
    productName: string;
    productSku: string;
    imageUrl: string;
    quantity: number;
    unitPriceUSD: number;
    unitPricePKR: number;
    totalPriceUSD: number;
    totalPricePKR: number;
    variantTitle?: string;
  }>;
  pricing: {
    formattedTotalPKR: string;
    formattedSubtotalPKR: string;
    formattedDiscountPKR: string;
    formattedShippingPKR: string;
    totalUSD: number;
  };
  payment: {
    method: string;
    status: string;
    amountPKR: string;
    amountUSD: string;
    isCOD: boolean;
  };
  timeline: Array<{
    step: string;
    status: string;
    date?: string;
    description: string;
    isDone: boolean;
  }>;
}

// Global in-memory cache preserved across Next.js dev server reloads
const globalOrders = global as unknown as { __velora_orders?: Map<string, CachedOrder> };
if (!globalOrders.__velora_orders) {
  globalOrders.__velora_orders = new Map();
}

export const ordersCache = globalOrders.__velora_orders;

export function saveCachedOrder(order: CachedOrder) {
  ordersCache.set(order.id, order);
  ordersCache.set(order.orderNumber, order);
}

export function getCachedOrder(idOrNumber: string): CachedOrder | undefined {
  return ordersCache.get(idOrNumber);
}
