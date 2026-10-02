export type PaymentMethodId = "cod" | "bank_transfer" | "online" | "online_gateway";

export interface PaymentInitiateRequest {
  orderId: string;
  orderNumber: string;
  amountPKR: number;
  amountUSD: number;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: string;
}

export interface PaymentInitiateResult {
  success: boolean;
  providerId: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "Confirmed" | "Pending" | "Processing";
  message: string;
  instructions?: string;
  redirectUrl?: string;
  transactionId?: string;
  rawDetails?: Record<string, any>;
}

export interface PaymentProvider {
  id: PaymentMethodId;
  name: string;
  title: string;
  description: string;
  isOnline: boolean;
  isAvailable(): boolean;
  initiatePayment(request: PaymentInitiateRequest): Promise<PaymentInitiateResult>;
  verifyPayment?(transactionId: string, payload: any): Promise<boolean>;
}
