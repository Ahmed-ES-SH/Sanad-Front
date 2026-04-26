"use client";

import { create } from "zustand";
import { useRouter } from "next/navigation";
import { User } from "../types/user";
import { logoutAction } from "../actions/authActions";

interface AuthStore {
  user: User | null;
  isLoading: boolean;

  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  clearUser: () => void;
  logout: (router: ReturnType<typeof useRouter>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,

  get isAuthenticated() {
    return !!get().user;
  },

  setUser: (user) => {
    set({ user });
  },

  clearUser: () => {
    set({ user: null });
  },

  logout: async (router) => {
    set({ isLoading: true });

    try {
      await logoutAction();

      set({ user: null });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
