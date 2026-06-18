import { useChatStore } from "@/stores/use-chat-store";
import GroupMessageCard from "@/components/chats/group/group-chat-card";

const GroupMessageList = () => {
  const { conversations } = useChatStore();
  const groupConversations = conversations.filter(
    (conversation) => conversation.type === "group",
  );

  if (!conversations) return;

  return (
    <div className="flex-1 overflow-y-auto p-0.5 space-y-2">
      {groupConversations.map((convo) => (
        <GroupMessageCard key={convo._id} convo={convo} />
      ))}
    </div>
  );
};
export default GroupMessageList;
