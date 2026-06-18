import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface IUserAvatarProps {
  type: "sidebar" | "chat" | "profile";
  name: string;
  avatarUrl?: string;
  className?: string;
}

const BRAND_NAME = "Snap";

const UserAvatar = ({ type, name, avatarUrl, className }: IUserAvatarProps) => {
  const bgColor = !avatarUrl ? "bg-blue-500" : "";
  const displayName = name ? name : BRAND_NAME;
  const avatarStyle =
    type === "sidebar"
      ? "size-12 text-base"
      : type === "chat"
        ? " size-8 text-sm"
        : "size-24 text-3xl shadow-md";

  return (
    <Avatar className={cn(avatarStyle, className)}>
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className={`${bgColor} text-white font-semibold`}>
        {displayName.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
