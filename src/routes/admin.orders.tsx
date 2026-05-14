import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Download, Eye, X } from "lucide-react";
import { adminOrders, type AdminOrder } from "@/data/admin";
import { StatusPill } from "./admin.index";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(adminOrders);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [active, setActive] = useState<AdminOrder | null>(null);

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          (status === "all" || o.status === status) &&
          (o.id.toLowerCase().includes(q.toLowerCase()) ||
            o.customer.toLowerCase().includes(q.toLowerCase()) ||
            o.email.toLowerCase().includes(q.toLowerCase())),
      ),
    [orders, q, status],
  );

  const updateStatus = (id: string, s: AdminOrder["status"]) => {
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, status: s } : o)));
    setActive((a) => (a && a.id === id ? { ...a, status: s } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-eyebrow">Operations</p>
          <h1 className="text-display text-4xl mt-1">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} of {orders.length} orders</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm hover:bg-midnight/60">
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-2 border border-border bg-midnight/40 flex-1 min-w-64">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by order ID, name, email…"
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border border-border bg-midnight/40">
          <Filter className="size-4 text-muted-foreground" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-transparent outline-none text-sm"
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="border border-border bg-midnight/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left font-normal px-5 py-3">Order</th>
              <th className="text-left font-normal py-3">Customer</th>
              <th className="text-left font-normal py-3">Date</th>
              <th className="text-left font-normal py-3">Items</th>
              <th className="text-left font-normal py-3">Status</th>
              <th className="text-right font-normal py-3">Total</th>
              <th className="text-right font-normal px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-border/40 hover:bg-midnight/60">
                <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                <td className="py-3">
                  <div>{o.customer}</div>
                  <div className="text-xs text-muted-foreground">{o.email}</div>
                </td>
                <td className="py-3 text-muted-foreground">{o.date}</td>
                <td className="py-3">{o.items}</td>
                <td className="py-3"><StatusPill status={o.status} /></td>
                <td className="py-3 text-right">${o.total}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => setActive(o)}
                    className="inline-flex items-center gap-1 text-xs text-gold hover:underline"
                  >
                    <Eye className="size-3" /> View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                  No orders match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-end sm:items-center justify-center p-4" onClick={() => setActive(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-midnight border border-border w-full max-w-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-eyebrow">Order</p>
                <h2 className="text-display text-2xl font-mono">{active.id}</h2>
              </div>
              <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Customer" value={active.customer} />
              <Field label="Email" value={active.email} />
              <Field label="Date" value={active.date} />
              <Field label="Items" value={String(active.items)} />
              <Field label="Total" value={`$${active.total}`} />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                <StatusPill status={active.status} />
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Update status</p>
              <div className="flex flex-wrap gap-2">
                {(["paid", "pending", "shipped", "refunded", "cancelled"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(active.id, s)}
                    className={`px-3 py-1.5 text-xs border ${
                      active.status === s ? "border-gold text-gold" : "border-border hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p>{value}</p>
    </div>
  );
}
