import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const reviewActionSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "HIDE", "FEATURE", "UNFEATURE"]).optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "HIDDEN"]).optional(),
  isFeatured: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);
    const { id } = await params;
    const body = await req.json();
    const validated = reviewActionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { action, status, isFeatured } = validated.data;

    let updateData: any = {};

    if (action === "APPROVE") {
      updateData = { status: "APPROVED", isPublished: true };
    } else if (action === "REJECT") {
      updateData = { status: "REJECTED", isPublished: false, isFeatured: false };
    } else if (action === "HIDE") {
      updateData = { status: "HIDDEN", isPublished: false, isFeatured: false };
    } else if (action === "FEATURE") {
      updateData = { isFeatured: true, status: "APPROVED", isPublished: true };
    } else if (action === "UNFEATURE") {
      updateData = { isFeatured: false };
    } else {
      if (status) {
        updateData.status = status;
        updateData.isPublished = status === "APPROVED";
      }
      if (isFeatured !== undefined) {
        updateData.isFeatured = isFeatured;
      }
    }

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, review });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);
    const { id } = await params;

    await prisma.review.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
