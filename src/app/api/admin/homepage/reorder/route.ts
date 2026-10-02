import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const reorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);

    const body = await req.json();
    const validated = reorderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Invalid orderedIds array." },
        { status: 400 }
      );
    }

    const { orderedIds } = validated.data;

    // Update each section's sortOrder in a single transaction
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.homepageSection.update({
          where: { id },
          data: { sortOrder: index + 1 },
        })
      )
    );

    const sections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "Sections reordered successfully.",
      sections,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
