import EmojiPicker, {
  Theme as EmojiTheme,
  // type EmojiClickData,
} from "emoji-picker-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { useTheme } from "@/components/theme/theme-context";
import { Button } from "@/components/ui/button";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPick = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();
  const emojiTheme =
    resolvedTheme === "dark" ? EmojiTheme.DARK : EmojiTheme.LIGHT;

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          asChild
          variant={"ghost"}
          size={"icon-sm"}
          className="hover:bg-primary/20 dark:hover:bg-primary/20 p-1 text-primary"
        >
          <Smile />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={20}
        alignOffset={-53}
        className="w-90 max-[374px]:w-77 bg-transparent border-none shadow-none p-0 rounded-sm drop-shadow-none"
      >
        <EmojiPicker
          onEmojiClick={(emojiObject) => onChange(emojiObject.emoji)}
          theme={emojiTheme}
          lazyLoadEmojis
          searchPlaceHolder="Find your emoji"
          style={{
            width: "100%",
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
export default EmojiPick;
