import { NextRequest, NextResponse } from "next/server";
import { getAutocompleteResults } from "@/services/search.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const results = await getAutocompleteResults(q);

    return NextResponse.json({
      success: true,
      query: q,
      ...results,
    });
  } catch (error) {
    console.error("API search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to query atelier repertoire",
        products: [],
        collections: [],
        popularSearches: [],
      },
      { status: 500 }
    );
  }
}
