import type { User } from "@/types/user";
import type { SignInPayload, SignUpPayload } from "@/services/auth.service";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;

  signUp: (payload: SignUpPayload) => Promise<void>;

  signIn: (payload: SignInPayload) => Promise<void>;

  clearState: () => void;

  logOut: () => Promise<void>;

  getMe: () => Promise<void>;

  refreshAccessToken: () => Promise<string | null>;

  initializeAuth: () => Promise<void>;
}
