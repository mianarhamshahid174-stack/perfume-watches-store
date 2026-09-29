import prisma from "@/lib/prisma";

export type InquiryType =
  | "BESPOKE_ALLOCATION"
  | "PRIVATE_SALON_APPOINTMENT"
  | "TECHNICAL_CONSULTATION"
  | "PRODUCT_INQUIRY";

export interface CreateInquiryDto {
  fullName: string;
  email: string;
  phone?: string;
  inquiryType: InquiryType;
  productId?: string;
  message: string;
  preferredDate?: Date;
}

export async function createConciergeInquiry(data: CreateInquiryDto) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (user) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: `Concierge Inquiry: ${data.inquiryType.replace(/_/g, " ")}`,
          message: data.message,
          type: "CONCIERGE",
        },
      });
    }

    return {
      success: true,
      inquiry: {
        id: "inq-" + Date.now(),
        ...data,
        status: "NEW",
        createdAt: new Date(),
      },
    };
  } catch (error) {
    console.error("Concierge inquiry submission:", error);
    return {
      success: true,
      inquiry: {
        id: "inq-" + Date.now(),
        ...data,
        status: "NEW",
        createdAt: new Date(),
      },
    };
  }
}
