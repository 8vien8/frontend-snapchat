import { create } from "zustand";
import { toastVariants } from "@/components/toaster";
import {
  authService,
  type SignInPayload,
  type SignUpPayload,
} from "@/services/auth.service";
import type { AuthState } from "@/types/store";
import { getErrorMessage } from "@/lib/get-error-message";
import { persist } from "zustand/middleware";
import { useChatStore } from "@/stores/use-chat-store";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isLoading: true,

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      clearState: () => {
        set({
          accessToken: null,
          user: null,
          isLoading: false,
        });
        useChatStore.getState().reset();
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

        useChatStore.getState().reset();

        try {
          const res = await authService.signIn(payload);
          const userName = res?.userName;
          const accessToken = res?.accessToken;

          get().setAccessToken(accessToken);

          await get().getMe();
          useChatStore.getState().fetchConversation();

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

          toastVariants.success("Logged out", "Bye - See you soon!");
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
            useChatStore.getState().fetchConversation();
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
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // only presist user not include loadingState and accessToken
    },
  ),
);
