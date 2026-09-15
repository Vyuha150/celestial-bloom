import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getSettings, updateSettings, type StoreSettings } from "@/admin/api";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

const FEATURE_LABELS: Record<keyof StoreSettings["features"], string> = {
  maintenance: "Maintenance mode",
  abandonedCart: "Abandoned cart recovery",
  referrals: "Referral program",
  transactionalEmails: "Transactional emails",
};

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "settings"], queryFn: getSettings });
  const [form, setForm] = useState<StoreSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  const saveMut = useMutation({
    mutationFn: (body: Partial<StoreSettings>) => updateSettings(body),
    onSuccess: (updated) => {
      setForm(updated);
      queryClient.setQueryData(["admin", "settings"], updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (isLoading || !form) return <div className="text-sm text-muted-foreground">Loading settings…</div>;
  if (error) return <div className="text-sm text-rose-400">Failed to load settings.</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-eyebrow">Configuration</p>
        <h1 className="text-display text-4xl mt-1">Settings</h1>
      </div>

      <section className="border border-border bg-midnight/40 p-5 space-y-4">
        <h2 className="text-display text-xl">Store</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Store name" value={form.storeName} onChange={(v) => setForm({ ...form, storeName: v })} />
          <Input label="Currency" value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} />
          <Input label="Support email" value={form.supportEmail} onChange={(v) => setForm({ ...form, supportEmail: v })} />
          <Input label="Timezone" value={form.timezone} onChange={(v) => setForm({ ...form, timezone: v })} />
        </div>
      </section>

      <section className="border border-border bg-midnight/40 p-5 space-y-3">
        <h2 className="text-display text-xl">Feature flags</h2>
        {(Object.keys(form.features) as (keyof StoreSettings["features"])[]).map((k) => {
          const v = form.features[k];
          return (
            <label key={k} className="flex items-center justify-between py-2 border-b border-border/40 last:border-b-0">
              <p className="text-sm">{FEATURE_LABELS[k]}</p>
              <button
                type="button"
                onClick={() => setForm({ ...form, features: { ...form.features, [k]: !v } })}
                className={`relative w-11 h-6 transition-colors ${v ? "bg-gold" : "bg-border"}`}
              >
                <span className={`absolute top-0.5 size-5 bg-obsidian transition-transform ${v ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>
          );
        })}
      </section>

      {saveMut.error instanceof Error && <p className="text-sm text-rose-400">{saveMut.error.message}</p>}

      <div className="flex justify-end items-center gap-3">
        {saved && <span className="text-xs text-emerald-400">Saved</span>}
        <button
          onClick={() => saveMut.mutate(form)}
          disabled={saveMut.isPending}
          className="px-5 py-2 bg-gold text-obsidian text-sm font-medium hover:bg-gold/90 disabled:opacity-60"
        >
          {saveMut.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none focus:border-gold" />
    </div>
  );
}
