import { useAuthStore } from "@/stores/use-auth.store";
import { useChatStore } from "@/stores/use-chat-store";
import type { Conversation } from "@/types/chat";
import ChatCard from "@/components/chats/chat-card";
import UnreadCountBadge from "@/components/chats/unread-count-badge";
import GroupAvatar from "@/components/chats/group/group-avatar";
// import GroupAvatar from "@/components/chats/group/group-avatar";

const GrouptMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages } =
    useChatStore();

  if (!user) return;

  const unreadCount = convo.unreadCounts[user._id];
  const name = convo.group?.name ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      // TODO: fetch message
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
          {/* TODO: group avatar */}
          <GroupAvatar participants={convo.participants} type="chat" />
          {/* <GroupAvatar /> */}
          {/* TODO: status badge */}
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
