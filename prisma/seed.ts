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

  await prisma.adminUser.create({
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

  await prisma.user.create({
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
      imageUrl: "/images/velora-hero-editorial.jpg",
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

  await prisma.category.create({
    data: {
      name: "Atelier Accessories",
      slug: "atelier-accessories",
      description: "Bespoke straps, solid wood display vaults, and precision horological winders.",
    },
  });

  // 5. Create Core Collections Required by Prompt: SIGNATURE, NOIR, CLASSIC
  const colSignature = await prisma.collection.create({
    data: {
      name: "SIGNATURE",
      slug: "signature",
      description: "The definitive archetype of modern horological restraint and mechanical purity.",
      bannerUrl: "/images/velora-hero-editorial.jpg",
      featured: true,
    },
  });

  const colNoir = await prisma.collection.create({
    data: {
      name: "NOIR",
      slug: "noir",
      description: "Monochromatic mastery forged in DLC-coated titanium and shadowed ruthenium.",
      bannerUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85",
      featured: true,
    },
  });

  const colClassic = await prisma.collection.create({
    data: {
      name: "CLASSIC",
      slug: "classic",
      description: "Enduring proportions, Grand Feu enamel, and heritage complications refined for eternity.",
      bannerUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85",
      featured: true,
    },
  });

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

  // Product 0: VELORA SIGNATURE 01 (Flagship Centered Watch)
  const watchSignature01 = await prisma.product.create({
    data: {
      name: "VELORA SIGNATURE 01",
      slug: "velora-signature-01",
      sku: "VEL-SIG-01",
      shortDescription: "Automatic movement, sapphire crystal, and 316L stainless steel case.",
      description:
        "The VELORA SIGNATURE 01 represents the archetype of contemporary horological restraint. Driven by our in-house automatic calibre VA-100 with 68 hours of power reserve. Features a double-domed scratch-resistant sapphire crystal with five layers of anti-reflective coating, surgically machined 316L stainless steel case, an opaline dial with diamond-polished dauphine hands, and an open balance aperture.",
      price: new Prisma.Decimal("12500.00"),
      compareAtPrice: new Prisma.Decimal("14000.00"),
      cost: new Prisma.Decimal("4200.00"),
      categoryId: catHorlogerie.id,
      tags: ["Automatic", "Sapphire", "Stainless Steel", "Signature", "Iconic"],
      status: ProductStatus.PUBLISHED,
      featured: true,
      seoTitle: "VELORA SIGNATURE 01 | Automatic Luxury Timepiece in Stainless Steel",
      seoDescription: "Discover the VELORA SIGNATURE 01. Automatic movement, double-domed sapphire crystal, and 316L stainless steel.",
      movement: "Automatic Calibre VA-100 (In-House)",
      powerReserve: "68 Hours",
      caseMaterial: "316L Stainless Steel",
      caseDiameter: "39.5 mm",
      waterResistance: "50m / 5 ATM",
      dialColor: "Opaline Ivory with Gold Facets",
      strapMaterial: "Full-Grain Horween Noir Alligator",
      collections: {
        create: [
          { collectionId: colSignature.id, displayOrder: 1 },
          { collectionId: colClassic.id, displayOrder: 1 },
        ],
      },
      images: {
        create: [
          {
            url: "/images/velora-signature-01.jpg",
            altText: "VELORA SIGNATURE 01 Centered Dial View",
            sortOrder: 1,
            isPrimary: true,
          },
          {
            url: "/images/velora-hero-editorial.jpg",
            altText: "VELORA SIGNATURE 01 On-Wrist Editorial",
            sortOrder: 2,
            isPrimary: false,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "VEL-SIG-01-BLK",
            title: "Horween Noir Alligator Strap",
            price: new Prisma.Decimal("12500.00"),
            stock: 8,
            attributes: { strap: "Horween Noir", buckle: "Stainless Steel Deployant" },
          },
          {
            sku: "VEL-SIG-01-BRN",
            title: "Espresso Suede Calfskin Strap",
            price: new Prisma.Decimal("12500.00"),
            stock: 5,
            attributes: { strap: "Espresso Suede", buckle: "Stainless Steel Deployant" },
          },
        ],
      },
      inventory: {
        create: {
          quantity: 13,
          reserved: 0,
          warehouseLocation: "Geneva Vault Alpha-1",
        },
      },
    },
  });

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
        create: [
          { collectionId: colCelestial.id, displayOrder: 1 },
          { collectionId: colSignature.id, displayOrder: 2 },
        ],
      },
      images: {
        create: [
          {
            url: "/images/velora-hero-editorial.jpg",
            altText: "VELORA Chrono-Astral I Dial View",
            sortOrder: 1,
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
            altText: "VELORA Chrono-Astral I Studio Shot",
            sortOrder: 2,
            isPrimary: false,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "VEL-CHRONO-01-BLK",
            title: "Horween Noir Leather Strap",
            price: new Prisma.Decimal("29500.00"),
            stock: 4,
            attributes: { strap: "Horween Noir", clasp: "Titanium Deployant" },
          },
        ],
      },
      inventory: {
        create: {
          quantity: 7,
          reserved: 1,
          warehouseLocation: "Geneva Vault Alpha-1",
        },
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
        create: [
          { collectionId: colClassic.id, displayOrder: 2 },
          { collectionId: colCelestial.id, displayOrder: 2 },
        ],
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

  // Product 3: VELORA Noir Chronomètre
  await prisma.product.create({
    data: {
      name: "VELORA Noir Chronomètre",
      slug: "velora-noir-chronometre",
      sku: "VEL-NOIR-03",
      shortDescription: "Matte black DLC-coated titanium chronometer with shadowed ruthenium numerals.",
      description:
        "The embodiment of modern stealth. Forged in micro-peened titanium with a diamond-like carbon (DLC) treatment. Certified Swiss Chronometer caliber VA-330 with silicon escapement wheel.",
      price: new Prisma.Decimal("18200.00"),
      cost: new Prisma.Decimal("6200.00"),
      categoryId: catHorlogerie.id,
      tags: ["Noir", "DLC Titanium", "Chronometer", "Matte Black"],
      status: ProductStatus.PUBLISHED,
      featured: true,
      seoTitle: "VELORA Noir Chronomètre | DLC Titanium Swiss Chronometer",
      seoDescription: "Matte black DLC-coated titanium chronometer with shadowed ruthenium numerals.",
      movement: "Automatic Chronometer Calibre VA-330",
      powerReserve: "70 Hours",
      caseMaterial: "DLC-Coated Grade 5 Titanium",
      caseDiameter: "40.5 mm",
      waterResistance: "100m / 10 ATM",
      dialColor: "Shadow Ruthenium & Matte Onyx",
      strapMaterial: "Textured FKM Noir Rubber with Alligator Inlay",
      collections: {
        create: [{ collectionId: colNoir.id, displayOrder: 1 }],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85",
            altText: "VELORA Noir Chronomètre",
            sortOrder: 1,
            isPrimary: true,
          },
        ],
      },
      inventory: {
        create: {
          quantity: 5,
          warehouseLocation: "Geneva Vault Alpha-3",
        },
      },
    },
  });

  // Product 4: VELORA Nocturne Absolu Extrait
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

  // Product 5: VELORA Santal Royal Extrait
  await prisma.product.create({
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
            productName: "VELORA Chrono-Astral I",
            productSku: "VEL-CHRONO-01",
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
  await prisma.coupon.create({
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
      productId: watchSignature01.id,
      rating: 5,
      title: "Horological Architecture at Its Absolute Zenith",
      comment:
        "The hand-beveled anglage, balanced open heart exhibition, and tactile crown fluting on the Signature 01 exceed every standard. A modern heirloom of quiet majesty.",
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
          { productId: watchSignature01.id },
          { productId: watch2.id },
          { productId: parfum1.id },
        ],
      },
    },
  });

  // 11. Create 3 Rich Journal Posts
  await prisma.journalPost.createMany({
    data: [
      {
        title: "The Architecture of the Flyback Calibre VA-920",
        slug: "architecture-of-the-flyback-calibre-va-920",
        excerpt:
          "An intimate exploration into how our Geneva micro-engineers sculpted three-dimensional titanium bridges to maximize chronometric stability.",
        content:
          "Mechanical horology is the art of mastering entropy through geometry. In developing the VA-920, the goal was not simply high-frequency chronograph tracking, but the visual manifestation of mechanical depth...",
        coverImageUrl: "https://images.unsplash.com/photo-1547996160-71dfabb19283?auto=format&fit=crop&w=1200&q=85",
        category: "Horology Insights",
        authorId: editorUser.id,
        isPublished: true,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      },
      {
        title: "The Alchemy of Grasse: Macerating Rare Extraits",
        slug: "alchemy-of-grasse-macerating-rare-extraits",
        excerpt:
          "How 180 days of slow maceration in seasoned French oak barrels transforms raw agarwood and orris butter into liquid velvet.",
        content:
          "True extraction cannot be hurried. In our private laboratory nestled in the foothills of Grasse, our master noses allow natural distillates to rest undisturbed through seasonal changes...",
        coverImageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
        category: "Haute Parfumerie",
        authorId: editorUser.id,
        isPublished: true,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
      {
        title: "The Geometry of Restraint: Defining Contemporary Horology",
        slug: "geometry-of-restraint-the-velora-aesthetic",
        excerpt:
          "Why subtracting superfluous ornament reveals the purest harmony between hand-brushed titanium and opaline dials.",
        content:
          "To design a luxury watch today is to resist noise. At Maison Velora, we begin not with what can be added, but what can be stripped away until only unassailable proportion remains...",
        coverImageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85",
        category: "Maison Philosophy",
        authorId: editorUser.id,
        isPublished: true,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      },
    ],
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

  // 13. Create All 12 CMS-Controlled Homepage Sections (Matching User Specifications)
  await prisma.homepageSection.createMany({
    data: [
      {
        name: "Section 1: Hero Showcase",
        sectionKey: "hero_main",
        title: "TIME, REFINED.",
        subtitle: "Contemporary timepieces created for moments that matter.",
        sortOrder: 1,
        isActive: true,
        content: {
          badge: "Maison Velora Ateliers Geneva",
          ctaText: "DISCOVER THE COLLECTION",
          ctaLink: "/collections/signature",
          secondaryCtaText: "EXPLORE WATCHES",
          secondaryCtaLink: "/watches",
          bgImageUrl: "/images/velora-hero-editorial.jpg",
        },
      },
      {
        name: "Section 2: Featured Watch",
        sectionKey: "featured_watch",
        title: "THE SIGNATURE",
        subtitle:
          "An uncompromising study in mechanical balance. Forged in surgical 316L stainless steel with hand-beveled sapphire crystal, driven by our in-house automatic caliber VA-100.",
        sortOrder: 2,
        isActive: true,
        content: {
          productSlug: "velora-signature-01",
          ctaText: "DISCOVER THE WATCH",
          ctaLink: "/products/velora-signature-01",
          tagline: "Flagship Edition No. 01",
        },
      },
      {
        name: "Section 3: Collection Story",
        sectionKey: "collection_story",
        title: "DESIGNED BEYOND THE MOMENT.",
        subtitle:
          "Where timeless horological discipline transcends fleeting trends. Every gear, bridge, and balance wheel is hand-beveled and finished in our Geneva workshop to endure for generations.",
        sortOrder: 3,
        isActive: true,
        content: {
          bgImageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2000&q=85",
          ctaText: "EXPLORE OUR ATELIER",
          ctaLink: "/about",
        },
      },
      {
        name: "Section 4: Collections",
        sectionKey: "collections_grid",
        title: "THE COLLECTIONS",
        subtitle: "Three singular expressions of form, complication, and material sovereignty.",
        sortOrder: 4,
        isActive: true,
        content: {
          collectionSlugs: ["signature", "noir", "classic"],
        },
      },
      {
        name: "Section 5: Watch + Fragrance Split",
        sectionKey: "watch_fragrance_split",
        title: "TIME & SCENT",
        subtitle: "Two distinct sensory realms sharing the same unyielding standard of perfection.",
        sortOrder: 5,
        isActive: true,
        content: {
          timeTitle: "TIME",
          timeSubtitle: "Proprietary mechanical calibers assembled by master horologists in Geneva.",
          timeLink: "/collections/signature",
          timeImageUrl: "/images/velora-hero-editorial.jpg",
          scentTitle: "SCENT",
          scentSubtitle: "35% pure parfum extraits matured in Grasse oak vats.",
          scentLink: "/collections/nocturne-prive",
          scentImageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1600&q=85",
        },
      },
      {
        name: "Section 6: Signature Product",
        sectionKey: "signature_product",
        title: "VELORA SIGNATURE 01",
        subtitle: "Contemporary timepieces created for moments that matter. The archetype of modern Swiss precision.",
        sortOrder: 6,
        isActive: true,
        content: {
          productSlug: "velora-signature-01",
          features: [
            "Automatic movement",
            "Sapphire crystal",
            "Stainless steel",
          ],
          ctaText: "DISCOVER",
          ctaLink: "/products/velora-signature-01",
          imageUrl: "/images/velora-signature-01.jpg",
        },
      },
      {
        name: "Section 7: Craftsmanship",
        sectionKey: "craftsmanship_gallery",
        title: "MICROMECHANICAL EXCELLENCE",
        subtitle: "Every facet inspected at forty-times magnification before leaving our benches.",
        sortOrder: 7,
        isActive: true,
        content: {
          details: [
            {
              key: "dial",
              title: "The Dial",
              category: "DIAL FINISHING",
              description: "Opaline surface treated with hand-applied faceted markers and micro-grooved track.",
              imageUrl: "/images/velora-signature-01.jpg",
            },
            {
              key: "hands",
              title: "The Hands",
              category: "HANDS CRAFT",
              description: "Diamond-cut dauphine hands, mirror-beveled at 45° to catch fleeting ambient light.",
              imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85",
            },
            {
              key: "crown",
              title: "The Crown",
              category: "CROWN & SEAL",
              description: "Double-fluted knurled crown with laser-engraved Maison monogram and dual gasket sealing.",
              imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=85",
            },
            {
              key: "case",
              title: "The Case",
              category: "CASE ARCHITECTURE",
              description: "Surgically forged 316L stainless steel with alternating brushed flanks and mirror-polished bezel.",
              imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
            },
            {
              key: "strap",
              title: "The Strap",
              category: "STRAP LEATHER",
              description: "Hand-stitched Horween Noir alligator leather with hypoallergenic vegetal calfskin lining.",
              imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=800&q=85",
            },
            {
              key: "clasp",
              title: "The Clasp",
              category: "DEPLOYANT CLASP",
              description: "Solid stainless steel butterfly deployant mechanism with dual micro-sprung safety release triggers.",
              imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85",
            },
          ],
        },
      },
      {
        name: "Section 8: Fragrance Editorial",
        sectionKey: "fragrance_editorial",
        title: "A SCENT THAT BECOMES YOUR SIGNATURE.",
        subtitle:
          "Compounded in small batches in Grasse, France. Formulated with wild orris butter, aged Cambodian agarwood, and rare ambers.",
        sortOrder: 8,
        isActive: true,
        content: {
          ctaText: "EXPLORE HIGH PERFUMERY",
          ctaLink: "/fragrances",
          bgImageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=2000&q=85",
        },
      },
      {
        name: "Section 9: Gifting & Bespoke Packaging",
        sectionKey: "gifting_packaging",
        title: "MADE TO BE REMEMBERED.",
        subtitle:
          "Each acquisition arrives in our bespoke American walnut presentation vault with obsidian leather trim, wax-sealed certificate, and personalized hand-lettering.",
        sortOrder: 9,
        isActive: true,
        content: {
          ctaText: "EXPLORE BESPOKE GIFTING",
          ctaLink: "/concierge",
          imageUrl: "/images/velora-gifting-packaging.jpg",
        },
      },
      {
        name: "Section 10: Brand Story",
        sectionKey: "brand_story",
        title: "BORN FROM PATIENCE, DRIVEN BY DISCIPLINE.",
        subtitle:
          "We do not believe in mass creation. From the hand-finishing of bridges in Geneva to the patient aging of extraits in Grasse, our work honors time itself.",
        sortOrder: 10,
        isActive: true,
        content: {
          quote: "In an accelerated world, true luxury is the quiet confidence of objects crafted without compromise.",
          author: "The Velora Atelier Masters",
          ctaText: "DISCOVER THE MAISON",
          ctaLink: "/about",
          location: "Geneva & Grasse",
        },
      },
      {
        name: "Section 11: Journal Gazette",
        sectionKey: "journal_preview",
        title: "THE JOURNAL",
        subtitle: "Chronicles of horological innovation, artisanal techniques, and material discoveries.",
        sortOrder: 11,
        isActive: true,
        content: {
          ctaText: "VIEW ALL ARTICLES",
          ctaLink: "/journal",
          limit: 3,
        },
      },
      {
        name: "Section 12: Newsletter",
        sectionKey: "newsletter_section",
        title: "ENTER THE WORLD OF VELORA.",
        subtitle: "Subscribe to receive confidential allocations, private salon invitations, and quarterly horological journals.",
        sortOrder: 12,
        isActive: true,
        content: {
          ctaText: "REQUEST INVITATION",
          placeholder: "Enter your email address...",
        },
      },
    ],
  });

  // 14. Create Media Vault Assets
  await prisma.media.createMany({
    data: [
      {
        filename: "velora-hero-editorial.jpg",
        url: "/images/velora-hero-editorial.jpg",
        mimeType: "image/jpeg",
        sizeInBytes: 658509,
        altText: "VELORA Contemporary Timepieces Hero Shot",
        folder: "homepage",
      },
      {
        filename: "velora-signature-01.jpg",
        url: "/images/velora-signature-01.jpg",
        mimeType: "image/jpeg",
        sizeInBytes: 663423,
        altText: "VELORA SIGNATURE 01 Centered View",
        folder: "products",
      },
      {
        filename: "velora-gifting-packaging.jpg",
        url: "/images/velora-gifting-packaging.jpg",
        mimeType: "image/jpeg",
        sizeInBytes: 807297,
        altText: "VELORA Bespoke Walnut and Obsidian Presentation Box",
        folder: "gifting",
      },
    ],
  });

  // 15. Create Notification for VIP Customer
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
