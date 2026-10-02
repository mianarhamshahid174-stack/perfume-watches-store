import prisma from "../src/lib/prisma";
import { DiscountType } from "@prisma/client";

async function seedCoupons() {
  console.log("=== SEEDING PROMOTIONAL COUPONS FOR COMMERCE FLOW ===");

  const coupons = [
    {
      code: "VELORA10",
      description: "10% Welcome Atelier Privilege on any Haute Horlogerie or Extrait creation",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10, // 10%
      minOrderAmount: 0,
      isActive: true,
    },
    {
      code: "ATELIERVIP",
      description: "15% Exclusive Patron Allocation Discount",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15, // 15%
      minOrderAmount: 500,
      isActive: true,
    },
    {
      code: "GENEVA500",
      description: "$500 (₨ 140,000) Direct Vault Credit",
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 500, // $500
      minOrderAmount: 2000,
      isActive: true,
    },
  ];

  for (const c of coupons) {
    const existing = await prisma.coupon.findUnique({ where: { code: c.code } });
    if (!existing) {
      await prisma.coupon.create({
        data: {
          code: c.code,
          description: c.description,
          discountType: c.discountType,
          discountValue: c.discountValue,
          minOrderAmount: c.minOrderAmount,
          isActive: c.isActive,
        },
      });
      console.log(`✓ Created coupon: ${c.code}`);
    } else {
      console.log(`✓ Coupon already exists: ${c.code}`);
    }
  }

  console.log("=== COUPONS SEED COMPLETE ===");
}

seedCoupons()
  .catch((err) => {
    console.error("Coupon seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
