import AppRouter from "@/routes/main.routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <AppRouter />
    </>
  );
}

export default App;
