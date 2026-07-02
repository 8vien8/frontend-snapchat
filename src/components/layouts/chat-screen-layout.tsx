import { SidebarInset } from "@/components/ui/sidebar";
import { useChatStore } from "@/stores/use-chat-store";
import ChatMessageInput from "@/components/inputs/message-input";
import WelComeScreen from "@/components/welcome-screen";
import { Separator } from "@/components/ui/separator";
import type { Conversation, Message, Participant } from "@/types/chat";
import { useAuthStore } from "@/stores/use-auth.store";
import UserAvatar from "@/components/chats/user-avatar";
import StatusBadge from "@/components/chats/status-badge";
import GroupAvatar from "@/components/chats/group/group-avatar";
import ToggleSideBarButton from "@/components/animations/toggle-sidebar-button";
import NoChatBeforeScreen from "@/components/no-message-before-screen";
import MessageItem from "@/components/chats/message-item";
import { useSocketStore } from "@/stores/use-socket-store";
import { ArrowDown } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "@/components/ui/button";

const ChatScreenLayout = () => {
  const { activeConversationId, conversations } = useChatStore();
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
    <SidebarInset className="h-screen m-0! shadow shadow-primary/15 rounded-none!">
      <ChatWindowHeader currChat={currChat} partner={otherUser} />
      <ChatWindowBody />
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
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  const hasOnlineMember = currChat?.participants.some(
    (participant) =>
      onlineUsers.includes(participant._id) && participant._id !== user?._id,
  );
  return (
    <header className="flex items-center gap-2 px-4 py-2 shrink-0 h-12 lg:h-16">
      <ToggleSideBarButton />
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
            <StatusBadge
              status={
                onlineUsers.includes(partner?._id ?? "") ? "online" : "offline"
              }
            />
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
            <StatusBadge status={hasOnlineMember ? "online" : "offline"} />
          </div>
          <h2 className="ml-3 font-semibold text-foreground">
            {currChat?.group.name}
          </h2>
        </>
      )}
    </header>
  );
};

/**
 * memo hoá MessageItem: so sánh theo "danh tính" tin nhắn (id chính nó +
 * id tin trước/sau) thay vì index tuyệt đối, để khi prepend tin cũ vào
 * đầu mảng (làm index các tin cũ hơn bị dịch) thì các item đã render
 * trước đó KHÔNG bị re-render.
 */
const MemoizedMessageItem = memo(MessageItem, (prev, next) => {
  if (prev.message._id !== next.message._id) return false;
  if (prev.lastMessageStatus !== next.lastMessageStatus) return false;
  if (prev.selectedConvo._id !== next.selectedConvo._id) return false;
  if (prev.selectedConvo.seenBy !== next.selectedConvo.seenBy) return false;

  const prevBefore = prev.messages[prev.index - 1]?._id;
  const nextBefore = next.messages[next.index - 1]?._id;
  if (prevBefore !== nextBefore) return false;

  const prevAfter = prev.messages[prev.index + 1]?._id;
  const nextAfter = next.messages[next.index + 1]?._id;
  if (prevAfter !== nextAfter) return false;

  return true;
});

const NEAR_BOTTOM_THRESHOLD = -120; // px (scrollTop, vì container là column-reverse)

type ScrollRequest = { behavior: ScrollBehavior } | null;

type Track = {
  convoId: string | null;
  firstId: string | null;
  lastId: string | null;
};

export const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    markAsSeen,
    fetchMessages,
  } = useChatStore();

  const conversationData = allMessages[activeConversationId ?? ""];
  const messages: Message[] = conversationData?.items ?? [];
  const hasMore = conversationData?.hasMore ?? true;

  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Toàn bộ giá trị "trước đó" dùng để so sánh giữa các lần render đều
  // là state, không phải ref, vì ta cần đọc chúng ngay trong thân
  // component (render phase) để suy ra hành vi tiếp theo.
  const [track, setTrack] = useState<Track>({
    convoId: undefined as unknown as string | null,
    firstId: null,
    lastId: null,
  });
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [scrollRequest, setScrollRequest] = useState<ScrollRequest>(null);

  // ---- RENDER PHASE: suy ra state dựa trên dữ liệu mới (KHÔNG đụng ref) ----
  if (track.convoId !== activeConversationId) {
    // Đổi cuộc trò chuyện -> reset theo dõi
    const firstId = messages[0]?._id ?? null;
    const lastId = messages[messages.length - 1]?._id ?? null;

    setTrack({ convoId: activeConversationId ?? null, firstId, lastId });
    setIsNearBottom(true);

    if (hasNewMessage) setHasNewMessage(false);
    if (messages.length > 0) {
      setScrollRequest({ behavior: "auto" });
    }
  } else if (messages.length > 0) {
    const firstId = messages[0]._id;
    const lastId = messages[messages.length - 1]._id;

    if (firstId !== track.firstId || lastId !== track.lastId) {
      const appended = lastId !== track.lastId;

      setTrack({ convoId: activeConversationId ?? null, firstId, lastId });

      if (appended) {
        const newMessage = messages[messages.length - 1];
        if (newMessage.isOwn || isNearBottom) {
          setScrollRequest({ behavior: "smooth" });
          if (hasNewMessage) setHasNewMessage(false);
        } else if (!hasNewMessage) {
          setHasNewMessage(true);
        }
      }
      // else: chỉ prepend tin cũ -> không cần làm gì, column-reverse +
      // inverse của InfiniteScroll tự giữ nguyên vị trí đọc.
    }
  }

  // ---- LAYOUT EFFECT: chỉ thao tác DOM thuần tuý, KHÔNG setState ----
  useLayoutEffect(() => {
    if (!scrollRequest) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    // column-reverse: scrollTop = 0 chính là đáy (tin mới nhất)
    container.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollRequest]);

  useEffect(() => {
    if (!selectedConvo || !isNearBottom) return;

    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error(error);
      }
    };

    markSeen();
  }, [markAsSeen, selectedConvo, isNearBottom]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const nearBottom = container.scrollTop > NEAR_BOTTOM_THRESHOLD;
    setIsNearBottom((prev) => (prev !== nearBottom ? nearBottom : prev));

    if (nearBottom) {
      setHasNewMessage(false);
    }
  }, []);

  const fetchMoreMessages = useCallback(() => {
    if (!activeConversationId) return;
    fetchMessages(activeConversationId);
  }, [activeConversationId, fetchMessages]);

  const scrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setHasNewMessage(false);
  };

  if (messages.length === 0 || !selectedConvo) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto">
        <NoChatBeforeScreen />
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-h-0">
      <div
        id="chat-scroll-container"
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="bg-gradient-chat h-full overflow-y-auto bg-primary-foreground flex flex-col-reverse"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          inverse={true}
          scrollableTarget="chat-scroll-container"
          style={{ display: "flex", flexDirection: "column-reverse" }}
          loader={
            <div className="flex justify-center py-2 text-xs text-muted-foreground">
              Đang tải tin nhắn cũ hơn...
            </div>
          }
        >
          <div className="flex flex-col px-4 py-2">
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              let status: "delivered" | "seen" = "delivered";
              if (
                isLastMessage &&
                selectedConvo.seenBy &&
                selectedConvo.seenBy.length > 0
              ) {
                const otherSeen = selectedConvo.seenBy.some(
                  (u) => u._id !== message.senderId,
                );
                if (otherSeen) {
                  status = "seen";
                }
              }
              return (
                <MemoizedMessageItem
                  key={message._id}
                  index={index}
                  messages={messages}
                  message={message}
                  selectedConvo={selectedConvo}
                  lastMessageStatus={status}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      </div>

      {hasNewMessage && (
        <Button
          variant={"ghost"}
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-5 bg-primary text-primary-foreground shadow-lg animate-fade-in hover:opacity-90 border-foreground/20"
        >
          Tin nhắn mới
          <ArrowDown className="size-3.5 animate-bounce" />
        </Button>
      )}
    </div>
  );
};

export default ChatScreenLayout;
