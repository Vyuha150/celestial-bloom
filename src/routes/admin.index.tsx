import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, DollarSign, ShoppingBag, Users, Package, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { adminOrders, revenueSeries, categoryMix, trafficSources } from "@/data/admin";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const kpis = [
  { label: "Revenue (30d)", value: "$57,140", delta: "+18.2%", icon: DollarSign },
  { label: "Orders (30d)", value: "300", delta: "+12.4%", icon: ShoppingBag },
  { label: "New Customers", value: "84", delta: "+22.7%", icon: Users },
  { label: "Avg. Order Value", value: "$190.46", delta: "+5.1%", icon: TrendingUp },
];

function Dashboard() {
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
          return (
            <div key={k.label} className="border border-border bg-midnight/40 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</span>
                <Icon className="size-4 text-gold" />
              </div>
              <p className="text-display text-3xl mt-3">{k.value}</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="size-3" /> {k.delta} vs prev
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
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
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
                  contentStyle={{
                    background: "oklch(0.18 0.03 270)",
                    border: "1px solid oklch(0.28 0.02 270)",
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.72 0.12 75)" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-border bg-midnight/40 p-5">
          <h3 className="text-display text-xl mb-4">Category mix</h3>
          <div className="space-y-3">
            {categoryMix.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground/90">{c.name}</span>
                  <span className="text-muted-foreground">{c.value}%</span>
                </div>
                <div className="h-1.5 bg-midnight border border-border overflow-hidden">
                  <div
                    className="h-full"
                    style={{ width: `${c.value}%`, background: "var(--gradient-gold)" }}
                  />
                </div>
              </div>
            ))}
          </div>
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
              {adminOrders.slice(0, 6).map((o) => (
                <tr key={o.id} className="border-b border-border/40 hover:bg-midnight/60">
                  <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                  <td className="py-3">{o.customer}</td>
                  <td className="py-3"><StatusPill status={o.status} /></td>
                  <td className="px-5 py-3 text-right">${o.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-border bg-midnight/40 p-5">
          <h3 className="text-display text-xl mb-4">Traffic sources</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficSources}>
                <CartesianGrid stroke="oklch(0.28 0.02 270)" strokeDasharray="3 3" />
                <XAxis dataKey="src" stroke="oklch(0.65 0.02 80)" fontSize={11} />
                <YAxis stroke="oklch(0.65 0.02 80)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.03 270)",
                    border: "1px solid oklch(0.28 0.02 270)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" fill="oklch(0.72 0.12 75)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    shipped: "bg-blue-500/15 text-blue-300 border-blue-500/30",
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
