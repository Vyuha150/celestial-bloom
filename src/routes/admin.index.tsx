import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { getDashboard } from "@/admin/api";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "dashboard"], queryFn: getDashboard });

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading dashboard…</div>;
  if (error || !data) return <div className="text-sm text-rose-400">Failed to load dashboard data.</div>;

  const kpis = [
    { label: "Revenue (30d)", value: `$${data.kpis.revenue.value.toLocaleString()}`, delta: data.kpis.revenue.changePct, icon: DollarSign },
    { label: "Orders (30d)", value: data.kpis.orders.value.toLocaleString(), delta: data.kpis.orders.changePct, icon: ShoppingBag },
    { label: "New Customers", value: data.kpis.newCustomers.value.toLocaleString(), delta: data.kpis.newCustomers.changePct, icon: Users },
    { label: "Avg. Order Value", value: `$${data.kpis.aov.value.toFixed(2)}`, delta: data.kpis.aov.changePct, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-eyebrow">Overview</p>
        <h1 className="text-display text-4xl mt-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Last 30 days · all channels</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          const up = k.delta >= 0;
          return (
            <div key={k.label} className="border border-border bg-midnight/40 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</span>
                <Icon className="size-4 text-gold" />
              </div>
              <p className="text-display text-3xl mt-3">{k.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${up ? "text-emerald-400" : "text-rose-400"}`}>
                {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {Math.abs(k.delta)}% vs prev
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border border-border bg-midnight/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-display text-xl">Revenue trend</h3>
            <span className="text-xs text-muted-foreground">Weekly · USD</span>
          </div>
          <div className="h-72">
            {data.revenueTrend.length === 0 ? (
              <EmptyState label="No orders yet in this window" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueTrend}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.12 75)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.72 0.12 75)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.28 0.02 270)" strokeDasharray="3 3" />
                  <XAxis dataKey="d" stroke="oklch(0.65 0.02 80)" fontSize={11} />
                  <YAxis stroke="oklch(0.65 0.02 80)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: "oklch(0.18 0.03 270)", border: "1px solid oklch(0.28 0.02 270)", fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.72 0.12 75)" fill="url(#rev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="border border-border bg-midnight/40 p-5">
          <h3 className="text-display text-xl mb-4">Category mix</h3>
          {data.categoryMix.length === 0 ? (
            <EmptyState label="No sales yet" />
          ) : (
            <div className="space-y-3">
              {data.categoryMix.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground/90">{c.name}</span>
                    <span className="text-muted-foreground">{c.value}%</span>
                  </div>
                  <div className="h-1.5 bg-midnight border border-border overflow-hidden">
                    <div className="h-full" style={{ width: `${c.value}%`, background: "var(--gradient-gold)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border border-border bg-midnight/40">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="text-display text-xl">Recent orders</h3>
            <Link to="/admin/orders" className="text-xs text-gold hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="size-3" />
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <div className="p-5"><EmptyState label="No orders yet" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left font-normal px-5 py-3">Order</th>
                  <th className="text-left font-normal py-3">Customer</th>
                  <th className="text-left font-normal py-3">Status</th>
                  <th className="text-right font-normal px-5 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o._id} className="border-b border-border/40 hover:bg-midnight/60">
                    <td className="px-5 py-3 font-mono text-xs">{o.orderNumber}</td>
                    <td className="py-3">{o.customerName}</td>
                    <td className="py-3"><StatusPill status={o.status} /></td>
                    <td className="px-5 py-3 text-right">${o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="border border-border bg-midnight/40 p-5">
          <h3 className="text-display text-xl mb-4">Traffic sources</h3>
          <div className="h-56">
            {data.trafficSources.length === 0 ? (
              <EmptyState label="No traffic recorded yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.trafficSources}>
                  <CartesianGrid stroke="oklch(0.28 0.02 270)" strokeDasharray="3 3" />
                  <XAxis dataKey="src" stroke="oklch(0.65 0.02 80)" fontSize={11} />
                  <YAxis stroke="oklch(0.65 0.02 80)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: "oklch(0.18 0.03 270)", border: "1px solid oklch(0.28 0.02 270)", fontSize: 12 }}
                  />
                  <Bar dataKey="v" fill="oklch(0.72 0.12 75)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="h-full flex items-center justify-center text-xs text-muted-foreground">{label}</div>;
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    shipped: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    delivered: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    refunded: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    cancelled: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
    live: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    draft: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    archived: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
    published: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    Founder: "bg-gold/15 text-gold border-gold/30",
    Member: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    Trial: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider border ${map[status] ?? "border-border"}`}>
      {status}
    </span>
  );
}
