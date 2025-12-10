import {
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "@/lib/firebase/firebaseClient";
import type { SignInRequest, SocialSignInRequest } from "@/types/auth.types";

export const firebaseAuthService = {
  // email + password sign in, with remember option
  signInWithEmail: async (data: SignInRequest) => {
    if (!auth) throw new Error("Firebase not initialized");
    const persistence = data.remember
      ? browserLocalPersistence
      : browserSessionPersistence;
    await setPersistence(auth, persistence);
    const result = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return result;
  },

  signInWithGoogle: async (data?: SocialSignInRequest) => {
    if (!auth || !googleProvider) throw new Error("Firebase not initialized");
    const persistence = data?.remember
      ? browserLocalPersistence
      : browserSessionPersistence;
    await setPersistence(auth, persistence);
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  },

  signInWithFacebook: async (data?: SocialSignInRequest) => {
    if (!auth || !facebookProvider) throw new Error("Firebase not initialized");
    const persistence = data?.remember
      ? browserLocalPersistence
      : browserSessionPersistence;
    await setPersistence(auth, persistence);
    const result = await signInWithPopup(auth, facebookProvider);
    return result;
  },
};
