import { create } from "zustand";
import { toastVariants } from "@/components/toaster";
import {
  authService,
  type SignInPayload,
  type SignUpPayload,
} from "@/services/auth.service";
import type { AuthState } from "@/types/store";
import { getErrorMessage } from "@/lib/get-error-message";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isLoading: true,

  clearState: () => {
    set({
      accessToken: null,
      user: null,
      isLoading: false,
    });
  },

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
      const accessToken = res?.accessToken;

      set({ accessToken: accessToken });

      await get().getMe();

      toastVariants.success(
        `Wellcome back to Snap, ${userName}`,
        "Let's start your chat now!",
      );
    } catch (error) {
      const message = getErrorMessage(error, "Can not login");

      toastVariants.error("Login failed", message);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logOut: async () => {
    set({ isLoading: true });

    try {
      get().clearState();
      await authService.logOut();

      toastVariants.success("Logout Success", "");
    } catch (error) {
      const message = getErrorMessage(error, "Can not logout");

      toastVariants.error("Logout failed", message);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  refreshAccessToken: async () => {
    try {
      const accessToken = await authService.refreshAccessToken();
      set({ accessToken });

      return accessToken;
    } catch {
      set({ user: null, accessToken: null });
      return null;
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });

    try {
      const accessToken = await get().refreshAccessToken();

      if (accessToken) {
        await get().getMe();
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getMe: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getMe();
      set({ user });
    } catch (error) {
      const message = getErrorMessage(error, "Can not get profile");

      set({ user: null, accessToken: null });

      toastVariants.error("Fetch  profile failed", message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
