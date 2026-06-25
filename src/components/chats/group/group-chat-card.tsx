import { useAuthStore } from "@/stores/use-auth.store";
import { useChatStore } from "@/stores/use-chat-store";
import type { Conversation } from "@/types/chat";
import ChatCard from "@/components/chats/chat-card";
import UnreadCountBadge from "@/components/chats/unread-count-badge";
import GroupAvatar from "@/components/chats/group/group-avatar";
import StatusBadge from "@/components/chats/status-badge";
import { useSocketStore } from "@/stores/use-socket-store";
// import GroupAvatar from "@/components/chats/group/group-avatar";

const GrouptMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
  } = useChatStore();

  if (!user) return;

  const unreadCount = convo.unreadCounts[user._id];
  const name = convo.group?.name ?? "";
  const hasOnlineMember = convo.participants.some(
    (participant) =>
      participant._id !== user._id && onlineUsers.includes(participant._id),
  );

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages(id);
    }
  };
  return (
    <ChatCard
      conversationId={convo._id}
      name={name}
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
          <GroupAvatar participants={convo.participants} type="chat" />
          <StatusBadge status={hasOnlineMember ? "online" : "offline"} />
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
        </>
      }
      subtitle={
        <p className="text-sm truncate text-muted-foreground">
          {convo.participants.length} members
        </p>
      }
    />
  );
};
export default GrouptMessageCard;
