import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings, Search, LogOut, Store, Inbox } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { isAuthenticated, getStoredUser, logout } from "@/admin/auth";
import { rememberReturnPath } from "@/shop/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Aurelia Console" },
      { name: "description", content: "Operations, analytics and CRUD for the Aurelia storefront." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/messages", label: "Messages", icon: Inbox },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const isLoginPage = path === "/admin/login";

  // Client-only guard: the access token lives in localStorage, which
  // doesn't exist during SSR, so this intentionally runs after hydration
  // rather than in a route `beforeLoad` (which would otherwise see every
  // server-rendered pass as "logged out" and redirect real sessions too).
  useEffect(() => {
    if (isLoginPage) return;
    if (!isAuthenticated()) {
      // Not an admin (or not signed in): send them to the one sign-in page,
      // and bring an admin back here afterwards.
      rememberReturnPath(path);
      void navigate({ to: "/account" });
      return;
    }
    setAuthChecked(true);
  }, [isLoginPage, path, navigate]);

  if (isLoginPage) return <Outlet />;
  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-midnight/40 sticky top-0 h-screen">
          <div className="px-5 py-5 border-b border-border">
            <Link to="/" className="block">
              <p className="text-eyebrow">Aurelia</p>
              <p className="text-display text-2xl mt-1">Console</p>
            </Link>
          </div>
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {nav.map((n) => {
              const active = n.exact ? path === n.to : path.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-gold/10 text-gold border-l-2 border-gold"
                      : "text-muted-foreground hover:text-foreground hover:bg-midnight/60"
                  }`}
                >
                  <Icon className="size-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border text-xs text-muted-foreground">
            v1.0 · staging
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-eyebrow">Console</span>
                <span>·</span>
                <span className="text-foreground/80">{path}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-border bg-midnight/40 text-xs text-muted-foreground">
                  <Search className="size-3.5" />
                  <input
                    placeholder="Search orders, customers, SKUs…"
                    className="bg-transparent outline-none w-64 placeholder:text-muted-foreground/70 text-foreground"
                  />
                </div>
                <button
                  onClick={() => void logout().then(() => navigate({ to: "/account" }))}
                  title="Sign out"
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-midnight/60 border border-transparent hover:border-border"
                >
                  <LogOut className="size-4" />
                </button>
                <ProfileMenu onSignOut={() => void logout().then(() => navigate({ to: "/account" }))} />
              </div>
            </div>
          </header>
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileMenu({ onSignOut }: { onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const user = getStoredUser();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="size-8 rounded-full bg-gradient-to-br from-gold to-champagne text-obsidian text-xs flex items-center justify-center font-medium hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        {initials(user?.name)}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-60 border border-border bg-background shadow-xl z-20">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm text-foreground truncate">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <p className="text-eyebrow mt-2">Administrator</p>
          </div>
          <Link
            to="/admin/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-midnight/60"
          >
            <Settings className="size-4" /> Settings
          </Link>
          <Link
            to="/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-midnight/60"
          >
            <Store className="size-4" /> View storefront
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={onSignOut}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-midnight/60 border-t border-border"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function initials(name?: string): string {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "A";
}
