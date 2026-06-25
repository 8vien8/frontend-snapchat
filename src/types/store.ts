import type { User } from "@/types/user";
import type { SignInPayload, SignUpPayload } from "@/services/auth.service";
import type { Conversation, Message } from "@/types/chat";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;

  signUp: (payload: SignUpPayload) => Promise<void>;

  signIn: (payload: SignInPayload) => Promise<void>;

  setAccessToken: (accessToken: string | null) => void;

  clearState: () => void;

  logOut: () => Promise<void>;

  getMe: () => Promise<void>;

  refreshAccessToken: () => Promise<string | null>;

  initializeAuth: () => Promise<void>;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean;
      nextCursor?: string | null;
    }
  >;

  activeConversationId: string | null;
  convoLoading: boolean;
  messagesLoading: boolean;
  reset: () => void;

  setActiveConversation: (conversationId: string | null) => void;
  fetchConversation: () => Promise<void>;
  fetchMessages: (conversationId?: string) => Promise<void>;
  sendDirectMessages: (
    recipientId: string,
    content: string,
    imageUrl?: string,
  ) => Promise<void>;
  sendGroupMessages: (
    conversationId: string,
    content: string,
    imageUrl?: string,
  ) => Promise<void>;
}
