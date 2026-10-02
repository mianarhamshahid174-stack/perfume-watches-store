import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updatePostSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  subtitle: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(5).optional(),
  coverImageUrl: z.string().optional().nullable(),
  authorName: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  relatedProductIds: z.array(z.string()).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);
    const { id } = await params;

    const post = await prisma.journalPost.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);
    const { id } = await params;
    const body = await req.json();
    const validated = updatePostSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      subtitle,
      excerpt,
      content,
      coverImageUrl,
      authorName,
      category,
      isPublished,
      publishedAt,
      seoTitle,
      seoDescription,
      ogImage,
      canonicalUrl,
      relatedProductIds,
    } = validated.data;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;
    if (authorName !== undefined) updateData.authorName = authorName;
    if (category !== undefined) updateData.category = category;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (ogImage !== undefined) updateData.ogImage = ogImage;
    if (canonicalUrl !== undefined) updateData.canonicalUrl = canonicalUrl;
    if (relatedProductIds !== undefined) updateData.relatedProductIds = relatedProductIds;

    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    }

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished && !publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await prisma.journalPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, post });
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
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);
    const { id } = await params;

    await prisma.journalPost.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Article deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
