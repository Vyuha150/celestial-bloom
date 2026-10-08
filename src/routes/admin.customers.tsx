import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Eye, X, Trash2, ShieldCheck } from "lucide-react";
import { listCustomers, getCustomer, deleteCustomer, updateCustomer, type AdminCustomer } from "@/admin/api";
import { getStoredUser } from "@/admin/auth";
import { StatusPill } from "./admin.index";
import { formatMoney } from "@/lib/money";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersAdmin,
});

function CustomersAdmin() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "customers", q],
    queryFn: () => listCustomers({ search: q || undefined, limit: 100 }),
  });

  const { data: activeDetail } = useQuery({
    queryKey: ["admin", "customer", activeId],
    queryFn: () => getCustomer(activeId!),
    enabled: !!activeId,
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "customers"] }),
  });

  const remove = (id: string) => {
    if (!confirm("Delete this account?")) return;
    deleteMut.mutate(id);
  };

  const roleMut = useMutation({
    mutationFn: ({ id, role }: { id: string; role: AdminCustomer["role"] }) => updateCustomer(id, { role }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "customer"] });
    },
  });

  const myId = getStoredUser()?.id;
  const changeRole = (c: Pick<AdminCustomer, "_id" | "name" | "role">) => {
    const makeAdmin = c.role !== "admin";
    const question = makeAdmin
      ? `Make ${c.name} an admin? They will be able to see every order and customer, change products and prices, and manage other accounts.`
      : `Remove admin access from ${c.name}? They will keep their account as a regular customer.`;
    if (!confirm(question)) return;
    roleMut.mutate({ id: c._id, role: makeAdmin ? "admin" : "customer" });
  };
  const roleError = roleMut.error ?? deleteMut.error;

  const customers = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-eyebrow">CRM</p>
        <h1 className="text-display text-4xl mt-1">Customers &amp; accounts</h1>
        <p className="text-sm text-muted-foreground mt-1">{data?.pagination.total ?? 0} accounts</p>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 border border-border bg-midnight/40 max-w-md">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className="bg-transparent outline-none flex-1 text-sm" />
      </div>

      {error && <p className="text-sm text-rose-400">Failed to load customers.</p>}
      {roleError instanceof Error && <p role="alert" className="text-sm text-rose-400">{roleError.message}</p>}

      <div className="border border-border bg-midnight/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left font-normal px-5 py-3">Customer</th>
              <th className="text-left font-normal py-3">Role</th>
              <th className="text-left font-normal py-3">Tier</th>
              <th className="text-left font-normal py-3">Orders</th>
              <th className="text-left font-normal py-3">Lifetime value</th>
              <th className="text-left font-normal py-3">Joined</th>
              <th className="text-right font-normal px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">Loading…</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">No accounts yet.</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="border-b border-border/40 hover:bg-midnight/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-gradient-to-br from-gold to-champagne text-obsidian text-xs flex items-center justify-center font-medium">
                        {initials(c.name)}
                      </div>
                      <div>
                        <div>{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><RoleBadge role={c.role} isYou={c._id === myId} /></td>
                  <td className="py-3"><StatusPill status={c.tier} /></td>
                  <td className="py-3">{c.orders}</td>
                  <td className="py-3">{formatMoney(c.lifetime)}</td>
                  <td className="py-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button onClick={() => setActiveId(c._id)} title="View" aria-label={`View ${c.name}`} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border"><Eye className="size-3.5 text-gold" /></button>
                      <button
                        onClick={() => changeRole(c)}
                        disabled={c._id === myId || roleMut.isPending}
                        title={c._id === myId ? "You can't change your own role" : c.role === "admin" ? "Remove admin access" : "Make admin"}
                        aria-label={c.role === "admin" ? `Remove admin access from ${c.name}` : `Make ${c.name} an admin`}
                        className="p-1.5 hover:bg-midnight border border-transparent hover:border-border disabled:opacity-30"
                      >
                        <ShieldCheck className={`size-3.5 ${c.role === "admin" ? "text-gold" : "text-muted-foreground"}`} />
                      </button>
                      <button onClick={() => remove(c._id)} disabled={c._id === myId} title="Delete" aria-label={`Delete ${c.name}`} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border disabled:opacity-30"><Trash2 className="size-3.5 text-rose-400" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {activeId && activeDetail && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-center justify-center p-4" onClick={() => setActiveId(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-midnight border border-border w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full bg-gradient-to-br from-gold to-champagne text-obsidian text-lg flex items-center justify-center font-medium">
                  {initials(activeDetail.customer.name)}
                </div>
                <div>
                  <h2 className="text-display text-2xl">{activeDetail.customer.name}</h2>
                  <p className="text-sm text-muted-foreground">{activeDetail.customer.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <RoleBadge role={activeDetail.customer.role} isYou={activeDetail.customer._id === myId} />
                    {activeDetail.customer._id !== myId && (
                      <button
                        onClick={() => changeRole(activeDetail.customer)}
                        disabled={roleMut.isPending}
                        className="text-xs text-gold underline-offset-4 hover:underline disabled:opacity-50"
                      >
                        {activeDetail.customer.role === "admin" ? "Remove admin access" : "Make admin"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveId(null)} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Tier" value={activeDetail.customer.tier} />
              <Stat label="Orders" value={String(activeDetail.customer.orders)} />
              <Stat label="Lifetime value" value={formatMoney(activeDetail.customer.lifetime)} />
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Currently in their bag
                {activeDetail.cart && (
                  <span className="ml-2 normal-case tracking-normal">
                    · last changed {new Date(activeDetail.cart.updatedAt).toLocaleString()}
                  </span>
                )}
              </p>
              <div className="border border-border">
                {!activeDetail.cart ? (
                  <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nothing in their bag right now.</p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {activeDetail.cart.items.map((it) => (
                        <tr key={it.product} className="border-b border-border/40 last:border-b-0">
                          <td className="px-4 py-2">
                            {it.categoryTitle ? `${it.categoryTitle} — ${it.name}` : it.name}
                          </td>
                          <td className="py-2 text-muted-foreground">× {it.qty}</td>
                          <td className="px-4 py-2 text-right">{formatMoney(it.lineTotal)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="px-4 py-2 text-muted-foreground" colSpan={2}>Bag value</td>
                        <td className="px-4 py-2 text-right text-gold">{formatMoney(activeDetail.cart.subtotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Order history</p>
              <div className="border border-border">
                {activeDetail.orders.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-muted-foreground text-center">No recent orders.</p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {activeDetail.orders.map((o) => (
                        <tr key={o._id} className="border-b border-border/40 last:border-b-0">
                          <td className="px-4 py-2 font-mono text-xs">{o.orderNumber}</td>
                          <td className="py-2 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="py-2"><StatusPill status={o.status} /></td>
                          <td className="px-4 py-2 text-right">{formatMoney(o.total)}</td>
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

function RoleBadge({ role, isYou }: { role: AdminCustomer["role"]; isYou: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider border ${
        role === "admin" ? "border-gold/50 text-gold" : "border-border text-muted-foreground"
      }`}
    >
      {role === "admin" ? "Admin" : "Customer"}
      {isYou && <span className="normal-case tracking-normal text-muted-foreground">(you)</span>}
    </span>
  );
}

function initials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-obsidian p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-display text-2xl mt-1">{value}</p>
    </div>
  );
}
