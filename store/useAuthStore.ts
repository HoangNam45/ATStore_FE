import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "@/types/auth.types";

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
