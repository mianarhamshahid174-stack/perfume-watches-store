import {
  PrismaClient,
  AdminRole,
  UserRole,
  ProductStatus,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  ShipmentStatus,
  InventoryTransactionType,
  DiscountType,
  AddressType,
  Prisma,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌟 Seeding VELORA Haute Horlogerie & High Perfumery catalog...");

  // 1. Clean existing records in correct relation order
  await prisma.notification.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVideo.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productCollection.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.journalPost.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.homepageSection.deleteMany();
  await prisma.media.deleteMany();
  await prisma.siteSetting.deleteMany();

  // 2. Create Admin Users with all required roles
  const superAdminPassword = await bcrypt.hash("VeloraSuperAdmin2026!", 12);
  const adminPassword = await bcrypt.hash("VeloraAdmin2026!", 12);
  const editorPassword = await bcrypt.hash("VeloraEditor2026!", 12);
  const supportPassword = await bcrypt.hash("VeloraSupport2026!", 12);

  const superAdmin = await prisma.adminUser.create({
    data: {
      email: "superadmin@velora-ateliers.com",
      passwordHash: superAdminPassword,
      firstName: "Maison",
      lastName: "Director General",
      role: AdminRole.SUPER_ADMIN,
    },
  });

  const adminUser = await prisma.adminUser.create({
    data: {
      email: "admin@velora-ateliers.com",
      passwordHash: adminPassword,
      firstName: "Alexander",
      lastName: "Vane",
      role: AdminRole.ADMIN,
    },
  });

  const editorUser = await prisma.adminUser.create({
    data: {
      email: "editor@velora-ateliers.com",
      passwordHash: editorPassword,
      firstName: "Helena",
      lastName: "Rousseau",
      role: AdminRole.EDITOR,
    },
  });

  const supportUser = await prisma.adminUser.create({
    data: {
      email: "support@velora-ateliers.com",
      passwordHash: supportPassword,
      firstName: "Jean-Paul",
      lastName: "Mercier",
      role: AdminRole.CUSTOMER_SUPPORT,
    },
  });

  console.log("✅ Admin users created with roles: SUPER_ADMIN, ADMIN, EDITOR, CUSTOMER_SUPPORT");

  // 3. Create Customers & Profiles
  const collectorPassword = await bcrypt.hash("CollectorSecret2026!", 12);
  const clientPassword = await bcrypt.hash("ClientSecret2026!", 12);

  const vipCustomer = await prisma.user.create({
    data: {
      email: "collector@kensington-vaults.com",
      passwordHash: collectorPassword,
      role: UserRole.VIP_CUSTOMER,
      profile: {
        create: {
          firstName: "Arthur",
          lastName: "Pendleton",
          phone: "+44 20 7946 0910",
          preferredCurrency: "USD",
          notes: "Patron collector with preference for flying tourbillons and extraits.",
        },
      },
    },
  });

  const standardCustomer = await prisma.user.create({
    data: {
      email: "client@mayfair-advisors.co.uk",
      passwordHash: clientPassword,
      role: UserRole.CUSTOMER,
      profile: {
        create: {
          firstName: "Beatrice",
          lastName: "Montague",
          phone: "+44 20 7946 0888",
          preferredCurrency: "USD",
        },
      },
    },
  });

  // Addresses for VIP Customer
  const shippingAddress = await prisma.address.create({
    data: {
      userId: vipCustomer.id,
      type: AddressType.SHIPPING,
      firstName: "Arthur",
      lastName: "Pendleton",
      company: "Kensington Heritage Trust",
      street1: "42 Queen's Gate Gardens",
      city: "London",
      state: "Greater London",
      postalCode: "SW7 5NE",
      country: "United Kingdom",
      phone: "+44 20 7946 0910",
      isDefault: true,
    },
  });

  const billingAddress = await prisma.address.create({
    data: {
      userId: vipCustomer.id,
      type: AddressType.BILLING,
      firstName: "Arthur",
      lastName: "Pendleton",
      company: "Kensington Heritage Trust",
      street1: "42 Queen's Gate Gardens",
      city: "London",
      state: "Greater London",
      postalCode: "SW7 5NE",
      country: "United Kingdom",
      phone: "+44 20 7946 0910",
      isDefault: true,
    },
  });

  // 4. Create Categories
  const catHorlogerie = await prisma.category.create({
    data: {
      name: "Haute Horlogerie",
      slug: "haute-horlogerie",
      description: "Mechanical complications hand-crafted by master watchmakers in Geneva.",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
    },
  });

  const catParfumerie = await prisma.category.create({
    data: {
      name: "High Perfumery",
      slug: "high-perfumery",
      description: "Pure extraits de parfum distilled in Grasse using rare resins and aged absolutes.",
      imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: "Atelier Accessories",
      slug: "atelier-accessories",
      description: "Bespoke straps, solid wood display vaults, and precision horological winders.",
    },
  });

  // 5. Create Collections
  const colCelestial = await prisma.collection.create({
    data: {
      name: "The Celestial Complications",
      slug: "celestial-complications",
      description: "Timepieces inspired by astronomical geometry, planetary gearings, and meteorite dials.",
      bannerUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85",
      featured: true,
    },
  });

  const colNocturne = await prisma.collection.create({
    data: {
      name: "Nocturne Privé",
      slug: "nocturne-prive",
      description: "Intimate olfactory creations formulated exclusively for evening and contemplative wear.",
      bannerUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=85",
      featured: true,
    },
  });

  // 6. Create Products with Variants, Images, and Inventory
  // Product 1: VELORA Chrono-Astral I
  const watch1 = await prisma.product.create({
    data: {
      name: "VELORA Chrono-Astral I",
      slug: "velora-chrono-astral-i",
      sku: "VEL-CHRONO-01",
      shortDescription: "Hand-wound flyback chronograph in Grade 5 titanium with skeletonized sub-dials.",
      description:
        "The Chrono-Astral I merges avant-garde architecture with classical Swiss finishings. Driven by the in-house Calibre VA-920, the movement operates at 28,800 vph with a 72-hour power reserve. Case crafted from micro-blasted Grade 5 titanium.",
      price: new Prisma.Decimal("29500.00"),
      compareAtPrice: new Prisma.Decimal("32000.00"),
      cost: new Prisma.Decimal("11000.00"),
      categoryId: catHorlogerie.id,
      tags: ["Chronograph", "Titanium", "Limited Run", "Mechanical"],
      status: ProductStatus.PUBLISHED,
      featured: true,
      seoTitle: "VELORA Chrono-Astral I | Luxury Titanium Flyback Chronograph",
      seoDescription: "Discover the VELORA Chrono-Astral I. Hand-beveled flyback chronograph with 72h power reserve.",
      movement: "Calibre VA-920 Hand-wound Flyback",
      powerReserve: "72 Hours",
      caseMaterial: "Grade 5 Titanium",
      caseDiameter: "41.0 mm",
      waterResistance: "100m / 10 ATM",
      dialColor: "Anthracite & Brushed Ruthenium",
      strapMaterial: "Horween Noir Alligator",
      collections: {
        create: [{ collectionId: colCelestial.id, displayOrder: 1 }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
            altText: "VELORA Chrono-Astral I Dial View",
            sortOrder: 1,
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1547996160-71dfabb19283?auto=format&fit=crop&w=1200&q=85",
            altText: "VELORA Chrono-Astral I Movement Detail",
            sortOrder: 2,
            isPrimary: false,
          },
        ],
      },
    },
  });

  // Variants for Product 1
  const v1 = await prisma.productVariant.create({
    data: {
      productId: watch1.id,
      sku: "VEL-CHRONO-01-BLK",
      title: "Horween Noir Leather Strap",
      price: new Prisma.Decimal("29500.00"),
      stock: 4,
      attributes: { strap: "Horween Noir", clasp: "Titanium Deployant" },
    },
  });

  const v2 = await prisma.productVariant.create({
    data: {
      productId: watch1.id,
      sku: "VEL-CHRONO-01-BRN",
      title: "Saddle Tan Alligator Strap",
      price: new Prisma.Decimal("29800.00"),
      stock: 3,
      attributes: { strap: "Saddle Tan", clasp: "Titanium Deployant" },
    },
  });

  // Inventory for watch 1
  const inv1 = await prisma.inventory.create({
    data: {
      productId: watch1.id,
      quantity: 7,
      reserved: 1,
      warehouseLocation: "Geneva Vault Alpha-1",
      transactions: {
        create: [
          {
            type: InventoryTransactionType.PURCHASE_RECEIPT,
            quantity: 7,
            previousQuantity: 0,
            newQuantity: 7,
            reference: "ATELIER-PO-2026-01",
            adminUserId: adminUser.id,
            notes: "Initial atelier assembly completion.",
          },
        ],
      },
    },
  });

  // Product 2: VELORA Tourbillon Grand Feu
  const watch2 = await prisma.product.create({
    data: {
      name: "VELORA Tourbillon Grand Feu",
      slug: "velora-tourbillon-grand-feu",
      sku: "VEL-TRB-02",
      shortDescription: "Flying tourbillon with hand-enameled Grand Feu dial in 18K Rose Gold.",
      description:
        "The pinnacle of horological poetry. Carrying our ultra-thin Calibre VA-990 Flying Tourbillon revolving in a titanium cage. The dial undergoes eight firings at 800°C to achieve an unblemished celestial sheen.",
      price: new Prisma.Decimal("68000.00"),
      cost: new Prisma.Decimal("24000.00"),
      categoryId: catHorlogerie.id,
      tags: ["Tourbillon", "Grand Feu Enamel", "Rose Gold", "Collector Grade"],
      status: ProductStatus.PUBLISHED,
      featured: true,
      seoTitle: "VELORA Tourbillon Grand Feu | 18K Rose Gold Masterpiece",
      seoDescription: "Exquisite flying tourbillon in 18K rose gold with hand-enameled Grand Feu dial.",
      movement: "Calibre VA-990 Flying Tourbillon",
      powerReserve: "80 Hours",
      caseMaterial: "18K Rose Gold (4N)",
      caseDiameter: "40.0 mm",
      waterResistance: "50m / 5 ATM",
      dialColor: "Ivory Grand Feu Enamel",
      strapMaterial: "Dark Havana Alligator",
      collections: {
        create: [{ collectionId: colCelestial.id, displayOrder: 2 }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85",
            altText: "VELORA Tourbillon Grand Feu",
            sortOrder: 1,
            isPrimary: true,
          },
        ],
      },
      inventory: {
        create: {
          quantity: 2,
          warehouseLocation: "Geneva Vault Alpha-2",
        },
      },
    },
  });

  // Product 3: VELORA Nocturne Absolu Extrait
  const parfum1 = await prisma.product.create({
    data: {
      name: "VELORA Nocturne Absolu Extrait",
      slug: "velora-nocturne-absolu-extrait",
      sku: "VEL-EXT-NOC-100",
      shortDescription: "Ultra-concentrated 32% extrait with wild Cambodian oud, damask black rose, and ambergris.",
      description:
        "Formulated over 180 days of maturation in Grasse. Nocturne Absolu is an enigmatic blend of smoked rare woods, aged Cambodian agarwood, velvety black petals, and genuine ambergris.",
      price: new Prisma.Decimal("490.00"),
      cost: new Prisma.Decimal("95.00"),
      categoryId: catParfumerie.id,
      tags: ["Extrait de Parfum", "Cambodian Oud", "Ambergris", "Grasse"],
      status: ProductStatus.PUBLISHED,
      featured: true,
      concentration: "Extrait de Parfum (32%)",
      olfactiveFamily: "Smoky Amber & Resinous Woods",
      volumeMl: 100,
      collections: {
        create: [{ collectionId: colNocturne.id, displayOrder: 1 }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
            altText: "VELORA Nocturne Absolu Flacon",
            sortOrder: 1,
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "VEL-EXT-NOC-50",
            title: "50ml Flacon",
            price: new Prisma.Decimal("320.00"),
            stock: 25,
            attributes: { volume: "50ml" },
          },
          {
            sku: "VEL-EXT-NOC-100",
            title: "100ml Flacon",
            price: new Prisma.Decimal("490.00"),
            stock: 35,
            attributes: { volume: "100ml" },
          },
        ],
      },
      inventory: {
        create: {
          quantity: 60,
          warehouseLocation: "Grasse Atelier Reserve",
        },
      },
    },
  });

  // Product 4: VELORA Santal Royal Extrait
  const parfum2 = await prisma.product.create({
    data: {
      name: "VELORA Santal Royal Extrait",
      slug: "velora-santal-royal-extrait",
      sku: "VEL-EXT-SNT-100",
      shortDescription: "Noble Mysore sandalwood, creamy Florentine orris, and green cardamom.",
      description:
        "A velvety sanctuary of high-altitude woods and sacred resinous resins. Macerated to 28% concentration, creating a radiant trail that lingers for over 18 hours.",
      price: new Prisma.Decimal("440.00"),
      cost: new Prisma.Decimal("85.00"),
      categoryId: catParfumerie.id,
      tags: ["Sandalwood", "Orris", "Niche Perfume", "Extrait"],
      status: ProductStatus.PUBLISHED,
      featured: true,
      concentration: "Extrait de Parfum (28%)",
      olfactiveFamily: "Creamy Wood & Powdered Iris",
      volumeMl: 100,
      collections: {
        create: [{ collectionId: colNocturne.id, displayOrder: 2 }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85",
            altText: "VELORA Santal Royal Flacon",
            sortOrder: 1,
            isPrimary: true,
          },
        ],
      },
      inventory: {
        create: {
          quantity: 45,
          warehouseLocation: "Grasse Atelier Reserve",
        },
      },
    },
  });

  // 7. Create Sample Order with All Fields, Payment & Shipment
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "VEL-2026-0091",
      customerId: vipCustomer.id,
      status: OrderStatus.Confirmed,
      subtotal: new Prisma.Decimal("29500.00"),
      discount: new Prisma.Decimal("0.00"),
      shipping: new Prisma.Decimal("0.00"),
      tax: new Prisma.Decimal("2360.00"),
      total: new Prisma.Decimal("31860.00"),
      paymentMethod: "STRIPE_ESCROW",
      paymentStatus: PaymentStatus.PAID,
      fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
      shippingAddressId: shippingAddress.id,
      billingAddressId: billingAddress.id,
      trackingNumber: "BRINKS-SEC-998241",
      notes: "VIP Client delivery requires armored courier white-glove handover.",
      items: {
        create: [
          {
            productId: watch1.id,
            variantId: v1.id,
            productName: "VELORA Chrono-Astral I",
            productSku: v1.sku,
            unitPrice: new Prisma.Decimal("29500.00"),
            quantity: 1,
            total: new Prisma.Decimal("29500.00"),
            attributes: { strap: "Horween Noir" },
          },
        ],
      },
      payments: {
        create: [
          {
            provider: "STRIPE",
            transactionId: "ch_mock_3NqL7t2eZvKYlo2C",
            amount: new Prisma.Decimal("31860.00"),
            currency: "USD",
            status: PaymentStatus.PAID,
            paymentMethod: "Visa Infinite Luxury Card",
          },
        ],
      },
      shipments: {
        create: [
          {
            carrier: "Brink's Global Valuables",
            trackingNumber: "BRINKS-SEC-998241",
            trackingUrl: "https://track.brinks.com/BRINKS-SEC-998241",
            status: ShipmentStatus.PREPARING,
            notes: "Vault security dispatch verification pending.",
          },
        ],
      },
    },
  });

  // 8. Create Coupon
  const coupon = await prisma.coupon.create({
    data: {
      code: "VELORA10",
      description: "Inaugural collector private salon 10% privilege",
      discountType: DiscountType.PERCENTAGE,
      discountValue: new Prisma.Decimal("10.00"),
      minOrderAmount: new Prisma.Decimal("500.00"),
      usageLimit: 100,
      usageCount: 1,
      isActive: true,
    },
  });

  // 9. Create Review
  await prisma.review.create({
    data: {
      userId: vipCustomer.id,
      productId: watch1.id,
      rating: 5,
      title: "Horological Architecture at Its Zenith",
      comment:
        "The hand-beveled anglage and responsiveness of the flyback mechanism surpass my highest expectations. A truly distinctive modern heirloom.",
      isVerifiedPurchase: true,
      isPublished: true,
    },
  });

  // 10. Create Wishlist for VIP Customer
  await prisma.wishlist.create({
    data: {
      userId: vipCustomer.id,
      items: {
        create: [
          { productId: watch2.id },
          { productId: parfum1.id },
        ],
      },
    },
  });

  // 11. Create Journal Post
  await prisma.journalPost.create({
    data: {
      title: "The Architecture of the Flyback Calibre VA-920",
      slug: "architecture-of-the-flyback-calibre-va-920",
      excerpt:
        "An intimate look into how our Geneva micro-engineers carved three-dimensional titanium bridges to maximize chronometric stability.",
      content:
        "Mechanical horology is the art of mastering both entropy and geometry. In developing the VA-920, the goal was not simply high-frequency chronograph tracking, but the visual manifestation of mechanical depth...",
      coverImageUrl: "https://images.unsplash.com/photo-1547996160-71dfabb19283?auto=format&fit=crop&w=1200&q=85",
      category: "Horology Insights",
      authorId: editorUser.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // 12. Create Site Settings
  await prisma.siteSetting.createMany({
    data: [
      { key: "brand_name", value: "VELORA", description: "Official Maison Brand Name" },
      { key: "contact_concierge_email", value: "concierge@velora-ateliers.com" },
      { key: "currency_default", value: "USD" },
      { key: "armored_delivery_threshold", value: "10000" },
    ],
  });

  // 13. Create Notification for VIP Customer
  await prisma.notification.create({
    data: {
      userId: vipCustomer.id,
      title: "Order VEL-2026-0091 Confirmed",
      message: "Your timepiece allocation has entered atelier assembly.",
      type: "ORDER_UPDATE",
      isRead: false,
      link: `/account/orders/${order1.id}`,
    },
  });

  console.log("🎉 Seeding completed successfully with rich VELORA catalog!");
  console.log("Admin accounts ready:");
  console.log("  - Super Admin: superadmin@velora-ateliers.com / VeloraSuperAdmin2026!");
  console.log("  - Admin:       admin@velora-ateliers.com / VeloraAdmin2026!");
  console.log("  - Editor:      editor@velora-ateliers.com / VeloraEditor2026!");
  console.log("  - Support:     support@velora-ateliers.com / VeloraSupport2026!");
  console.log("Customer accounts ready:");
  console.log("  - VIP Collector: collector@kensington-vaults.com / CollectorSecret2026!");
  console.log("  - Client:        client@mayfair-advisors.co.uk / ClientSecret2026!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
