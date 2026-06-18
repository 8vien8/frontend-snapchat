import type { Conversation } from "@/types/chat";
import ChatCard from "@/components/chats/chat-card";
import { useAuthStore } from "@/stores/use-auth.store";
import { useChatStore } from "@/stores/use-chat-store";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/chats/user-avatar";
import StatusBadge from "@/components/chats/status-badge";
import UnreadCountBadge from "@/components/chats/unread-count-badge";

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages } =
    useChatStore();

  if (!user) return;
  const otherUser = convo.participants.find((p) => p._id !== user?._id);
  if (!otherUser) return;

  const unreadCount = convo.unreadCounts[user._id];
  const lastMessage = convo.lastMessage?.content ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      // TODO: fetch message
    }
  };

  return (
    <ChatCard
      conversationId={convo._id}
      name={otherUser?.displayName ?? ""}
      timestamp={
        convo.lastMessage?.createdAt
          ? new Date(convo.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === convo._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          <UserAvatar
            type="sidebar"
            name={otherUser.displayName ?? ""}
            avatarUrl={otherUser.avatarUrl ?? ""}
          />
          {/* TODO: status badge */}
          <StatusBadge status="offline" />

          {unreadCount >= 0 && <UnreadCountBadge unreadCount={unreadCount} />}
        </>
      }
      subtitle={
        <p
          className={cn(
            "text-xs truncate",
            unreadCount > 0
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          )}
        >
          {lastMessage}
        </p>
      }
    />
  );
};
export default DirectMessageCard;
