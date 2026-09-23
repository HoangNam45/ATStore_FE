"use client";

import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Only initialize Firebase in browser environment
let auth: any;
let db: ReturnType<typeof getFirestore> | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let facebookProvider: FacebookAuthProvider | undefined;

if (typeof window !== "undefined") {
  // Initialize app only once
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  auth = getAuth();
  db = getFirestore();
  googleProvider = new GoogleAuthProvider();
  facebookProvider = new FacebookAuthProvider();
}

export { auth, googleProvider, facebookProvider, db };

/**
 * Subscribe to the server-owned payment status projection. The client never
 * writes payment state and does not need to poll the API while waiting.
 */
export const subscribeToPaymentStatus = (
  orderId: string,
  onChange: (status: { status?: string; failureReason?: string }) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  if (!db) throw new Error("Firebase not initialized");

  return onSnapshot(
    doc(db, "paymentStatus", orderId),
    (snapshot) => onChange(snapshot.exists() ? (snapshot.data() as any) : {}),
    (error) => onError?.(error),
  );
};
