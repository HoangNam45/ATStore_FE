import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: string;
  providers: Array<"email" | "google" | "facebook">;
  emailVerified: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  lastLoginAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  getInitials: () => string;
  isUserOwner: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user) =>
        set({
          user,
          isLoggedIn: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),

      getInitials: () => {
        const user = get().user;
        if (!user || !user.displayName) return "GU";

        const names = user.displayName.trim().split(" ");
        if (names.length === 1) {
          return names[0].substring(0, 2).toUpperCase();
        }
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      },

      isUserOwner: () => {
        const user = get().user;
        return user?.role === "admin";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
