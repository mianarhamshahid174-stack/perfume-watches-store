import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const postSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(5, "Content is required"),
  coverImageUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
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

    const posts = await prisma.journalPost.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { excerpt: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, posts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);

    const body = await req.json();
    const validated = postSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, slug, excerpt, content, coverImageUrl, category, isPublished } = validated.data;

    // Check slug uniqueness
    const existing = await prisma.journalPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `An article with slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    const post = await prisma.journalPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImageUrl: coverImageUrl || null,
        category: category || "Horology",
        authorId: admin.adminId,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
