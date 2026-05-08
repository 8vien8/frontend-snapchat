import Logout from "@/components/forms/Logout";
import { useAuthStore } from "@/stores/use-auth.store";

const ChatApp = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      {user?.displayName}
      <Logout />
    </div>
  );
};
export default ChatApp;
