import { PaymentProvider, PaymentInitiateRequest, PaymentInitiateResult } from "../types";
import { formatPKR } from "@/lib/currency";

export class CODPaymentProvider implements PaymentProvider {
  id = "cod" as const;
  name = "Cash on Delivery";
  title = "Cash on Delivery (Armored Handover)";
  description = "Discreet armored delivery across Pakistan. Pay securely in cash or bank pay order upon inspection and white-glove handover at your doorstep.";
  isOnline = false;

  isAvailable(): boolean {
    return true; // Always available in Pakistan market
  }

  async initiatePayment(request: PaymentInitiateRequest): Promise<PaymentInitiateResult> {
    const formattedAmount = formatPKR(request.amountPKR);
    return {
      success: true,
      providerId: this.id,
      paymentStatus: "PENDING",
      orderStatus: "Confirmed",
      transactionId: `COD-${request.orderNumber}-${Date.now().toString(36).toUpperCase()}`,
      message: "Order placed successfully under Cash on Delivery terms.",
      instructions: `Please keep exact amount (${formattedAmount}) ready in cash or bank pay order payable to VELORA Ateliers upon armored courier arrival.`,
      rawDetails: {
        paymentMethod: "COD",
        currency: "PKR",
        amountPKR: request.amountPKR,
        terms: "Verified Armored Handover",
      },
    };
  }
}
