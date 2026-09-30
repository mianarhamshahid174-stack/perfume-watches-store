import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { AdminRole, OrderStatus, PaymentStatus, DiscountType } from "@prisma/client";

async function runAdminVerification() {
  console.log("==================================================================");
  console.log("       VELORA ATELIERS - PRODUCTION ADMIN VERIFICATION SUITE       ");
  console.log("==================================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: any) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`, details ? details : "");
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // TEST 1: Admin Account & Role Verification
    // -------------------------------------------------------------
    console.log("\n[1/12] Verifying Admin Authentication & RBAC in Database...");
    const superAdmin = await prisma.adminUser.findUnique({
      where: { email: "superadmin@velora-ateliers.com" },
    });
    assert(!!superAdmin, "Super Admin account exists in database");
    assert(superAdmin?.role === AdminRole.SUPER_ADMIN, "Super Admin has SUPER_ADMIN role");

    const passwordMatch = superAdmin ? await bcrypt.compare("VeloraSuperAdmin2026!", superAdmin.passwordHash) : false;
    assert(passwordMatch, "Super Admin password hash validates correctly");

    // -------------------------------------------------------------
    // TEST 2: Dashboard Real Queries & KPIs
    // -------------------------------------------------------------
    console.log("\n[2/12] Verifying Real Dashboard Analytics Queries...");
    const totalOrdersCount = await prisma.order.count();
    const completedOrders = await prisma.order.findMany({
      where: { status: { notIn: [OrderStatus.Cancelled, OrderStatus.Refunded] } },
    });
    const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const lowStockCount = await prisma.inventory.count({ where: { quantity: { lte: 3 } } });

    assert(totalOrdersCount > 0, `Real database contains ${totalOrdersCount} orders`);
    assert(totalRevenue > 0, `Total real revenue calculated: $${totalRevenue.toLocaleString()}`);
    assert(typeof lowStockCount === "number", `Low stock inventory query succeeded (${lowStockCount} items flagged)`);

    // -------------------------------------------------------------
    // TEST 3: Products CRUD & Duplication Operations
    // -------------------------------------------------------------
    console.log("\n[3/12] Verifying Product Complete CRUD & Duplication...");
    const testSku = `TEST-PROD-${Date.now().toString().slice(-6)}`;
    const testSlug = `test-timepiece-${Date.now()}`;

    // Create
    const newProduct = await prisma.product.create({
      data: {
        name: "Test Atelier Tourbillon Chrono",
        slug: testSlug,
        sku: testSku,
        shortDescription: "A test chronograph for verification",
        description: "Full horological verification description with hand-finished bevels.",
        price: 45000,
        compareAtPrice: 52000,
        cost: 18000,
        status: "PUBLISHED",
        featured: true,
        tags: ["test", "tourbillon", "limited"],
        seoTitle: "Test Tourbillon | Velora",
        seoDescription: "Exemplary test timepiece",
        inventory: {
          create: {
            quantity: 5,
            reserved: 0,
            warehouseLocation: "Geneva Vault Test",
          },
        },
      },
      include: { inventory: true },
    });
    assert(!!newProduct.id, "Product successfully created with real database insert");
    assert(newProduct.inventory?.quantity === 5, "Product inventory vault entry successfully initialized with 5 units");

    // Read & Update
    const updatedProduct = await prisma.product.update({
      where: { id: newProduct.id },
      data: { price: 48000, status: "ARCHIVED" },
    });
    assert(Number(updatedProduct.price) === 48000, "Product price updated successfully to $48,000");
    assert(updatedProduct.status === "ARCHIVED", "Product status updated to ARCHIVED");

    // Duplicate logic test
    const dupSku = `${newProduct.sku}-DUP`;
    const dupSlug = `${newProduct.slug}-copy`;
    const duplicate = await prisma.product.create({
      data: {
        name: `${newProduct.name} (Copy)`,
        slug: dupSlug,
        sku: dupSku,
        shortDescription: newProduct.shortDescription,
        description: newProduct.description,
        price: newProduct.price,
        status: "DRAFT",
        inventory: { create: { quantity: 1, warehouseLocation: "Geneva Vault Copy" } },
      },
      include: { inventory: true },
    });
    assert(!!duplicate.id, "Product duplication cloned record successfully");

    // Clean up test products
    await prisma.product.delete({ where: { id: duplicate.id } });
    await prisma.product.delete({ where: { id: newProduct.id } });
    assert(true, "Test products safely deleted after verification");

    // -------------------------------------------------------------
    // TEST 4: Categories CRUD Operations
    // -------------------------------------------------------------
    console.log("\n[4/12] Verifying Categories CRUD Operations...");
    const catSlug = `test-cat-${Date.now()}`;
    const testCat = await prisma.category.create({
      data: {
        name: "Test Complications Line",
        slug: catSlug,
        description: "Test category description",
      },
    });
    assert(!!testCat.id, "Category created successfully");

    const updatedCat = await prisma.category.update({
      where: { id: testCat.id },
      data: { name: "Updated Complications Line" },
    });
    assert(updatedCat.name === "Updated Complications Line", "Category updated successfully");

    await prisma.category.delete({ where: { id: testCat.id } });
    assert(true, "Test category deleted cleanly");

    // -------------------------------------------------------------
    // TEST 5: Collections CRUD Operations
    // -------------------------------------------------------------
    console.log("\n[5/12] Verifying Collections CRUD Operations...");
    const colSlug = `test-col-${Date.now()}`;
    const testCol = await prisma.collection.create({
      data: {
        name: "Geneva Salon 2026 Selection",
        slug: colSlug,
        description: "Exclusive salon collection",
        isActive: true,
        featured: true,
      },
    });
    assert(!!testCol.id, "Collection created successfully");

    const updatedCol = await prisma.collection.update({
      where: { id: testCol.id },
      data: { isActive: false },
    });
    assert(updatedCol.isActive === false, "Collection active state toggled to false");

    await prisma.collection.delete({ where: { id: testCol.id } });
    assert(true, "Test collection deleted cleanly");

    // -------------------------------------------------------------
    // TEST 6: Inventory Control & Audit Ledger
    // -------------------------------------------------------------
    console.log("\n[6/12] Verifying Inventory & Audit Transactions Ledger...");
    const anyInv = await prisma.inventory.findFirst({
      include: { product: true },
    });
    assert(!!anyInv, "Found active inventory item in vault");

    if (anyInv && superAdmin) {
      const initQty = anyInv.quantity;
      const adjustDelta = 3;

      const adjustmentTx = await prisma.$transaction(async (tx) => {
        const updated = await tx.inventory.update({
          where: { id: anyInv.id },
          data: { quantity: initQty + adjustDelta },
        });

        const log = await tx.inventoryTransaction.create({
          data: {
            inventoryId: anyInv.id,
            type: "AUDIT_ADJUSTMENT",
            quantity: adjustDelta,
            previousQuantity: initQty,
            newQuantity: initQty + adjustDelta,
            reference: "TEST-SUITE-AUDIT-01",
            adminUserId: superAdmin.id,
            notes: "Automated test verification of physical cycle count",
          },
        });

        return { updated, log };
      });

      assert(adjustmentTx.updated.quantity === initQty + adjustDelta, "Stock successfully incremented by delta");
      assert(adjustmentTx.log.type === "AUDIT_ADJUSTMENT", "Audit transaction logged with AUDIT_ADJUSTMENT type");
      assert(adjustmentTx.log.adminUserId === superAdmin.id, "Audit record signed by Super Admin ID");

      // Revert adjustment
      await prisma.inventory.update({
        where: { id: anyInv.id },
        data: { quantity: initQty },
      });
      await prisma.inventoryTransaction.delete({ where: { id: adjustmentTx.log.id } });
      assert(true, "Inventory restored to original count and test transaction pruned");
    }

    // -------------------------------------------------------------
    // TEST 7: Orders Management & Status Updates
    // -------------------------------------------------------------
    console.log("\n[7/12] Verifying Orders Management, Tracking & Notes...");
    const sampleOrder = await prisma.order.findFirst({
      include: { items: true, shipments: true },
    });
    assert(!!sampleOrder, "Found active client order in database");

    if (sampleOrder) {
      const originalStatus = sampleOrder.status;
      const testTracking = "FERRARI-TEST-99882";
      const testNote = "VIP client requested white-glove evening arrival.";

      const updatedOrder = await prisma.order.update({
        where: { id: sampleOrder.id },
        data: {
          status: OrderStatus.Processing,
          trackingNumber: testTracking,
          notes: testNote,
        },
      });

      assert(updatedOrder.status === OrderStatus.Processing, "Order status updated to Processing");
      assert(updatedOrder.trackingNumber === testTracking, "Tracking number committed to order record");
      assert(updatedOrder.notes === testNote, "Admin concierge notes saved to order record");

      // Restore
      await prisma.order.update({
        where: { id: sampleOrder.id },
        data: { status: originalStatus },
      });
    }

    // -------------------------------------------------------------
    // TEST 8: Customers & VIP Tier Management
    // -------------------------------------------------------------
    console.log("\n[8/12] Verifying Customers & Patron Aggregations...");
    const customers = await prisma.user.findMany({
      include: {
        profile: true,
        orders: true,
      },
    });
    assert(customers.length > 0, `Patron registry contains ${customers.length} verified accounts`);

    const vipPatron = customers.find((c) => c.role === "VIP_CUSTOMER");
    assert(!!vipPatron, "VIP Patron role verified in user records");

    // -------------------------------------------------------------
    // TEST 9: Discounts / Coupons CRUD & Targeting
    // -------------------------------------------------------------
    console.log("\n[9/12] Verifying Discount Vouchers CRUD & Rules...");
    const testCode = `TESTPROMO${Date.now().toString().slice(-4)}`;
    const testCoupon = await prisma.coupon.create({
      data: {
        code: testCode,
        description: "Test Promotional Voucher",
        discountType: DiscountType.PERCENTAGE,
        discountValue: 15,
        minOrderAmount: 10000,
        targetType: "ALL",
        usageLimit: 25,
        isActive: true,
      },
    });
    assert(!!testCoupon.id, "Promotional voucher created with percentage & min order rules");

    const updatedCoupon = await prisma.coupon.update({
      where: { id: testCoupon.id },
      data: { discountValue: 20 },
    });
    assert(Number(updatedCoupon.discountValue) === 20, "Voucher concession adjusted to 20%");

    await prisma.coupon.delete({ where: { id: testCoupon.id } });
    assert(true, "Test voucher deleted cleanly");

    // -------------------------------------------------------------
    // TEST 10: Reviews Moderation (Approve, Reject, Hide, Feature)
    // -------------------------------------------------------------
    console.log("\n[10/12] Verifying Reviews Moderation Actions...");
    const anyReview = await prisma.review.findFirst();
    assert(!!anyReview, "Found client review in database");

    if (anyReview) {
      // Test feature toggle
      const featured = await prisma.review.update({
        where: { id: anyReview.id },
        data: { isFeatured: true, status: "APPROVED", isPublished: true },
      });
      assert(featured.isFeatured === true, "Review featured state activated");
      assert(featured.status === "APPROVED", "Review status set to APPROVED");

      // Test hide toggle
      const hidden = await prisma.review.update({
        where: { id: anyReview.id },
        data: { status: "HIDDEN", isPublished: false },
      });
      assert(hidden.status === "HIDDEN" && !hidden.isPublished, "Review hidden from public storefront");

      // Restore
      await prisma.review.update({
        where: { id: anyReview.id },
        data: { status: anyReview.status, isPublished: anyReview.isPublished, isFeatured: anyReview.isFeatured },
      });
    }

    // -------------------------------------------------------------
    // TEST 11: Content (Homepage Sections & Journal Chronicles)
    // -------------------------------------------------------------
    console.log("\n[11/12] Verifying Homepage & Journal Content Management...");
    const homepageSections = await prisma.homepageSection.findMany();
    assert(homepageSections.length > 0, `Homepage layout has ${homepageSections.length} configured sections`);

    const testPostSlug = `test-journal-article-${Date.now()}`;
    const testPost = await prisma.journalPost.create({
      data: {
        title: "Test Horological Chronicle",
        slug: testPostSlug,
        excerpt: "An exploration of test calibers.",
        content: "Detailed markdown content about Geneva horological finishing.",
        category: "Horology",
        isPublished: true,
        authorId: superAdmin?.id,
      },
    });
    assert(!!testPost.id, "Journal article published to database");

    await prisma.journalPost.delete({ where: { id: testPost.id } });
    assert(true, "Test article deleted cleanly");

    // -------------------------------------------------------------
    // TEST 12: Media Library & Global Site Settings
    // -------------------------------------------------------------
    console.log("\n[12/12] Verifying Media Library & Site Settings Persistence...");
    const mediaCount = await prisma.media.count();
    assert(mediaCount > 0, `Media vault contains ${mediaCount} active media assets`);

    // Site settings upsert
    const testSettingKey = `test_setting_${Date.now()}`;
    await prisma.siteSetting.upsert({
      where: { key: testSettingKey },
      update: { value: "TestValue123" },
      create: { key: testSettingKey, value: "TestValue123", description: "Verification setting" },
    });

    const readSetting = await prisma.siteSetting.findUnique({ where: { key: testSettingKey } });
    assert(readSetting?.value === "TestValue123", "Site setting persisted and read back from database");

    await prisma.siteSetting.delete({ where: { key: testSettingKey } });
    assert(true, "Test setting cleanly pruned");

  } catch (err) {
    console.error("Critical test exception:", err);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n==================================================================");
  console.log(`TOTAL TESTS RUN: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAdminVerification();
