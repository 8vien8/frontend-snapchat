import { toastVariants } from "@/components/toaster";
import { getErrorMessage } from "@/lib/get-error-message";
import { chatService } from "@/services/chat.service";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      loading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),

      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          loading: false,
        });
      },
      fetchConversation: async () => {
        try {
          set({ loading: true });
          const { conversations } = await chatService.fetchConversation();

          set({ conversations, loading: false });
        } catch (error) {
          const message = getErrorMessage(error, "Can not fetch conversations");
          toastVariants.error("Conversations fetching failed", message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),

    {
      name: "chat-storage",
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    },
  ),
);
