import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "@/components/chats/user-avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MessageItemProps {
  messages: Message[];
  message: Message;
  index: number;
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

const MessageItem = ({
  messages,
  message,
  index,
  lastMessageStatus,
  selectedConvo,
}: MessageItemProps) => {
  const prev = messages[index - 1];
  const isGroupBreak =
    index === 0 ||
    message.senderId !== prev?.senderId ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000; // 5mis;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );

  return (
    <div
      className={cn(
        "flex gap-2 mt-1.5",
        message.isOwn ? "justify-end" : "justify-start",
      )}
    >
      {/* Avatar*/}
      {!message.isOwn && (
        <div className="w-8">
          {isGroupBreak && (
            <UserAvatar
              type="chat"
              avatarUrl={participant?.avatarUrl ?? undefined}
              name={participant?.displayName ?? "Snap"}
            />
          )}
        </div>
      )}
      {/* Messages */}
      <div
        className={cn(
          "max-w-xs lg:max-w-md space-y-1 flex flex-col",
          message.isOwn ? "items-end" : "items-start",
        )}
      >
        <Card
          className={cn(
            "p-2 border rounded-sm",
            message.isOwn ? "chat-bulbble-sent " : " chat-bubble-received ",
          )}
        >
          <p className="text-sm leading-relaxed wrap-anywhere">
            {message.content}
          </p>
        </Card>
        {/* Time */}
        {isGroupBreak && (
          <span className="text-xs text-muted-foreground px-1">
            {formatMessageTime(new Date(message.createdAt))}
          </span>
        )}

        {/* message status */}
        {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
          <Badge
            variant={"outline"}
            className={cn(
              "text-xs px-1 py-0.5 border-none",
              lastMessageStatus === "seen"
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {lastMessageStatus}
          </Badge>
        )}
      </div>
    </div>
  );
};
export default MessageItem;
