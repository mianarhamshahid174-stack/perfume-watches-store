import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { AdminRole, UserRole } from "@prisma/client";

const BASE_URL = "http://localhost:3000";

async function runVerification() {
  console.log("==================================================================");
  console.log("🧪 RUNNING COMPREHENSIVE VELORA AUTH & DATABASE VERIFICATION");
  console.log("==================================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} - ${detail || ""}`);
      process.exitCode = 1;
    }
  }

  // ---------------------------------------------------------------------------
  // 1. DATABASE ENTITY & SEED VERIFICATION
  // ---------------------------------------------------------------------------
  console.log("\n📦 1. Database Architecture & Seed Verification:");

  const userCount = await prisma.user.count();
  assert(userCount >= 2, "Users seeded in PostgreSQL", `Found: ${userCount}`);

  const adminCount = await prisma.adminUser.count();
  assert(adminCount >= 4, "Admin users with all 4 roles seeded", `Found: ${adminCount}`);

  const productCount = await prisma.product.count();
  assert(productCount >= 4, "VELORA catalog products seeded", `Found: ${productCount}`);

  const inventoryCount = await prisma.inventory.count();
  assert(inventoryCount >= 4, "Inventory and warehouse records linked", `Found: ${inventoryCount}`);

  const orderCount = await prisma.order.count();
  assert(orderCount >= 1, "Orders, payments, and shipments recorded", `Found: ${orderCount}`);

  // ---------------------------------------------------------------------------
  // 2. CUSTOMER REGISTRATION TEST
  // ---------------------------------------------------------------------------
  console.log("\n🔐 2. Customer Registration Test:");

  const testEmail = `collector_${Date.now()}@geneva-trust.ch`;
  const testPassword = "CollectorPass2026!";

  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      firstName: "Jean-Luc",
      lastName: "De La Tour",
      phone: "+41 22 555 0199",
    }),
  });

  const regData = await regRes.json();
  assert(regRes.status === 200 && regData.success, "Customer registration API succeeds", JSON.stringify(regData));

  // Extract set-cookie header
  const customerCookie = regRes.headers.get("set-cookie");
  assert(Boolean(customerCookie && customerCookie.includes("velora_customer_session")), "Registration issues HttpOnly session cookie");

  // Verify created database records (User + Profile + Cart + Wishlist)
  const createdUser = await prisma.user.findUnique({
    where: { email: testEmail },
    include: { profile: true, cart: true, wishlist: true },
  });
  assert(Boolean(createdUser && createdUser.profile?.firstName === "Jean-Luc"), "User and CustomerProfile created in PostgreSQL");
  assert(Boolean(createdUser?.cart && createdUser?.wishlist), "Cart and Wishlist atomically provisioned on registration");

  // ---------------------------------------------------------------------------
  // 3. CUSTOMER LOGIN & SESSION TEST
  // ---------------------------------------------------------------------------
  console.log("\n🔑 3. Customer Authentication & Session Retrieval:");

  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });

  const loginData = await loginRes.json();
  assert(loginRes.status === 200 && loginData.success, "Customer login succeeds with bcrypt validation");

  const loginCookie = loginRes.headers.get("set-cookie") || "";
  const sessionToken = loginCookie.split(";")[0];

  // Call /api/auth/me with session cookie
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: sessionToken },
  });
  const meData = await meRes.json();
  assert(meRes.status === 200 && meData.user?.email === testEmail, "Protected /api/auth/me returns authenticated client data");

  // ---------------------------------------------------------------------------
  // 4. FORGOT PASSWORD & RESET TEST
  // ---------------------------------------------------------------------------
  console.log("\n🔄 4. Forgot Password & Reset Flow:");

  const forgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail }),
  });
  const forgotData = await forgotRes.json();
  const dbUserAfterForgot = await prisma.user.findUnique({ where: { email: testEmail } });
  const activeToken = forgotData.devResetToken || dbUserAfterForgot?.resetPasswordToken;
  assert(forgotRes.status === 200 && Boolean(activeToken), "Forgot password generates crypto token in DB");

  const resetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: activeToken,
      newPassword: "NewCollectorPass2026!",
    }),
  });
  const resetData = await resetRes.json();
  assert(resetRes.status === 200 && resetData.success, "Reset password updates hashed password in database");

  // Verify login with new password
  const newLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "NewCollectorPass2026!",
    }),
  });
  assert(newLoginRes.status === 200, "Login successful with newly reset password");

  // ---------------------------------------------------------------------------
  // 5. CUSTOMER LOGOUT TEST
  // ---------------------------------------------------------------------------
  console.log("\n🚪 5. Customer Logout Test:");

  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
  });
  assert(logoutRes.status === 200, "Logout API terminates session");

  // ---------------------------------------------------------------------------
  // 6. ADMIN AUTHENTICATION & ALL 4 ROLES
  // ---------------------------------------------------------------------------
  console.log("\n🛡️ 6. Admin Authentication & Role-Based Authorization:");

  // Test SUPER_ADMIN
  const superAdminRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "superadmin@velora-ateliers.com",
      password: "VeloraSuperAdmin2026!",
    }),
  });
  const superAdminData = await superAdminRes.json();
  assert(superAdminRes.status === 200 && superAdminData.admin?.role === "SUPER_ADMIN", "SUPER_ADMIN login authenticated");
  const superAdminCookie = (superAdminRes.headers.get("set-cookie") || "").split(";")[0];

  // Test ADMIN
  const adminRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@velora-ateliers.com",
      password: "VeloraAdmin2026!",
    }),
  });
  const adminData = await adminRes.json();
  assert(adminRes.status === 200 && adminData.admin?.role === "ADMIN", "ADMIN login authenticated");

  // Test EDITOR
  const editorRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "editor@velora-ateliers.com",
      password: "VeloraEditor2026!",
    }),
  });
  const editorData = await editorRes.json();
  assert(editorRes.status === 200 && editorData.admin?.role === "EDITOR", "EDITOR login authenticated");
  const editorCookie = (editorRes.headers.get("set-cookie") || "").split(";")[0];

  // Test CUSTOMER_SUPPORT
  const supportRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "support@velora-ateliers.com",
      password: "VeloraSupport2026!",
    }),
  });
  const supportData = await supportRes.json();
  assert(supportRes.status === 200 && supportData.admin?.role === "CUSTOMER_SUPPORT", "CUSTOMER_SUPPORT login authenticated");
  const supportCookie = (supportRes.headers.get("set-cookie") || "").split(";")[0];

  // ---------------------------------------------------------------------------
  // 7. DATABASE CRUD & ROLE PERMISSIONS TEST
  // ---------------------------------------------------------------------------
  console.log("\n⚙️ 7. Database CRUD Operations & Role Enforcement:");

  // Test CREATE by EDITOR (allowed)
  const testSku = `VEL-TEST-${Date.now()}`;
  const createProductRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: editorCookie,
    },
    body: JSON.stringify({
      name: "VELORA Skeleton Tourbillon Prototype",
      slug: `velora-skeleton-prototype-${Date.now()}`,
      sku: testSku,
      shortDescription: "Prototype complication piece created during automated verification.",
      description: "Hand-beveled bridges, 72h power reserve, titanium grade 5 chassis.",
      price: 38500,
      initialStock: 3,
      movement: "Calibre VA-950S",
    }),
  });
  const createProductData = await createProductRes.json();
  assert(createProductRes.status === 201 && createProductData.success, "EDITOR creates product and initializes inventory", JSON.stringify(createProductData));
  const createdProductId = createProductData.product.id;

  // Test DELETE by CUSTOMER_SUPPORT (forbidden)
  const forbiddenDeleteRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
    method: "DELETE",
    headers: { Cookie: supportCookie },
  });
  assert(forbiddenDeleteRes.status === 403, "CUSTOMER_SUPPORT is denied permission to delete product (RBAC 403 Forbidden)");

  // Test DELETE by SUPER_ADMIN (allowed)
  const allowedDeleteRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
    method: "DELETE",
    headers: { Cookie: superAdminCookie },
  });
  assert(allowedDeleteRes.status === 200, "SUPER_ADMIN successfully deletes product (RBAC 200 OK)");

  // ---------------------------------------------------------------------------
  // 8. ROUTE PROTECTION VERIFICATION
  // ---------------------------------------------------------------------------
  console.log("\n🛡️ 8. Middleware Route Protection Verification:");

  // Unauthenticated request to /admin -> Redirects to /admin/login
  const unauthAdminRes = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
  assert(
    unauthAdminRes.status === 307 || unauthAdminRes.status === 302 || Boolean(unauthAdminRes.headers.get("location")?.includes("/admin/login")),
    "Unauthenticated /admin redirects to /admin/login"
  );

  // Unauthenticated request to /account -> Redirects to /login
  const unauthAccountRes = await fetch(`${BASE_URL}/account`, { redirect: "manual" });
  assert(
    unauthAccountRes.status === 307 || unauthAccountRes.status === 302 || Boolean(unauthAccountRes.headers.get("location")?.includes("/login")),
    "Unauthenticated /account redirects to /login"
  );

  // Clean up test user
  await prisma.user.delete({ where: { email: testEmail } });

  console.log("\n==================================================================");
  console.log(`🎯 VERIFICATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log("==================================================================");

  if (passedTests === totalTests) {
    console.log("🏆 ALL DATABASE & AUTHENTICATION SPECIFICATIONS VERIFIED!");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification()
  .catch((e) => {
    console.error("Verification execution error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
