import {
  PaymentMethodId,
  PaymentProvider,
  PaymentInitiateRequest,
  PaymentInitiateResult,
} from "./types";
import { CODPaymentProvider } from "./providers/cod.provider";
import { BankTransferPaymentProvider } from "./providers/bank-transfer.provider";
import { ConfigurableOnlinePaymentProvider } from "./providers/online.provider";

export * from "./types";

class PaymentRegistry {
  private providers: Map<PaymentMethodId, PaymentProvider> = new Map();

  constructor() {
    this.registerProvider(new CODPaymentProvider());
    this.registerProvider(new BankTransferPaymentProvider());
    this.registerProvider(new ConfigurableOnlinePaymentProvider());
  }

  registerProvider(provider: PaymentProvider) {
    this.providers.set(provider.id, provider);
  }

  getProvider(id: PaymentMethodId): PaymentProvider | undefined {
    if (id === "online") return this.providers.get("online_gateway");
    return this.providers.get(id);
  }

  getAllProviders(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }

  getAvailableMethods() {
    return Array.from(this.providers.values())
      .filter((p) => p.isAvailable())
      .map((p) => ({
        id: p.id,
        name: p.name,
        title: p.title,
        description: p.description,
        isOnline: p.isOnline,
        isConfigured:
          p instanceof ConfigurableOnlinePaymentProvider ? p.isConfigured() : true,
      }));
  }

  async processPayment(
    methodId: PaymentMethodId,
    request: PaymentInitiateRequest
  ): Promise<PaymentInitiateResult> {
    const provider = this.getProvider(methodId);
    if (!provider) {
      return {
        success: false,
        providerId: methodId,
        paymentStatus: "FAILED",
        orderStatus: "Pending",
        message: `Unsupported payment method: ${methodId}`,
      };
    }

    return provider.initiatePayment(request);
  }
}

export const PaymentService = new PaymentRegistry();
