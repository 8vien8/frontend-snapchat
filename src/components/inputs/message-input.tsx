import { useAuthStore } from "@/stores/use-auth.store";
import type { Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { ImagePlus, SendIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import EmojiPick from "@/components/chats/emoji-picker";

const ChatMessageInput = ({
  selectedConvo,
}: {
  selectedConvo: Conversation;
}) => {
  const { user } = useAuthStore();
  const [value, setValue] = useState("");

  if (!user) return;

  return (
    <div className="flex items-center gap-2 p-1.5 md:p-3 min-h-14">
      <Button
        variant={"ghost"}
        size={"icon-lg"}
        className="hover:bg-primary/20"
      >
        <ImagePlus className="size-5 md:size-6 text-primary" />
      </Button>

      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Send your message here..."
          className="pr-10 md:pr-20 h-10 resize-none"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <EmojiPick onChange={(emoji) => setValue(`${value}${emoji}`)} />
        </div>
      </div>
      <Button
        variant={"ghost"}
        size={"icon-lg"}
        className="bg-primary hover:[&_svg]:scale-120 text-white hover:text-primary"
      >
        <SendIcon className="size-4" />
      </Button>
    </div>
  );
};
export default ChatMessageInput;
