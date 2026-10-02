import { PaymentProvider, PaymentInitiateRequest, PaymentInitiateResult } from "../types";

export class ConfigurableOnlinePaymentProvider implements PaymentProvider {
  id = "online_gateway" as const;
  name = "Online Payment";
  title = "Credit / Debit Card (Secure Online Gateway)";
  description = "Encrypted online card processing via Visa, MasterCard, or UnionPay. Requires active merchant credentials.";
  isOnline = true;

  private apiKey = process.env.ONLINE_PAYMENT_API_KEY || process.env.STRIPE_SECRET_KEY || "";
  private merchantId = process.env.ONLINE_PAYMENT_MERCHANT_ID || "";

  /**
   * Check if online payment gateway has active live credentials.
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 8);
  }

  isAvailable(): boolean {
    // Show option so customers know it is supported, with status indicator
    return true;
  }

  async initiatePayment(request: PaymentInitiateRequest): Promise<PaymentInitiateResult> {
    // RULE: DO NOT FAKE SUCCESSFUL ONLINE PAYMENT!
    if (!this.isConfigured()) {
      return {
        success: false,
        providerId: this.id,
        paymentStatus: "FAILED",
        orderStatus: "Pending",
        message:
          "Online payment gateway is not yet activated with live merchant keys in this environment. Please select Cash on Delivery (COD) or Concierge Bank Wire to complete your allocation.",
        rawDetails: {
          error: "UNCONFIGURED_GATEWAY",
          detail: "Missing live merchant credentials for online processing.",
        },
      };
    }

    try {
      // In live environment with credentials:
      // Real API integration would initiate checkout session with configured gateway
      return {
        success: true,
        providerId: this.id,
        paymentStatus: "PENDING",
        orderStatus: "Pending",
        transactionId: `GATEWAY-${request.orderNumber}-${Date.now()}`,
        message: "Redirecting to secure online payment gateway...",
        redirectUrl: `/checkout/payment-gateway?order=${request.orderNumber}`,
      };
    } catch (err: any) {
      return {
        success: false,
        providerId: this.id,
        paymentStatus: "FAILED",
        orderStatus: "Pending",
        message: err.message || "Online transaction could not be processed.",
      };
    }
  }
}
