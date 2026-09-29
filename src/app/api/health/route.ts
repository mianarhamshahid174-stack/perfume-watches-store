import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BRAND } from "@/lib/constants";

export async function GET() {
  let dbStatus = "healthy";
  let latencyMs = 0;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    latencyMs = Date.now() - start;
  } catch (error) {
    dbStatus = "disconnected (offline or booting)";
    console.warn("Database health probe noticed:", error);
  }

  return NextResponse.json({
    brand: BRAND.name,
    tagline: BRAND.tagline,
    system: "production-ready",
    timestamp: new Date().toISOString(),
    services: {
      api: "operational",
      database: dbStatus,
      databaseLatencyMs: latencyMs,
    },
  });
}
