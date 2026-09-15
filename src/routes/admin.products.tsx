import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Upload } from "lucide-react";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  uploadProductImages,
  type AdminProduct,
  type ProductInput,
} from "@/admin/api";
import { API_URL } from "@/lib/apiClient";
import { StatusPill } from "./admin.index";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

// Defaults to "live" — a newly added product should be sellable
// immediately; "draft" as a default meant every new product silently
// failed to appear in the storefront until someone remembered to flip it.
const emptyForm: ProductInput = {
  category: "",
  name: "",
  price: 0,
  stock: 0,
  status: "live",
  cadence: "/ one-time",
  cta: "Order now",
  perks: [],
};

function categoryTitle(p: AdminProduct): string {
  return typeof p.category === "string" ? p.category : p.category.title;
}

function ProductsAdmin() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<{ id: string | null; form: ProductInput; images: string[] } | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "products", q],
    queryFn: () => listProducts({ search: q || undefined, limit: 100 }),
  });
  const { data: categories } = useQuery({ queryKey: ["admin", "categories"], queryFn: listCategories });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] });

  const createMut = useMutation({
    mutationFn: (body: ProductInput) => createProduct(body),
    onSuccess: (created) => {
      invalidate();
      // Stay open in edit mode (rather than closing) so images can be
      // uploaded right away — the upload endpoint needs a product id,
      // which doesn't exist until this first save completes.
      setEditing({ id: created._id, form: editing?.form ?? emptyForm, images: created.images ?? [] });
    },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<ProductInput> }) => updateProduct(id, body),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: invalidate,
  });
  const uploadMut = useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) => uploadProductImages(id, files),
    onSuccess: (updated) => {
      invalidate();
      setEditing((cur) => (cur ? { ...cur, images: updated.images } : cur));
    },
  });
  const removeImageMut = useMutation({
    mutationFn: ({ id, images }: { id: string; images: string[] }) => updateProduct(id, { images }),
    onSuccess: (updated) => {
      invalidate();
      setEditing((cur) => (cur ? { ...cur, images: updated.images } : cur));
    },
  });

  const items = useMemo(() => data?.items ?? [], [data]);

  const openNew = () => setEditing({ id: null, form: { ...emptyForm, category: categories?.[0]?._id ?? "" }, images: [] });
  const openEdit = (p: AdminProduct) =>
    setEditing({
      id: p._id,
      images: p.images,
      form: {
        category: typeof p.category === "string" ? p.category : p.category._id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        status: p.status,
        cadence: p.cadence,
        cta: p.cta,
        perks: p.perks,
      },
    });

  const save = (form: ProductInput) => {
    if (!form.name.trim() || !form.category) return;
    if (editing?.id) updateMut.mutate({ id: editing.id, body: form });
    else createMut.mutate(form);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this product?")) return;
    deleteMut.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-eyebrow">Catalog</p>
          <h1 className="text-display text-4xl mt-1">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{data?.pagination.total ?? 0} SKUs</p>
        </div>
        <button
          onClick={openNew}
          disabled={!categories?.length}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-obsidian text-sm font-medium hover:bg-gold/90 disabled:opacity-50"
        >
          <Plus className="size-4" /> New product
        </button>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 border border-border bg-midnight/40 max-w-md">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product name" className="bg-transparent outline-none flex-1 text-sm" />
      </div>

      {error && <p className="text-sm text-rose-400">Failed to load products.</p>}

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
            {isLoading ? (
              <tr><td colSpan={7} className="px-5 py-6 text-center text-muted-foreground">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-6 text-center text-muted-foreground">No products found.</td></tr>
            ) : (
              items.map((p) => (
                <tr key={p._id} className="border-b border-border/40 hover:bg-midnight/60">
                  <td className="px-5 py-3">
                    <div>{p.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{p.sku}</div>
                  </td>
                  <td className="py-3">{categoryTitle(p)}</td>
                  <td className="py-3">${p.price}</td>
                  <td className="py-3">
                    <span className={p.stock === 0 ? "text-rose-400" : p.stock < 20 ? "text-amber-400" : ""}>{p.stock}</span>
                  </td>
                  <td className="py-3">{p.sales30d}</td>
                  <td className="py-3"><StatusPill status={p.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border" title="Edit">
                        <Pencil className="size-3.5 text-gold" />
                      </button>
                      <button onClick={() => remove(p._id)} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border" title="Delete">
                        <Trash2 className="size-3.5 text-rose-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductDrawer
          isNew={!editing.id}
          initial={editing.form}
          categories={categories ?? []}
          saving={createMut.isPending || updateMut.isPending}
          error={createMut.error ?? updateMut.error}
          onClose={() => setEditing(null)}
          onSave={save}
          productId={editing.id}
          images={editing.images}
          onUpload={(files) => editing.id && uploadMut.mutate({ id: editing.id, files })}
          onRemoveImage={(img) =>
            editing.id && removeImageMut.mutate({ id: editing.id, images: editing.images.filter((i) => i !== img) })
          }
          uploading={uploadMut.isPending}
        />
      )}
    </div>
  );
}

function ProductDrawer({
  isNew,
  initial,
  categories,
  saving,
  error,
  onClose,
  onSave,
  productId,
  images,
  onUpload,
  onRemoveImage,
  uploading,
}: {
  isNew: boolean;
  initial: ProductInput;
  categories: { _id: string; slug: string; title: string }[];
  saving: boolean;
  error: unknown;
  onClose: () => void;
  onSave: (p: ProductInput) => void;
  productId: string | null;
  images: string[];
  onUpload: (files: File[]) => void;
  onRemoveImage: (image: string) => void;
  uploading: boolean;
}) {
  const [p, setP] = useState<ProductInput>(initial);
  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setP((s) => ({ ...s, [k]: v }));
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-midnight border border-border w-full max-w-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-eyebrow">{isNew ? "New" : "Edit"}</p>
            <h2 className="text-display text-2xl">{isNew ? "New product" : "Edit product"}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>

        {error instanceof Error && <p className="text-xs text-rose-300">{error.message}</p>}

        <div className="grid grid-cols-2 gap-3">
          <Input label="Name" value={p.name} onChange={(v) => set("name", v)} className="col-span-2" />
          <div>
            <Label>Category</Label>
            <select
              value={p.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={p.status}
              onChange={(e) => set("status", e.target.value as ProductInput["status"])}
              className="w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none"
            >
              <option value="live">Live</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <Input label="Price (USD)" type="number" value={String(p.price)} onChange={(v) => set("price", Number(v))} />
          <Input label="Stock" type="number" value={String(p.stock ?? 0)} onChange={(v) => set("stock", Number(v))} />
          <Input label="Cadence" value={p.cadence ?? ""} onChange={(v) => set("cadence", v)} />
        </div>

        <div className="border-t border-border pt-4">
          <Label>Images</Label>
          {!productId ? (
            <p className="text-xs text-muted-foreground mt-1">Save the product first to add images.</p>
          ) : (
            <>
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2 mb-3">
                  {images.map((img) => (
                    <div key={img} className="relative group">
                      <img src={`${API_URL}${img}`} alt="" className="w-full aspect-square object-cover border border-border" />
                      <button
                        onClick={() => onRemoveImage(img)}
                        title="Remove image"
                        className="absolute top-1 right-1 p-0.5 bg-obsidian/80 border border-border opacity-0 group-hover:opacity-100 hover:border-rose-400"
                      >
                        <X className="size-3 text-rose-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length) onUpload(files);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs border border-border hover:border-gold disabled:opacity-50"
              >
                <Upload className="size-3.5" /> {uploading ? "Uploading…" : "Upload images"}
              </button>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border hover:bg-midnight">Cancel</button>
          <button
            onClick={() => onSave(p)}
            disabled={saving}
            className="px-4 py-2 text-sm bg-gold text-obsidian font-medium hover:bg-gold/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
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
