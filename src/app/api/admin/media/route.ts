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
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  duration: z.number().int().optional().nullable(),
  metadata: z.any().optional().nullable(),
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
    const type = searchParams.get("type"); // "image", "video", "all"

    // Ensure default media exist (both images and videos)
    const count = await prisma.media.count();
    if (count < 8) {
      const defaultAssets = [
        {
          filename: "velora-chronograph-black-dial.jpg",
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
          mimeType: "image/jpeg",
          sizeInBytes: 1420000,
          altText: "Velora Chronographe Squelette Grand Complication in Grade 5 Titanium",
          folder: "products",
          width: 1920,
          height: 1080,
          metadata: { colorSpace: "sRGB", camera: "Phase One IQ4", lens: "Schneider 120mm Macro" },
        },
        {
          filename: "velora-tourbillon-rose-gold.jpg",
          url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85",
          mimeType: "image/jpeg",
          sizeInBytes: 1850000,
          altText: "Tourbillon Celestial 18K Rose Gold with aventurine dial",
          folder: "products",
          width: 1920,
          height: 1280,
          metadata: { colorSpace: "AdobeRGB", resolution: "300 DPI" },
        },
        {
          filename: "velora-tourbillon-escapement-reel.mp4",
          url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-luxury-watch-mechanism-42845-large.mp4",
          mimeType: "video/mp4",
          sizeInBytes: 8400000,
          altText: "Macro video of tourbillon cage rotating at 60 seconds",
          folder: "products",
          width: 1920,
          height: 1080,
          duration: 15,
          metadata: { codec: "h264", frameRate: 60, aspectRatio: "16:9", quality: "1080p High" },
        },
        {
          filename: "geneva-atelier-craftsmanship.mp4",
          url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-craftsman-assembling-a-watch-42846-large.mp4",
          mimeType: "video/mp4",
          sizeInBytes: 12500000,
          altText: "Master horologist hand-bevelling steel bridges under microscope",
          folder: "journal",
          width: 1920,
          height: 1080,
          duration: 24,
          metadata: { codec: "h264", frameRate: 30, aspectRatio: "16:9", quality: "4K Master" },
        },
        {
          filename: "velora-celeste-oud-parfum.jpg",
          url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
          mimeType: "image/jpeg",
          sizeInBytes: 1100000,
          altText: "Céleste Oud Pure Parfum Extrait Flacon in hand-cut crystal",
          folder: "products",
          width: 1400,
          height: 1400,
          metadata: { lighting: "Studio Diffused", background: "Black Obsidian" },
        },
        {
          filename: "geneva-atelier-benchwork.jpg",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85",
          mimeType: "image/jpeg",
          sizeInBytes: 2300000,
          altText: "Geneva horologist assembling tourbillon escapement bridge",
          folder: "journal",
          width: 2400,
          height: 1600,
        },
        {
          filename: "maison-velora-hero-editorial.jpg",
          url: "https://images.unsplash.com/photo-1547996160-71dfabb19286?auto=format&fit=crop&w=1600&q=85",
          mimeType: "image/jpeg",
          sizeInBytes: 2900000,
          altText: "Maison Velora Geneva Atelier Brand Signature Banner",
          folder: "banners",
          width: 2560,
          height: 1440,
        },
        {
          filename: "velora-crest-gold-seal.png",
          url: "https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=800&q=85",
          mimeType: "image/png",
          sizeInBytes: 680000,
          altText: "Velora Ateliers Geneva Official Hallmarking Stamp",
          folder: "branding",
          width: 800,
          height: 800,
        },
      ];

      for (const item of defaultAssets) {
        const existing = await prisma.media.findFirst({ where: { filename: item.filename } });
        if (!existing) {
          await prisma.media.create({ data: item });
        }
      }
    }

    const where: any = {};
    if (folder && folder !== "all") {
      where.folder = folder;
    }
    if (type === "image") {
      where.mimeType = { startsWith: "image/" };
    } else if (type === "video") {
      where.mimeType = { startsWith: "video/" };
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

    const {
      filename,
      url,
      mimeType,
      sizeInBytes,
      altText,
      folder,
      width,
      height,
      duration,
      metadata,
    } = validated.data;

    const media = await prisma.media.create({
      data: {
        filename,
        url,
        mimeType,
        sizeInBytes,
        altText: altText || null,
        folder,
        width: width || null,
        height: height || null,
        duration: duration || null,
        metadata: metadata || null,
      },
    });

    return NextResponse.json({ success: true, media }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
