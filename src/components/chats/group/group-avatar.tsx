import type { Participant } from "@/types/chat";
import UserAvatar from "@/components/chats/user-avatar";
import { Ellipsis } from "lucide-react";

interface GroupAvatarProps {
  participants: Participant[];
  type: "chat" | "sidebar";
}

const GroupAvatar = ({ participants, type }: GroupAvatarProps) => {
  const avatars = [];
  const limit = Math.min(participants.length, 4);

  for (let i = 0; i < limit; i++) {
    const member = participants[i];
    avatars.push(
      <UserAvatar
        key={i}
        type={type}
        name={member.displayName}
        avatarUrl={member.avatarUrl ?? undefined}
      />,
    );
  }

  return (
    <div className="relative flex -space-x-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-2">
      {avatars}
      {limit === 4 && (
        <div className="flex z-10 items-center justify-center size-8 rounded-full bg-muted ring-2 ring-background text-muted-foreground">
          <Ellipsis className="size-4" />
        </div>
      )}
    </div>
  );
};
export default GroupAvatar;
