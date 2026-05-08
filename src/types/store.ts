import type { User } from "@/types/user";
import type { SignUpPayload } from "@/services/auth.service";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;

  signUp: (payload: SignUpPayload) => Promise<void>;
}
