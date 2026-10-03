import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { FALLBACK_PRODUCTS } from "./catalog-data";

/**
 * Order record structure for Firebase Cloud Firestore
 */
export interface FirebaseOrder {
  id: string;
  orderNumber: string;
  status: "Confirmed" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  fulfillmentStatus?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    pricePKR: number;
    totalPKR: number;
    imageUrl?: string;
    variantTitle?: string | null;
  }>;
  pricing: {
    subtotalPKR: number;
    shippingPKR: number;
    discountPKR: number;
    totalPKR: number;
    formattedTotalPKR: string;
  };
  payment: {
    method: string;
    status: string;
    isCOD: boolean;
  };
  courier: {
    carrier: string;
    trackingNumber: string;
  };
  notes?: string;
  createdAt: string | any;
  updatedAt?: string | any;
  brand: string;
}

/**
 * Save or synchronize an order into Firebase Firestore
 */
export async function saveOrderToFirebase(orderData: FirebaseOrder): Promise<boolean> {
  try {
    const docId = orderData.orderNumber || orderData.id;
    const orderRef = doc(db, "orders", docId);

    await setDoc(
      orderRef,
      {
        ...orderData,
        updatedAt: serverTimestamp(),
        createdAt: orderData.createdAt || serverTimestamp(),
        brand: "VELORA Pakistan",
      },
      { merge: true }
    );

    console.log(`[Firebase Database] Order successfully saved: ${docId}`);
    return true;
  } catch (error) {
    console.error("[Firebase Database] Failed to save order to Firestore:", error);
    return false;
  }
}

/**
 * Query an order from Firebase Firestore by Document ID or Order Number
 */
export async function getOrderFromFirebase(
  idOrOrderNumber: string
): Promise<FirebaseOrder | null> {
  try {
    if (!idOrOrderNumber) return null;
    const cleanId = idOrOrderNumber.trim();

    // 1. Try direct document reference lookup
    const directDocRef = doc(db, "orders", cleanId);
    const directSnap = await getDoc(directDocRef);

    if (directSnap.exists()) {
      return directSnap.data() as FirebaseOrder;
    }

    // 2. Try query by orderNumber
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, where("orderNumber", "==", cleanId), limit(1));
    const querySnap = await getDocs(q);

    if (!querySnap.empty) {
      return querySnap.docs[0].data() as FirebaseOrder;
    }

    return null;
  } catch (error) {
    console.error("[Firebase Database] Failed to query order from Firestore:", error);
    return null;
  }
}

/**
 * Update order shipment status in Firebase
 */
export async function updateOrderStatusInFirebase(
  orderIdOrNumber: string,
  status: FirebaseOrder["status"],
  trackingNumber?: string
): Promise<boolean> {
  try {
    const orderRef = doc(db, "orders", orderIdOrNumber);
    const updatePayload: Record<string, any> = {
      status,
      updatedAt: serverTimestamp(),
    };
    if (trackingNumber) {
      updatePayload["courier.trackingNumber"] = trackingNumber;
    }
    await updateDoc(orderRef, updatePayload);
    return true;
  } catch (error) {
    console.error("[Firebase Database] Failed to update order status:", error);
    return false;
  }
}

/**
 * Customer Inquiry / Concierge appointment record
 */
export interface FirebaseInquiry {
  fullName: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  source?: string;
}

/**
 * Save client inquiries / appointments to Firebase Firestore
 */
export async function saveInquiryToFirebase(inquiry: FirebaseInquiry): Promise<boolean> {
  try {
    const inquiriesCol = collection(db, "inquiries");
    const newDocRef = doc(inquiriesCol);

    await setDoc(newDocRef, {
      ...inquiry,
      id: newDocRef.id,
      status: "NEW",
      createdAt: serverTimestamp(),
      brand: "VELORA Pakistan",
    });

    console.log(`[Firebase Database] Inquiry stored with ID: ${newDocRef.id}`);
    return true;
  } catch (error) {
    console.error("[Firebase Database] Failed to save inquiry to Firestore:", error);
    return false;
  }
}

/**
 * Save newsletter subscribers to Firebase Firestore
 */
export async function saveSubscriberToFirebase(
  email: string,
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    const cleanEmail = email.toLowerCase().trim();
    // Use encoded email as docId for deduplication
    const docId = cleanEmail.replace(/[@.]/g, "_");
    const subRef = doc(db, "newsletter_subscribers", docId);

    await setDoc(
      subRef,
      {
        email: cleanEmail,
        subscribedAt: serverTimestamp(),
        status: "ACTIVE",
        brand: "VELORA Pakistan",
        ...metadata,
      },
      { merge: true }
    );

    console.log(`[Firebase Database] Subscriber saved: ${cleanEmail}`);
    return true;
  } catch (error) {
    console.error("[Firebase Database] Failed to save subscriber to Firestore:", error);
    return false;
  }
}

/**
 * Save customer product review to Firebase Firestore
 */
export async function saveReviewToFirebase(review: {
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase?: boolean;
}): Promise<boolean> {
  try {
    const reviewsCol = collection(db, "reviews");
    const newDoc = doc(reviewsCol);

    await setDoc(newDoc, {
      ...review,
      id: newDoc.id,
      status: "APPROVED",
      createdAt: serverTimestamp(),
      brand: "VELORA Pakistan",
    });

    return true;
  } catch (error) {
    console.error("[Firebase Database] Failed to save review to Firestore:", error);
    return false;
  }
}

/**
 * Seed or Synchronize website catalog into Firebase Firestore
 */
export async function syncCatalogToFirebase(): Promise<{ count: number; success: boolean }> {
  try {
    let synced = 0;
    for (const prod of FALLBACK_PRODUCTS) {
      const prodRef = doc(db, "products", prod.slug);
      await setDoc(
        prodRef,
        {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          sku: prod.sku,
          pricePKR: Number(prod.price),
          shortDescription: prod.shortDescription,
          description: prod.description,
          category: prod.category?.name || "Luxury",
          categorySlug: prod.category?.slug || "general",
          images: prod.images.map((img) => img.url),
          inStock: (prod.inventory?.quantity ?? 1) > 0,
          movement: prod.movement || null,
          caseMaterial: prod.caseMaterial || null,
          waterResistance: prod.waterResistance || null,
          concentration: prod.concentration || null,
          syncedAt: serverTimestamp(),
          brand: "VELORA Pakistan",
        },
        { merge: true }
      );
      synced++;
    }

    console.log(`[Firebase Database] Synced ${synced} catalog products to Firestore.`);
    return { count: synced, success: true };
  } catch (error) {
    console.error("[Firebase Database] Failed to sync catalog to Firestore:", error);
    return { count: 0, success: false };
  }
}

/**
 * Fetch catalog products from Firebase Firestore
 */
export async function getFirebaseProducts(): Promise<any[]> {
  try {
    const productsCol = collection(db, "products");
    const snap = await getDocs(productsCol);

    if (snap.empty) {
      return FALLBACK_PRODUCTS;
    }

    return snap.docs.map((d) => d.data());
  } catch (error) {
    console.warn("[Firebase Database] Could not fetch products, using fallback catalog:", error);
    return FALLBACK_PRODUCTS;
  }
}

/**
 * Diagnostic test connection to Firebase Database
 */
export async function testFirebaseConnection(): Promise<{
  connected: boolean;
  projectId: string;
  timestamp: string;
  error?: string;
}> {
  try {
    const testDoc = doc(db, "_system_diagnostics", "connection_test");
    await setDoc(
      testDoc,
      {
        lastPing: serverTimestamp(),
        client: "VELORA Pakistan Web Platform",
        status: "ONLINE",
      },
      { merge: true }
    );

    return {
      connected: true,
      projectId: db.app.options.projectId || "watches-and-perfume-brand",
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      connected: false,
      projectId: db.app.options.projectId || "watches-and-perfume-brand",
      timestamp: new Date().toISOString(),
      error: error.message || "Failed to reach Firestore",
    };
  }
}
