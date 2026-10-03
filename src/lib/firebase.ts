import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, Analytics, logEvent } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBqgJpAmINxTGRZ_ortcNIWkE0Lqac40cg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "watches-and-perfume-brand.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "watches-and-perfume-brand",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "watches-and-perfume-brand.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "289187487438",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:289187487438:web:40088a28e5096596493a9f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-NNBQ4HZHVK",
};

// Initialize Firebase App (singleton pattern across SSR & client)
export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Core Firebase Services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

// Client-safe Analytics singleton
let analyticsPromise: Promise<Analytics | null> | null = null;

export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null;
  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((yes) => (yes ? getAnalytics(app) : null))
      .catch((err) => {
        console.warn("Firebase Analytics could not be initialized:", err);
        return null;
      });
  }
  return analyticsPromise;
};

/**
 * Safely log an event to Firebase Analytics if supported
 */
export const logAnalyticsEvent = async (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (err) {
    console.debug(`[Firebase Analytics] Error logging event "${eventName}":`, err);
  }
};
