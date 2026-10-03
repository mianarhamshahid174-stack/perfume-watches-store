import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveInquiryToFirebase } from "@/lib/firebase-db";

export const dynamic = "force-dynamic";

const inquirySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().optional(),
  topic: z.string().min(1, "Topic is required"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = inquirySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields properly.",
          details: validated.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, topic, message } = validated.data;

    // Save directly to Firebase Firestore
    const saved = await saveInquiryToFirebase({
      fullName,
      email,
      phone,
      topic,
      message,
      source: "website_contact_form",
    });

    return NextResponse.json({
      success: true,
      savedToFirebase: saved,
      message: "Your inquiry has been registered with our client concierge.",
    });
  } catch (error: any) {
    console.error("[Contact API] Error processing inquiry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again or contact via WhatsApp." },
      { status: 500 }
    );
  }
}
