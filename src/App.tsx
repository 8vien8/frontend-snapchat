import AppRouter from "@/routes/main.routes";
import { useAuthStore } from "@/stores/use-auth.store";
import { useEffect } from "react";
import { Toaster } from "sonner";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <Toaster richColors />
      <AppRouter />
    </>
  );
}

export default App;
