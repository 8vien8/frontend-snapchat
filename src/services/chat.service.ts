import api from "@/lib/axios";
import { type Message, type ConversationResponse } from "@/types/chat";

interface FetchMessagesProps {
  messages: Message[];
  cursor?: string;
}

const pageLimit = 50;

export const chatService = {
  async fetchConversation(): Promise<ConversationResponse> {
    const res = await api.get("/conversations");
    return res.data;
  },

  async fetchMessages(id: string, cursor: string): Promise<FetchMessagesProps> {
    const res = await api.get(
      `/conversations/${id}/messages?limit=${pageLimit}&cursor=${cursor}`,
    );
    return { messages: res.data.messages, cursor: res.data.nextCursor };
  },

  async sendDirectMessage(
    recipientId: string,
    content: string,
    imageUrl?: string,
    conversationId?: string,
  ) {
    const res = await api.post("/message/direct", {
      recipientId,
      content,
      imageUrl,
      conversationId,
    });
    return res.data.message;
  },

  async sendGroupMessage(
    conversationId: string,
    content: string,
    imageUrl?: string,
  ) {
    const res = await api.post("/message/group", {
      conversationId,
      content,
      imageUrl,
    });
    return res.data.message;
  },
};
