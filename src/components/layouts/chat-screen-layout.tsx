import { SidebarInset } from "@/components/ui/sidebar";
import { useChatStore } from "@/stores/use-chat-store";
import ChatMessageInput from "@/components/inputs/message-input";
import WelComeScreen from "@/components/welcome-screen";
import { Separator } from "@/components/ui/separator";
import type { Conversation, Participant } from "@/types/chat";
import { useAuthStore } from "@/stores/use-auth.store";
import UserAvatar from "@/components/chats/user-avatar";
import StatusBadge from "@/components/chats/status-badge";
import GroupAvatar from "@/components/chats/group/group-avatar";
import ToggleSideBarButton from "@/components/animations/toggle-sidebar-button";
import NoChatBeforeScreen from "@/components/no-message-before-screen";
import MessageItem from "@/components/chats/message-item";

const ChatScreenLayout = () => {
  const {
    activeConversationId,
    conversations,
    messagesLoading: loading,
    messages,
  } = useChatStore();
  const { user } = useAuthStore();

  const selectedConvo =
    conversations.find((convo) => convo._id === activeConversationId) ?? null;

  let otherUser;
  const currChat = conversations.find(
    (convo) => convo._id === activeConversationId,
  );
  if (currChat?.type === "direct") {
    const otherUsers = currChat.participants.filter((p) => p._id != user?._id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

    if (!user || !otherUser) return;
  }

  if (!selectedConvo) return <WelComeScreen />;

  return (
    <SidebarInset className="shadow shadow-primary/15">
      <ChatWindowHeader currChat={currChat} partner={otherUser} />
      {loading ? <>Skeleton</> : <ChatWindowBody />}
      <ChatMessageInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
};

export const ChatWindowHeader = ({
  currChat,
  partner,
}: {
  currChat?: Conversation;
  partner?: Participant;
}) => {
  return (
    <header className="flex items-center gap-2 px-4 py-2 shrink-0 h-12">
      <ToggleSideBarButton />
      {/* <SidebarTrigger className="-ml-1" /> */}
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-6"
      />
      {partner && (
        <>
          <div className="relative">
            <UserAvatar
              type="sidebar"
              avatarUrl={partner?.avatarUrl ?? undefined}
              name={partner.displayName}
            />
            {/* TODO: update real status */}
            <StatusBadge status="offline" />
          </div>
          <h2 className="ml-3 font-semibold text-foreground">
            {partner.displayName}
          </h2>
        </>
      )}
      {currChat && !partner && (
        <>
          <div className="relative">
            <GroupAvatar type="sidebar" participants={currChat?.participants} />
            <StatusBadge status="offline" />
            {/* TODO: update real status */}
          </div>
          <h2 className="ml-3 font-semibold text-foreground">
            {currChat?.group.name}
          </h2>
        </>
      )}
    </header>
  );
};

export const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
  } = useChatStore();

  const messages = allMessages[activeConversationId!]?.items || [];
  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );

  // TODO:
  if (!selectedConvo) return <div> Please choose conversation </div>;

  if (!messages) return <NoChatBeforeScreen />;

  return (
    <div className="bg-gradient-chat flex-1 overflow-y-auto bg-primary-foreground p-4">
      <div className="flex flex-col overflow-x-hidden overflow-y-auto">
        {messages.map((message, index) => (
          <MessageItem
            key={message._id}
            index={index}
            messages={messages}
            message={message}
            selectedConvo={selectedConvo}
            lastMessageStatus="delivered"
          />
        ))}
      </div>
    </div>
  );
};

export default ChatScreenLayout;
