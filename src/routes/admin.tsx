import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, FileText, Settings, Search } from "lucide-react";

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
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/pages", label: "Pages / CMS", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
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
                <div className="size-8 rounded-full bg-gradient-to-br from-gold to-champagne text-obsidian text-xs flex items-center justify-center font-medium">
                  EV
                </div>
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
