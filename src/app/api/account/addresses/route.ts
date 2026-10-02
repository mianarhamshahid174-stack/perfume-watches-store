import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, street1, street2, city, state, postalCode, country = "Pakistan", phone, isDefault } = body;

    if (!street1 || !city || !state) {
      return NextResponse.json({ success: false, error: "Missing required address fields." }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.userId,
        type: "SHIPPING",
        firstName: firstName || "",
        lastName: lastName || "",
        street1,
        street2: street2 || null,
        city,
        state,
        postalCode: postalCode || "74000",
        country,
        phone: phone || null,
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json({ success: true, address });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create address." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Address ID required" }, { status: 400 });
    }

    await prisma.address.deleteMany({
      where: {
        id,
        userId: session.userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete address." },
      { status: 500 }
    );
  }
}
