import { create } from "zustand";
import { toastVariants } from "@/components/toaster";
import { authService, type SignUpPayload } from "@/services/auth.service";
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
}));
