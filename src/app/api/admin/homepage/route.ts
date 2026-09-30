import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const sectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sectionKey: z.string().min(1, "Section key is required"),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  content: z.any().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);

    // Ensure default homepage sections exist if empty
    const count = await prisma.homepageSection.count();
    if (count === 0) {
      await prisma.homepageSection.createMany({
        data: [
          {
            name: "Hero Cinematic Showcase",
            sectionKey: "hero_main",
            title: "Precision Born In Solitude",
            subtitle: "Hand-finished horological complications and private perfume extraits from Geneva.",
            sortOrder: 1,
            isActive: true,
            content: {
              ctaText: "Discover The Collection",
              ctaLink: "/collections/grand-complications",
              badge: "Maison Velora Ateliers Geneva",
              bgImageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=2000&q=85",
            },
          },
          {
            name: "Horological Heritage Pillar",
            sectionKey: "heritage_pillar",
            title: "Two Centuries of Micro-Mechanical Mastery",
            subtitle: "Every gear, bridge, and balance wheel is hand-beveled and finished in our Geneva workshop.",
            sortOrder: 2,
            isActive: true,
            content: {
              pillars: [
                { title: "In-House Calibers", description: "Engineered with 72-hour power reserves and free-sprung balance." },
                { title: "Grand Feu Enamel", description: "Fired at 800°C for eternal, luminous depth and color fidelity." },
                { title: "High-Purity Metallurgy", description: "Grade 5 Titanium and 18K Ethically Sourced Rose Gold." },
              ],
            },
          },
          {
            name: "Curated Timepieces Carousel",
            sectionKey: "featured_products",
            title: "Iconic Complications",
            subtitle: "Limited to fifty pieces worldwide per reference.",
            sortOrder: 3,
            isActive: true,
            content: {
              filterTag: "featured",
              viewAllLink: "/collections/watches",
            },
          },
          {
            name: "Haute Parfumerie Spotlight",
            sectionKey: "fragrance_spotlight",
            title: "The Olfactive Sanctuary",
            subtitle: "35% concentration pure parfum extraits aged in Grasse oak vats.",
            sortOrder: 4,
            isActive: true,
            content: {
              headline: "Nocturne d'Ambre & Céleste Oud",
              bgImageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1600&q=85",
              ctaLink: "/collections/parfumerie",
            },
          },
        ],
      });
    }

    const sections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, sections });
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
    const validated = sectionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const section = await prisma.homepageSection.create({
      data: validated.data,
    });

    return NextResponse.json({ success: true, section }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
