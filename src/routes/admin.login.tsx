import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isAuthenticated } from "@/admin/auth";
import { rememberReturnPath } from "@/shop/auth";

// The site has a single sign-in page (/account). This old address is kept
// so existing bookmarks still work: it forwards there, and an admin lands
// in the console once signed in.
export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Sign in — Celestial" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLoginRedirect,
});

function AdminLoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      void navigate({ to: "/admin", replace: true });
      return;
    }
    rememberReturnPath("/admin");
    void navigate({ to: "/account", replace: true });
  }, [navigate]);

  return null;
}
