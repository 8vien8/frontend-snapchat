import ChatScreenLayout from "@/components/layouts/chat-screen-layout";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ChatApp = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <ChatScreenLayout />
    </SidebarProvider>
  );
};
export default ChatApp;
