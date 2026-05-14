import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, X } from "lucide-react";
import { adminPages, type AdminPage } from "@/data/admin";
import { StatusPill } from "./admin.index";

export const Route = createFileRoute("/admin/pages")({
  component: PagesAdmin,
});

function PagesAdmin() {
  const [pages, setPages] = useState<AdminPage[]>(adminPages);
  const [editing, setEditing] = useState<AdminPage | null>(null);

  const save = (p: AdminPage) => {
    if (!p.title.trim() || !p.route.trim()) return;
    setPages((prev) => {
      const i = prev.findIndex((x) => x.slug === p.slug);
      if (i >= 0) { const next = [...prev]; next[i] = p; return next; }
      return [...prev, p];
    });
    setEditing(null);
  };

  const remove = (slug: string) => {
    if (!confirm("Delete this page entry?")) return;
    setPages((p) => p.filter((x) => x.slug !== slug));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-eyebrow">Content</p>
          <h1 className="text-display text-4xl mt-1">Pages / CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">Site routes and publishing status.</p>
        </div>
        <button
          onClick={() => setEditing({ slug: "", title: "", route: "/", status: "draft", updated: new Date().toISOString().slice(0, 10) })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-obsidian text-sm font-medium hover:bg-gold/90"
        >
          <Plus className="size-4" /> New page
        </button>
      </div>

      <div className="border border-border bg-midnight/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left font-normal px-5 py-3">Title</th>
              <th className="text-left font-normal py-3">Route</th>
              <th className="text-left font-normal py-3">Status</th>
              <th className="text-left font-normal py-3">Updated</th>
              <th className="text-right font-normal px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.slug} className="border-b border-border/40 hover:bg-midnight/60">
                <td className="px-5 py-3">
                  <div>{p.title}</div>
                  <div className="text-xs text-muted-foreground font-mono">{p.slug}</div>
                </td>
                <td className="py-3 font-mono text-xs">{p.route}</td>
                <td className="py-3"><StatusPill status={p.status} /></td>
                <td className="py-3 text-muted-foreground">{p.updated}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link to={p.route} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border" title="Open">
                      <ExternalLink className="size-3.5 text-champagne" />
                    </Link>
                    <button onClick={() => setEditing(p)} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border" title="Edit">
                      <Pencil className="size-3.5 text-gold" />
                    </button>
                    <button onClick={() => remove(p.slug)} className="p-1.5 hover:bg-midnight border border-transparent hover:border-border" title="Delete">
                      <Trash2 className="size-3.5 text-rose-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-midnight border border-border w-full max-w-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h2 className="text-display text-2xl">{editing.slug ? "Edit page" : "New page"}</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>

            <div className="space-y-3">
              <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
              <Field label="Slug" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <Field label="Route" value={editing.route} onChange={(v) => setEditing({ ...editing, route: v })} />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as AdminPage["status"] })} className="w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm border border-border hover:bg-midnight">Cancel</button>
              <button onClick={() => save({ ...editing, updated: new Date().toISOString().slice(0, 10) })} className="px-4 py-2 text-sm bg-gold text-obsidian font-medium hover:bg-gold/90">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none focus:border-gold" />
    </div>
  );
}
