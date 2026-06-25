import { useEffect } from "react";
import { Toaster } from "sonner";
import AppRouter from "@/routes/main.routes";

import { useAuthStore } from "@/stores/use-auth.store";
import { useSocketStore } from "@/stores/use-socket-store";
import { useTheme } from "@/components/theme/theme-context";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const { resolvedTheme, setTheme } = useTheme();
  const { accessToken } = useAuthStore();
  const { connectSocket, disConnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(resolvedTheme);
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disConnectSocket();
  }, [accessToken]);

  return (
    <>
      <Toaster richColors />
      <AppRouter />
    </>
  );
}

export default App;
