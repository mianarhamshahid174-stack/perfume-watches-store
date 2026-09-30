import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("A valid email address is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = newsletterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid collector email address" },
        { status: 400 }
      );
    }

    // In a production setup, this would register with CRM / SendGrid / Klaviyo or database
    console.log(`[Patron Circle Subscription]: ${validated.data.email}`);

    return NextResponse.json({
      success: true,
      message: "Your private patron request has been registered.",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: "Failed to process subscription request." },
      { status: 500 }
    );
  }
}
