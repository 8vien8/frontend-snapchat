import { useAuthStore } from "@/stores/use-auth.store";
import type { Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { ImagePlus, SendIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import EmojiPick from "@/components/chats/emoji-picker";
import { useChatStore } from "@/stores/use-chat-store";
import { toastVariants } from "@/components/toaster";

const ChatMessageInput = ({
  selectedConvo,
}: {
  selectedConvo: Conversation;
}) => {
  const { user } = useAuthStore();
  const { sendDirectMessages, sendGroupMessages } = useChatStore();
  const [value, setValue] = useState("");

  const sendMessage = async () => {
    if (!value.trim) return;
    const currValue = value;
    setValue("");
    try {
      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.filter((p) => p._id !== user?._id)[0];
        await sendDirectMessages(otherUser._id, currValue);
      } else {
        sendGroupMessages(selectedConvo._id, currValue);
      }
    } catch (error) {
      console.error(error);
      toastVariants.error(
        "Can not send message",
        "Error occurred when send message, please try again!",
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) return;

  return (
    <div className="flex items-center gap-2 p-1.5 md:p-3 min-h-14 bg-gradient-chat">
      <Button
        variant={"ghost"}
        size={"icon-lg"}
        className="hover:bg-primary/20"
      >
        <ImagePlus className="size-5 md:size-6 text-primary" />
      </Button>

      <div className="relative flex-1">
        <Input
          onKeyDown={handleKeyPress}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Send your message here..."
          className="pr-10 md:pr-20 h-10 resize-none border-2"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <EmojiPick onChange={(emoji) => setValue(`${value}${emoji}`)} />
        </div>
      </div>
      <Button
        variant={"ghost"}
        size={"icon-lg"}
        className="bg-primary hover:[&_svg]:scale-120 text-white hover:text-primary"
        onClick={sendMessage}
        disabled={value === ""}
      >
        <SendIcon className="size-4" />
      </Button>
    </div>
  );
};
export default ChatMessageInput;
