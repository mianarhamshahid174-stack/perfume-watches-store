import { NextRequest, NextResponse } from "next/server";
import { testFirebaseConnection, syncCatalogToFirebase, getFirebaseProducts } from "@/lib/firebase-db";

export const dynamic = "force-dynamic";

/**
 * GET /api/firebase
 * Check Firebase Cloud Firestore connection status and project metadata
 */
export async function GET() {
  try {
    const status = await testFirebaseConnection();
    return NextResponse.json({
      success: true,
      firebase: status,
      brand: "VELORA Pakistan",
      collections: [
        "orders",
        "inquiries",
        "newsletter_subscribers",
        "reviews",
        "products",
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to inspect Firebase connection",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/firebase
 * Perform administrative operations such as syncing catalog to Firebase Firestore
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "sync_catalog";

    if (action === "sync_catalog") {
      const result = await syncCatalogToFirebase();
      return NextResponse.json({
        success: result.success,
        message: `Successfully synchronized ${result.count} products to Firebase Firestore.`,
        count: result.count,
      });
    }

    if (action === "get_products") {
      const prods = await getFirebaseProducts();
      return NextResponse.json({
        success: true,
        count: prods.length,
        products: prods,
      });
    }

    return NextResponse.json(
      { success: false, error: `Unknown action "${action}"` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed Firebase operation" },
      { status: 500 }
    );
  }
}
