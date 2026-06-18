import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: "online" | "offline" }) => {
  const statusColor = status === "online" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={cn(
        "absolute bottom-0.5 -right-0.5 size-4 rounded-full border-2 border-foreground/30",
        statusColor,
      )}
    ></div>
  );
};
export default StatusBadge;
