import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_BRAND_NAME: z.string().default("VELORA Pakistan"),
  NEXT_PUBLIC_CURRENCY: z.string().default("PKR"),
  NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS: z
    .string()
    .optional()
    .transform((val) => val !== "false"),
});

// Parse with fallback for edge environments or build-time sanity
const parsed = serverSchema.safeParse({
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/zaven_db?schema=public",
  AUTH_SECRET:
    process.env.AUTH_SECRET ??
    "zaven_dev_auth_secret_key_luxury_platform_super_secure_9921",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME ?? "VELORA Pakistan",
  NEXT_PUBLIC_CURRENCY: process.env.NEXT_PUBLIC_CURRENCY ?? "PKR",
  NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS:
    process.env.NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS ?? "true",
});

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration.");
}

export const env = parsed.data;
