"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // User is signed out in Firebase, clear Zustand state
        if (user) {
          console.log(
            "Firebase auth state: signed out, clearing Zustand state"
          );
          logout();
        }
      } else {
        // User is signed in, verify token is still valid
        try {
          await firebaseUser.getIdToken(true); // Force refresh token
        } catch (error) {
          console.error("Token refresh failed:", error);
          logout();
        }
      }
    });

    return () => unsubscribe();
  }, [user, logout]);

  return <>{children}</>;
}
