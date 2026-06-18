import { Badge } from "@/components/ui/badge";

const UnreadCountBadge = ({ unreadCount }: { unreadCount: number }) => {
  return (
    <div className="absolute z-20 -top-1 -right-1">
      {/* Ping nhẹ */}
      <div className="animate-[ping_2s_cubic-bezier(0,0,0.3,1)_infinite] absolute inset-0 rounded-full bg-primary/30" />

      {/* Badge chính */}
      <Badge className="animate-pulse relative size-5 text-xs text-primary bg-background/80 border-[1.5px] border-primary/30 rounded-full">
        {unreadCount > 9 ? "9+" : unreadCount}
      </Badge>
    </div>
  );
};
export default UnreadCountBadge;
