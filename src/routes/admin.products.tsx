import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { adminProducts, type AdminProduct } from "@/data/admin";
import { StatusPill } from "./admin.index";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

const empty: AdminProduct = {
  id: "", name: "", category: "Core", price: 0, stock: 0, status: "draft", sales30d: 0,
};

function ProductsAdmin() {
  const [items, setItems] = useState<AdminProduct[]>(adminProducts);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null>(null);

  const filtered = useMemo(
    () => items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  );

  const save = (p: AdminProduct) => {
    if (!p.name.trim()) return;
    setItems((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      if (exists) return prev.map((x) => (x.id === p.id ? p : x));
      return [...prev, { ...p, id: `p_${Math.random().toString(36).slice(2, 8)}` }];
    });
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this product?")) return;
    setItems((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-eyebrow">Catalog</p>
          <h1 className="text-display text-4xl mt-1">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} SKUs</p>
        </div>
        <button
          onClick={() => setEditing(empty)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-obsidian text-sm font-medium hover:bg-gold/90"
        >
          <Plus className="size-4" /> New product
        </button>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 border border-border bg-midnight/40 max-w-md">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SKU or category" className="bg-transparent outline-none flex-1 text-sm" />
      </div>

      <div className="border border-border bg-midnight/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left font-normal px-5 py-3">Product</th>
              <th className="text-left font-normal py-3">Category</th>
              <th className="text-left font-normal py-3">Price</th>
              <th className="text-left font-normal py-3">Stock</th>
              <th className="text-left font-normal py-3">Sales 30d</th>
              <th className="text-left font-normal py-3">Status</th>
              <th className="text-right font-normal px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border/40 hover:bg-midnight/60">
                <td className="px-5 py-3">
                  <div>{p.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{p.id}</div>
                </td>
                <td className="py-3">{p.category}</td>
                <td className="py-3">${p.price}</td>
                <td className="py-3">
                  <span className={p.stock === 0 ? "text-rose-400" : p.stock < 20 ? "text-amber-400" : ""}>
                    {p.stock}
                  </span>
                </td>
                <td className="py-3">{p.sales30d}</td>
                <td className="py-3"><StatusPill status={p.status} /></td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => setEditing(p)} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border" title="Edit">
                      <Pencil className="size-3.5 text-gold" />
                    </button>
                    <button onClick={() => remove(p.id)} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border" title="Delete">
                      <Trash2 className="size-3.5 text-rose-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <ProductDrawer initial={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function ProductDrawer({ initial, onClose, onSave }: { initial: AdminProduct; onClose: () => void; onSave: (p: AdminProduct) => void }) {
  const [p, setP] = useState<AdminProduct>(initial);
  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => setP((s) => ({ ...s, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-midnight border border-border w-full max-w-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-eyebrow">{initial.id ? "Edit" : "New"}</p>
            <h2 className="text-display text-2xl">{initial.id ? "Edit product" : "New product"}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Name" value={p.name} onChange={(v) => set("name", v)} className="col-span-2" />
          <div>
            <Label>Category</Label>
            <select value={p.category} onChange={(e) => set("category", e.target.value)} className="w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none">
              {["Core", "Bio", "Gummies", "Beverages", "Powders", "Luxury", "Diagnostic"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select value={p.status} onChange={(e) => set("status", e.target.value as AdminProduct["status"])} className="w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none">
              <option value="live">Live</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <Input label="Price (USD)" type="number" value={String(p.price)} onChange={(v) => set("price", Number(v))} />
          <Input label="Stock" type="number" value={String(p.stock)} onChange={(v) => set("stock", Number(v))} />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border hover:bg-midnight">Cancel</button>
          <button onClick={() => onSave(p)} className="px-4 py-2 text-sm bg-gold text-obsidian font-medium hover:bg-gold/90">Save</button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{children}</p>;
}
function Input({ label, value, onChange, type = "text", className = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none focus:border-gold" />
    </div>
  );
}
