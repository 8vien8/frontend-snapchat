import { toastVariants } from "@/components/toaster";
import { getErrorMessage } from "@/lib/get-error-message";
import { chatService } from "@/services/chat.service";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/stores/use-auth.store";
import type { Conversation, Message } from "@/types/chat";

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
      sendDirectMessages: async (recipientId, content, imageUrl) => {
        try {
          const { activeConversationId } = get();
          await chatService.sendDirectMessage(
            recipientId,
            content,
            imageUrl,
            activeConversationId || undefined,
          );
          set((state) => ({
            conversations: state.conversations.map((convo) =>
              convo._id === activeConversationId
                ? { ...convo, seenBy: [] }
                : convo,
            ),
          }));
        } catch (error) {
          console.error(error);
        }
      },
      sendGroupMessages: async (conversationId, content, imageUrl) => {
        try {
          await chatService.sendGroupMessage(conversationId, content, imageUrl);
          set((state) => ({
            conversations: state.conversations.map((convo: Conversation) =>
              convo._id === get().activeConversationId
                ? { ...convo, seenBy: [] }
                : convo,
            ),
          }));
        } catch (error) {
          console.error(error);
        }
      },

      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message.isOwn = message.senderId === user?._id;

          const convoId = message.conversationId;

          let prevItem = get().messages[convoId]?.items ?? [];

          if (prevItem.length === 0) {
            await fetchMessages(message.conversationId);
            prevItem = get().messages[convoId]?.items;
          } // ensure always put lated message into the end of list

          set((state) => {
            if (prevItem.some((m) => m._id === message._id)) {
              return state;
            }

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...prevItem, message],
                  hasMore: state.messages[convoId].hasMore,
                  nextCursor: state.messages[convoId].nextCursor ?? undefined,
                },
              },
            };
          });
        } catch (error) {
          console.error("Error when add message", error);
        }
      },

      updateConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversation._id ? { ...c, ...conversation } : c,
          ),
        }));
      },

      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) return;

          const currConvo = conversations.find(
            (c) => c._id === activeConversationId,
          );

          if (!currConvo) return;

          if ((currConvo.unreadCounts?.[user._id] ?? 0) === 0) return;

          await chatService.markAsSeen(activeConversationId);

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unreadCounts: {
                      ...c.unreadCounts,
                      [user._id]: 0,
                    },
                    seenBy: c.seenBy.some((u) => u._id === user._id)
                      ? c.seenBy
                      : [
                          ...c.seenBy,
                          {
                            _id: user._id,
                            displayName: user.displayName,
                            avatarUrl: user.avatarUrl,
                          },
                        ],
                  }
                : c,
            ),
          }));
        } catch (error) {
          console.error("Can not mark as seen message", error);
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
