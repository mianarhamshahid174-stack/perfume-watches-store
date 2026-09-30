import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const mediaSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  url: z.string().url("Valid URL required"),
  mimeType: z.string().default("image/jpeg"),
  sizeInBytes: z.number().int().default(1024000),
  altText: z.string().optional().nullable(),
  folder: z.string().default("products"),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.EDITOR,
      AdminRole.CUSTOMER_SUPPORT,
    ]);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const folder = searchParams.get("folder");

    // Ensure default media exist if table is empty
    const count = await prisma.media.count();
    if (count === 0) {
      await prisma.media.createMany({
        data: [
          {
            filename: "velora-chronograph-black-dial.jpg",
            url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
            mimeType: "image/jpeg",
            sizeInBytes: 1420000,
            altText: "Velora Chronographe Squelette Grand Complication in Grade 5 Titanium",
            folder: "products",
          },
          {
            filename: "velora-tourbillon-rose-gold.jpg",
            url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85",
            mimeType: "image/jpeg",
            sizeInBytes: 1850000,
            altText: "Tourbillon Celestial 18K Rose Gold with aventurine dial",
            folder: "products",
          },
          {
            filename: "velora-celeste-oud-parfum.jpg",
            url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
            mimeType: "image/jpeg",
            sizeInBytes: 1100000,
            altText: "Céleste Oud Pure Parfum Extrait Flacon in hand-cut crystal",
            folder: "products",
          },
          {
            filename: "geneva-atelier-benchwork.jpg",
            url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85",
            mimeType: "image/jpeg",
            sizeInBytes: 2300000,
            altText: "Geneva horologist assembling tourbillon escapement bridge",
            folder: "journal",
          },
          {
            filename: "maison-velora-hero-editorial.jpg",
            url: "https://images.unsplash.com/photo-1547996160-71dfabb19286?auto=format&fit=crop&w=1600&q=85",
            mimeType: "image/jpeg",
            sizeInBytes: 2900000,
            altText: "Maison Velora Geneva Atelier Brand Signature Banner",
            folder: "banners",
          },
          {
            filename: "velora-crest-gold-seal.png",
            url: "https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=800&q=85",
            mimeType: "image/png",
            sizeInBytes: 680000,
            altText: "Velora Ateliers Geneva Official Hallmarking Stamp",
            folder: "branding",
          },
        ],
      });
    }

    const where: any = {};
    if (folder && folder !== "all") {
      where.folder = folder;
    }
    if (search && search.trim() !== "") {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { altText: { contains: search, mode: "insensitive" } },
      ];
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, media });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);

    const body = await req.json();
    const validated = mediaSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const asset = await prisma.media.create({
      data: validated.data,
    });

    return NextResponse.json({ success: true, media: asset }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
