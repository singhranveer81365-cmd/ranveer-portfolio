import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App.tsx";
import AdminPanel from "./components/AdminPanel.tsx";
import "./index.css";

function AppRouter() {
  const { pathname } = useLocation();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <AdminPanel />;
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </StrictMode>,
);
