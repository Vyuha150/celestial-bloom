import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Eye, X, Trash2 } from "lucide-react";
import { adminCustomers, adminOrders, type AdminCustomer } from "@/data/admin";
import { StatusPill } from "./admin.index";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersAdmin,
});

function CustomersAdmin() {
  const [list, setList] = useState<AdminCustomer[]>(adminCustomers);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<AdminCustomer | null>(null);

  const filtered = useMemo(
    () => list.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase())),
    [list, q],
  );

  const remove = (id: string) => {
    if (!confirm("Delete this customer?")) return;
    setList((p) => p.filter((c) => c.id !== id));
  };

  const customerOrders = (email: string) => adminOrders.filter((o) => o.email === email);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-eyebrow">CRM</p>
        <h1 className="text-display text-4xl mt-1">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">{list.length} accounts</p>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 border border-border bg-midnight/40 max-w-md">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className="bg-transparent outline-none flex-1 text-sm" />
      </div>

      <div className="border border-border bg-midnight/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left font-normal px-5 py-3">Customer</th>
              <th className="text-left font-normal py-3">Tier</th>
              <th className="text-left font-normal py-3">Orders</th>
              <th className="text-left font-normal py-3">Lifetime value</th>
              <th className="text-left font-normal py-3">Joined</th>
              <th className="text-right font-normal px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border/40 hover:bg-midnight/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-gold to-champagne text-obsidian text-xs flex items-center justify-center font-medium">
                      {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div>{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3"><StatusPill status={c.tier} /></td>
                <td className="py-3">{c.orders}</td>
                <td className="py-3">${c.lifetime.toLocaleString()}</td>
                <td className="py-3 text-muted-foreground">{c.joined}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => setActive(c)} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border"><Eye className="size-3.5 text-gold" /></button>
                    <button onClick={() => remove(c.id)} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border"><Trash2 className="size-3.5 text-rose-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-midnight border border-border w-full max-w-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full bg-gradient-to-br from-gold to-champagne text-obsidian text-lg flex items-center justify-center font-medium">
                  {active.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h2 className="text-display text-2xl">{active.name}</h2>
                  <p className="text-sm text-muted-foreground">{active.email}</p>
                </div>
              </div>
              <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Tier" value={active.tier} />
              <Stat label="Orders" value={String(active.orders)} />
              <Stat label="Lifetime value" value={`$${active.lifetime.toLocaleString()}`} />
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Order history</p>
              <div className="border border-border">
                {customerOrders(active.email).length === 0 ? (
                  <p className="px-4 py-6 text-sm text-muted-foreground text-center">No recent orders.</p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {customerOrders(active.email).map((o) => (
                        <tr key={o.id} className="border-b border-border/40 last:border-b-0">
                          <td className="px-4 py-2 font-mono text-xs">{o.id}</td>
                          <td className="py-2 text-muted-foreground">{o.date}</td>
                          <td className="py-2"><StatusPill status={o.status} /></td>
                          <td className="px-4 py-2 text-right">${o.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-obsidian p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-display text-2xl mt-1">{value}</p>
    </div>
  );
}
