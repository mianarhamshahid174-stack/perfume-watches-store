import { PaymentProvider, PaymentInitiateRequest, PaymentInitiateResult } from "../types";
import { formatPKR } from "@/lib/currency";

export class BankTransferPaymentProvider implements PaymentProvider {
  id = "bank_transfer" as const;
  name = "Concierge Bank Wire";
  title = "Direct VIP Bank Wire (Meezan / SCB)";
  description = "Direct bank transfer to VELORA Atelier corporate vault account. Order is confirmed once wire receipt is submitted to your private concierge.";
  isOnline = false;

  isAvailable(): boolean {
    return true;
  }

  async initiatePayment(request: PaymentInitiateRequest): Promise<PaymentInitiateResult> {
    const formattedAmount = formatPKR(request.amountPKR);
    return {
      success: true,
      providerId: this.id,
      paymentStatus: "PENDING",
      orderStatus: "Confirmed",
      transactionId: `WIRE-${request.orderNumber}`,
      message: "Order placed. Awaiting concierge wire confirmation.",
      instructions: `Please wire ${formattedAmount} to:\n• Bank: Meezan Bank Limited (Corporate Vault Branch)\n• Account Title: VELORA ATELIERS PRIVATE LTD\n• IBAN: PK55MEZN0099887766554433\n• Reference: ${request.orderNumber}`,
      rawDetails: {
        paymentMethod: "BANK_TRANSFER",
        currency: "PKR",
        amountPKR: request.amountPKR,
        bank: "Meezan Bank Limited",
        iban: "PK55MEZN0099887766554433",
      },
    };
  }
}
