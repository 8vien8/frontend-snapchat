import { SidebarInset } from "@/components/ui/sidebar";
import { MessageCircleMore } from "lucide-react";
import { ChatWindowHeader } from "@/components/layouts/chat-screen-layout";

const WelComeScreen = () => {
  return (
    <SidebarInset>
      <ChatWindowHeader />
      <div className="bg-gradient-chat flex h-full items-center justify-center">
        <div className="max-w-lg px-6 text-center">
          <div className="mb-6 inline-flex size-20 items-center justify-center rounded-3xl bg-primary/10">
            <MessageCircleMore className="size-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>

          <p className="mt-3 text-muted-foreground">
            <strong className="text-primary">Select a conversation </strong>{" "}
            from the sidebar to start chatting, or{" "}
            <strong className="text-primary">create a new </strong> conversation
            to begin.
          </p>
        </div>
      </div>
    </SidebarInset>
  );
};
export default WelComeScreen;
