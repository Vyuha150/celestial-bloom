import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [store, setStore] = useState({
    name: "Aurelia",
    currency: "USD",
    email: "ops@aurelia.co",
    timezone: "Europe/Zurich",
  });
  const [flags, setFlags] = useState({
    maintenance: false,
    abandonedCart: true,
    referrals: true,
    transactionalEmails: true,
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-eyebrow">Configuration</p>
        <h1 className="text-display text-4xl mt-1">Settings</h1>
      </div>

      <section className="border border-border bg-midnight/40 p-5 space-y-4">
        <h2 className="text-display text-xl">Store</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Store name" value={store.name} onChange={(v) => setStore({ ...store, name: v })} />
          <Input label="Currency" value={store.currency} onChange={(v) => setStore({ ...store, currency: v })} />
          <Input label="Operations email" value={store.email} onChange={(v) => setStore({ ...store, email: v })} />
          <Input label="Timezone" value={store.timezone} onChange={(v) => setStore({ ...store, timezone: v })} />
        </div>
      </section>

      <section className="border border-border bg-midnight/40 p-5 space-y-3">
        <h2 className="text-display text-xl">Feature flags</h2>
        {Object.entries(flags).map(([k, v]) => (
          <label key={k} className="flex items-center justify-between py-2 border-b border-border/40 last:border-b-0">
            <div>
              <p className="text-sm capitalize">{k.replace(/([A-Z])/g, " $1")}</p>
            </div>
            <button
              onClick={() => setFlags({ ...flags, [k]: !v })}
              className={`relative w-11 h-6 transition-colors ${v ? "bg-gold" : "bg-border"}`}
            >
              <span className={`absolute top-0.5 size-5 bg-obsidian transition-transform ${v ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </label>
        ))}
      </section>

      <div className="flex justify-end">
        <button className="px-5 py-2 bg-gold text-obsidian text-sm font-medium hover:bg-gold/90">Save changes</button>
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
