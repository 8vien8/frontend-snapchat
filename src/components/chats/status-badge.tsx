import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: "online" | "offline" }) => {
  const statusColor =
    status === "online"
      ? "bg-green-500 dark:bg-green-400"
      : "bg-gray-300 dark:bg-gray-500";

  return (
    <div
      className={cn(
        "absolute bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-foreground/10",
        statusColor,
      )}
    ></div>
  );
};
export default StatusBadge;
