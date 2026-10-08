import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Mail } from "lucide-react";
import {
  getSettings,
  updateSettings,
  sendTestEmail,
  listSubscribers,
  type StoreSettings,
  type StoreFeatures,
  type SettingsUpdate,
} from "@/admin/api";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

// The editable part of the settings — what "Save changes" sends.
type Form = { storeName: string; supportEmail: string; timezone: string; returnWindowDays: number; features: StoreFeatures };

const TIMEZONES = [
  ["Asia/Kolkata", "India (IST)"],
  ["Asia/Dubai", "Dubai (GST)"],
  ["Asia/Singapore", "Singapore (SGT)"],
  ["Europe/London", "London (GMT/BST)"],
  ["America/New_York", "New York (ET)"],
  ["America/Los_Angeles", "Los Angeles (PT)"],
  ["UTC", "UTC"],
] as const;

function toForm(s: StoreSettings): Form {
  return { storeName: s.storeName, supportEmail: s.supportEmail, timezone: s.timezone, returnWindowDays: s.returnWindowDays, features: { ...s.features } };
}

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "settings"], queryFn: getSettings });
  const [form, setForm] = useState<Form | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data && !form) setForm(toForm(data));
  }, [data, form]);

  const saveMut = useMutation({
    mutationFn: (body: SettingsUpdate) => updateSettings(body),
    onSuccess: (updated) => {
      setForm(toForm(updated));
      queryClient.setQueryData(["admin", "settings"], updated);
      // The storefront reads its own copy of these — refresh it too.
      void queryClient.invalidateQueries({ queryKey: ["store-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  // Blank = send to the store's own mailbox.
  const [testTo, setTestTo] = useState("");
  const testMut = useMutation({ mutationFn: () => sendTestEmail(testTo.trim() || undefined) });

  if (error) return <div className="text-sm text-rose-400">Failed to load settings.</div>;
  if (isLoading || !form || !data) return <div className="text-sm text-muted-foreground">Loading settings…</div>;

  const dirty = JSON.stringify(form) !== JSON.stringify(toForm(data));
  const emailReady = data.email.configured;
  // One mailbox does both jobs unless a separate support address is set.
  const supportHint = data.email.from
    ? `Where customers write for help, and where contact-form messages go. Leave blank to use the store mailbox (${data.email.from}).`
    : "Where customers write for help, and where contact-form messages go. Leave blank to hide.";
  const setFeature = (key: keyof StoreFeatures, on: boolean) => setForm({ ...form, features: { ...form.features, [key]: on } });

  const downloadSubscribers = async () => {
    const subscribers = await listSubscribers();
    const csv = ["email,source,subscribed_at", ...subscribers.map((s) => `${s.email},${s.source},${s.createdAt}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "newsletter-subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <form
      className="space-y-6 max-w-3xl"
      onSubmit={(e) => {
        e.preventDefault();
        saveMut.mutate(form);
      }}
    >
      <div>
        <p className="text-eyebrow">Configuration</p>
        <h1 className="text-display text-4xl mt-1">Settings</h1>
      </div>

      {data.features.maintenance && (
        <div role="status" className="flex items-start gap-3 border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" />
          <p>
            <strong>The store is closed.</strong> Maintenance mode is on, so customers see a "back soon" page and can't order.
            Switch it off below and save to reopen.
          </p>
        </div>
      )}

      <section className="border border-border bg-midnight/40 p-5 space-y-4">
        <div>
          <h2 className="text-display text-xl">Store</h2>
          <p className="text-xs text-muted-foreground mt-1">Shown to customers on the site and in emails.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Store name" hint="Appears in emails, the payment window and the footer.">
            <input
              required
              maxLength={120}
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Currency" hint="Fixed: payments are taken in Indian rupees.">
            <input value={`${data.currency} (₹)`} disabled className={`${inputClass} opacity-60`} />
          </Field>
          <Field label="Support email" hint={supportHint}>
            <input
              type="email"
              value={form.supportEmail}
              placeholder={data.email.from ?? "support@example.com"}
              onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Timezone" hint="Decides what counts as 'today' in reports and the times shown in emails.">
            <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className={inputClass}>
              {TIMEZONES.some(([tz]) => tz === form.timezone) ? null : <option value={form.timezone}>{form.timezone}</option>}
              {TIMEZONES.map(([tz, label]) => (
                <option key={tz} value={tz}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="border border-border bg-midnight/40 p-5 space-y-4">
        <div>
          <h2 className="text-display text-xl">Orders</h2>
          <p className="text-xs text-muted-foreground mt-1">How customers pay, and how long they have to send an order back.</p>
        </div>
        <Toggle
          label="Cash on delivery"
          description="Lets customers place an order without paying online and pay in cash when it arrives. The order is confirmed immediately; the cash is recorded as collected when you mark it delivered."
          checked={form.features.cod}
          onChange={(on) => setFeature("cod", on)}
        />
        <div className="max-w-xs">
          <Field
            label="Return period (days)"
            hint="Customers can request a return this many days after delivery. Set to 0 to stop accepting returns."
          >
            <input
              type="number"
              required
              min={0}
              max={90}
              step={1}
              value={form.returnWindowDays}
              onChange={(e) => setForm({ ...form, returnWindowDays: Math.max(0, Math.min(90, Math.round(Number(e.target.value) || 0))) })}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="border border-border bg-midnight/40 p-5 space-y-1">
        <h2 className="text-display text-xl">Store availability</h2>
        <Toggle
          label="Maintenance mode"
          description="Closes the store: customers see a 'back soon' page and can't browse or order. The admin console keeps working, and payments already made are still confirmed."
          checked={form.features.maintenance}
          onChange={(on) => setFeature("maintenance", on)}
        />
      </section>

      <section className="border border-border bg-midnight/40 p-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-display text-xl">Email</h2>
            <p className="text-xs mt-1 flex items-center gap-1.5">
              {emailReady ? (
                <>
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span className="text-muted-foreground">Sending from {data.email.from}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="size-3.5 text-amber-400" />
                  <span className="text-amber-200">
                    No mail server is configured on the backend, so nothing below can send yet.
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="email"
              aria-label="Send the test email to"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder={data.email.from ?? "you@example.com"}
              disabled={!emailReady}
              className="w-56 px-3 py-2 bg-obsidian border border-border text-xs outline-none focus:border-gold disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => testMut.mutate()}
              disabled={!emailReady || testMut.isPending}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs border border-border hover:bg-midnight disabled:opacity-50 whitespace-nowrap"
            >
              <Mail className="size-3.5" />
              {testMut.isPending ? "Sending…" : "Send test email"}
            </button>
          </div>
        </div>

        {testMut.isSuccess && (
          <p role="status" className="text-xs text-emerald-400">Test email sent to {testMut.data.to}. Check that inbox.</p>
        )}
        {testMut.error instanceof Error && (
          <p role="alert" className="text-xs text-rose-400">{testMut.error.message}</p>
        )}

        <div>
          <Toggle
            label="Transactional emails"
            description="Order confirmation, shipping notice, return updates, a welcome note to new newsletter subscribers, and a copy of each contact-form message to the support address."
            checked={form.features.transactionalEmails}
            onChange={(on) => setFeature("transactionalEmails", on)}
            warning={form.features.transactionalEmails && !emailReady ? "On, but no mail server is configured." : undefined}
          />
          <Toggle
            label="Abandoned cart recovery"
            description={`Emails a signed-in customer once if they leave items in their bag for ${formatDelay(data.abandonedCartDelayMinutes)} without buying.`}
            checked={form.features.abandonedCart}
            onChange={(on) => setFeature("abandonedCart", on)}
            warning={form.features.abandonedCart && !emailReady ? "On, but no mail server is configured." : undefined}
          />
        </div>
      </section>

      <section className="border border-border bg-midnight/40 p-5 space-y-1">
        <h2 className="text-display text-xl">Growth</h2>
        <Toggle
          label="Referral program"
          description={`Gives every customer a personal code on their account page. A new customer who enters it at checkout gets ${data.referralDiscountPercent}% off their first order.`}
          checked={form.features.referrals}
          onChange={(on) => setFeature("referrals", on)}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div>
            <p className="text-sm">Newsletter subscribers</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.subscribers} {data.subscribers === 1 ? "person has" : "people have"} joined from the site's sign-up forms.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void downloadSubscribers()}
            disabled={data.subscribers === 0}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs border border-border hover:bg-midnight disabled:opacity-50"
          >
            <Download className="size-3.5" /> Download list
          </button>
        </div>
      </section>

      {saveMut.error instanceof Error && <p role="alert" className="text-sm text-rose-400">{saveMut.error.message}</p>}

      <div className="flex justify-end items-center gap-3">
        {saved && <span role="status" className="text-xs text-emerald-400">Saved</span>}
        {dirty && !saved && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
        <button
          type="submit"
          disabled={saveMut.isPending || !dirty}
          className="px-5 py-2 bg-gold text-obsidian text-sm font-medium hover:bg-gold/90 disabled:opacity-50"
        >
          {saveMut.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

const inputClass = "w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none focus:border-gold";

function formatDelay(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hour${hours === 1 ? "" : "s"}` : `${minutes} minutes`;
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">{label}</span>
      {children}
      <span className="text-[11px] text-muted-foreground/80 mt-1 block">{hint}</span>
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  warning,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (on: boolean) => void;
  warning?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-border/40 last:border-b-0">
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl">{description}</p>
        {warning && <p className="text-xs text-amber-300 mt-1">{warning}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 w-11 h-6 shrink-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${checked ? "bg-gold" : "bg-border"}`}
      >
        <span
          className={`absolute left-0 top-0.5 size-5 transition-transform ${
            checked ? "translate-x-[1.375rem] bg-obsidian" : "translate-x-0.5 bg-muted-foreground"
          }`}
        />
      </button>
    </div>
  );
}
