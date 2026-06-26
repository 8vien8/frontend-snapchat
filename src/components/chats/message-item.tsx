import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "@/components/chats/user-avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/use-auth.store";

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
  const { user } = useAuthStore();
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
        {message._id === selectedConvo.lastMessage?._id && (
          <div className="flex flex-col items-end mt-1">
            {selectedConvo.type === "direct" ? (
              message.isOwn && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-1 py-0.5 border-none animate-fade-in",
                    lastMessageStatus === "seen"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {lastMessageStatus === "seen" ? "Seen" : "Delivered"}
                </Badge>
              )
            ) : (
              (() => {
                const seenByOthers = (selectedConvo.seenBy || []).filter(
                  (u) => u._id !== message.senderId && u._id !== user?._id
                );
                if (seenByOthers.length > 0) {
                  return (
                    <div className="flex items-center gap-1 mt-0.5 pr-1 animate-fade-in">
                      <div className="flex -space-x-1.5">
                        {seenByOthers.slice(0, 5).map((u) => (
                          <div key={u._id} title={u.displayName || "User"}>
                            <UserAvatar
                              type="seen"
                              name={u.displayName || "User"}
                              avatarUrl={u.avatarUrl ?? undefined}
                              className="border border-background hover:scale-110 transition-transform duration-200"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground ml-1 font-medium select-none">
                        {seenByOthers.length} seen
                      </span>
                    </div>
                  );
                }
                return message.isOwn ? (
                  <Badge
                    variant="outline"
                    className="text-xs px-1 py-0.5 border-none bg-muted text-muted-foreground animate-fade-in"
                  >
                    Delivered
                  </Badge>
                ) : null;
              })()
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default MessageItem;
