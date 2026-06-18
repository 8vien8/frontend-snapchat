import { useChatStore } from "@/stores/use-chat-store";
import DirectMessageCard from "@/components/chats/direct/direct-chat-card";

const DirectMessageList = () => {
  const { conversations } = useChatStore();
  const directConversations = conversations.filter(
    (conversation) => conversation.type === "direct",
  );

  if (!conversations) return;

  return (
    <div className="flex-1 overflow-y-auto p-0.5 space-y-2">
      {directConversations.map((convo) => (
        <DirectMessageCard key={convo._id} convo={convo} />
      ))}
    </div>
  );
};
export default DirectMessageList;
