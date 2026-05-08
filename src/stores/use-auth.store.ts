import { create } from "zustand";
import { toastVariants } from "@/components/toaster";
import {
  authService,
  type SignInPayload,
  type SignUpPayload,
} from "@/services/auth.service";
import type { AuthState } from "@/types/store";
import { getErrorMessage } from "@/lib/get-error-message";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isLoading: false,

  signUp: async (payload: SignUpPayload) => {
    set({ isLoading: true });

    try {
      await authService.signUp(payload);

      toastVariants.success("Registration successful!");
    } catch (error) {
      const message = getErrorMessage(error, "Cannot create account");

      toastVariants.error("Registration failed", message);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (payload: SignInPayload) => {
    set({ isLoading: true });

    try {
      const res = await authService.signIn(payload);
      const userName = res?.userName;

      toastVariants.success(
        `Wellcome back to Snap, ${userName}`,
        "Let's start your chat now!",
      );
    } catch (error) {
      const message = getErrorMessage(error, "Cannot login");

      toastVariants.error("Login failed", message);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
