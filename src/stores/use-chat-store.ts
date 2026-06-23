import { toastVariants } from "@/components/toaster";
import { getErrorMessage } from "@/lib/get-error-message";
import { chatService } from "@/services/chat.service";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/stores/use-auth.store";
import type { Message } from "@/types/chat";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messagesLoading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),

      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messagesLoading: false,
        });
      },
      fetchConversation: async () => {
        try {
          set({ convoLoading: true });
          const { conversations } = await chatService.fetchConversation();

          set({ conversations, convoLoading: false });
        } catch (error) {
          const message = getErrorMessage(error, "Can not fetch conversations");
          toastVariants.error("Conversations fetching failed", message);
          throw error;
        } finally {
          set({ convoLoading: false });
        }
      },
      fetchMessages: async (conversationId) => {
        if (get().messagesLoading) return;
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;

        if (!convoId) return;

        const currOpenMessage = messages?.[convoId];
        const nextCursor =
          currOpenMessage?.nextCursor === undefined
            ? ""
            : currOpenMessage?.nextCursor;

        if (nextCursor === null) return;

        set({ messagesLoading: true });

        try {
          const { messages: fetchedMess, cursor } =
            await chatService.fetchMessages(convoId, nextCursor);

          const processed = fetchedMess.map((message: Message) => ({
            ...message,
            isOwn: message.senderId === user?._id,
          }));

          set((state) => {
            const prev = state.messages[convoId]?.items ?? [];
            const merged =
              prev.length > 0 ? [...processed, ...prev] : processed;
            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error(error);
        } finally {
          set({ messagesLoading: false });
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
