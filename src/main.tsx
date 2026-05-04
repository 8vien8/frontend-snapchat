import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster richColors />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
