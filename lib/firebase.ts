import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  linkWithCredential,
  Auth,
  AuthCredential,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Helper functions for authentication
export const signInWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export const signInWithFacebook = async () => {
  return await signInWithPopup(auth, facebookProvider);
};

export const signOutUser = async () => {
  return await signOut(auth);
};

// Helper function to get user role from custom claims
export const getUserRole = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const idTokenResult = await currentUser.getIdTokenResult();
  return (idTokenResult.claims.role as string) || null;
};

/**
 * Link account with pending credential
 * This should be called AFTER user has manually signed in with the existing provider
 */
export const linkCredentialToCurrentUser = async (
  pendingCredential: AuthCredential
) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No user is currently signed in");
  }

  try {
    await linkWithCredential(currentUser, pendingCredential);
    console.log("Successfully linked accounts!");
    return currentUser;
  } catch (linkError) {
    console.error("Failed to link credential:", linkError);
    throw linkError;
  }
};

export default app;
