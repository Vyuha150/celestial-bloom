import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ApiError } from "@/lib/apiClient";
import { useStoreSettings } from "@/lib/storeSettings";
import {
  useCustomer,
  login,
  register,
  logout,
  getMyOrders,
  getMyProfile,
  requestReturn,
  hasReturnPath,
  takeReturnPath,
  type Customer,
  type MyOrder,
} from "@/shop/auth";
import { formatMoney } from "@/lib/money";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Your account — Celestial" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const customer = useCustomer();

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        {customer ? <Profile customer={customer} /> : <AuthForm />}
      </main>
    </div>
  );
}

type Mode = "login" | "signup";

function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // True when the visitor was redirected here for trying to use the bag.
  // Read after mount: sessionStorage doesn't exist during server rendering.
  const [cameForBag, setCameForBag] = useState(false);
  useEffect(() => setCameForBag(hasReturnPath()), []);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Sent here from the bag or an "Add to cart" button? Go back there.
      // Otherwise stay: useCustomer() flips this page to the profile view.
      const user = mode === "signup" ? await register(name.trim(), email, password) : await login(email, password);
      const back = takeReturnPath();
      // An admin goes to the console; a customer returns to where they were.
      // (A customer who was sent here from an admin-only page just stays.)
      if (user.role === "admin") router.history.push(back ?? "/admin");
      else if (back && !back.startsWith("/admin")) router.history.push(back);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 400
            ? "Check your details — the password needs at least 8 characters."
            : err.message
          : "Could not reach the server. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <p className="text-eyebrow">Account</p>
      <h1 className="text-display mt-2 text-4xl">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      {cameForBag && (
        <p role="status" className="mt-4 border border-gold/25 bg-gold/5 px-3 py-2 text-xs text-ivory/75">
          Please sign in to continue. We'll take you straight back afterwards.
        </p>
      )}

      <div role="tablist" className="mt-8 grid grid-cols-2 border border-gold/20">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={`px-4 py-3 text-[10px] uppercase tracking-[0.3em] transition-colors ${
              mode === m ? "bg-gold text-obsidian" : "text-ivory/60 hover:text-gold"
            }`}
          >
            {m === "login" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {error && (
          <div role="alert" className="border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </div>
        )}

        {mode === "signup" && (
          <Field label="Full name" value={name} onChange={setName} autoComplete="name" maxLength={120} />
        )}
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          minLength={mode === "signup" ? 8 : undefined}
          maxLength={128}
          hint={mode === "signup" ? "At least 8 characters." : undefined}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold px-6 py-3.5 text-xs uppercase tracking-[0.3em] text-obsidian transition-colors hover:bg-champagne disabled:opacity-60"
        >
          {loading ? "One moment…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ivory/50">
        {mode === "login" ? "New to Celestial? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => switchMode(mode === "login" ? "signup" : "login")}
          className="text-gold underline-offset-4 hover:underline"
        >
          {mode === "login" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

function Profile({ customer }: { customer: Customer }) {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["account", "orders", customer.id],
    queryFn: getMyOrders,
  });

  return (
    <div>
      <p className="text-eyebrow">Account</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4 border-b border-gold/15 pb-8">
        <div>
          <h1 className="text-display text-4xl">{customer.name}</h1>
          <p className="mt-2 text-sm text-ivory/55">{customer.email}</p>
          {customer.role === "admin" && (
            <Link to="/admin" className="mt-4 inline-block text-[10px] uppercase tracking-[0.3em] text-gold underline-offset-4 hover:underline">
              Open the admin console →
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="border border-gold/45 px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-obsidian"
        >
          Sign out
        </button>
      </div>

      <ReferralCard />

      <h2 className="text-display mt-10 text-2xl">Orders</h2>
      {isLoading ? (
        <p className="mt-4 text-sm text-ivory/50">Loading your orders…</p>
      ) : isError ? (
        <p className="mt-4 text-sm text-rose-300">Could not load your orders. Try refreshing the page.</p>
      ) : !orders || orders.length === 0 ? (
        <div className="mt-4 border border-gold/10 p-8 text-center">
          <p className="text-sm text-ivory/55">No orders yet.</p>
          <Link
            to="/products"
            className="mt-5 inline-block border border-gold/50 px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-obsidian"
          >
            Explore the collection
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {orders.map((o) => (
            <li key={o._id} className="border border-gold/10 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="font-mono text-sm text-gold">{o.orderNumber}</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/60">
                  {ORDER_STATUS_LABELS[o.status] ?? o.status}
                  {o.paymentMethod === "cod" && o.status !== "refunded" && o.status !== "cancelled" ? " · Cash on delivery" : ""}
                </span>
              </div>
              <p className="mt-2 text-sm text-ivory/70">{o.items.map((i) => `${i.category ? `${i.category} — ` : ""}${i.name} × ${i.qty}`).join(", ")}</p>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ivory/50">
                <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                <span className="text-sm text-ivory">{formatMoney(o.total)}</span>
              </div>
              {o.tracking?.trackingNumber && (
                <p className="mt-3 text-xs text-ivory/55">
                  {o.tracking.carrier ? `${o.tracking.carrier} · ` : ""}
                  {o.tracking.trackingUrl ? (
                    <a href={o.tracking.trackingUrl} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                      {o.tracking.trackingNumber}
                    </a>
                  ) : (
                    o.tracking.trackingNumber
                  )}
                </p>
              )}
              <OrderReturn order={o} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting payment",
  confirmed: "Confirmed",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

const RETURN_STATUS_TEXT: Record<string, string> = {
  requested: "Return requested — we're reviewing it.",
  approved: "Return approved — please send the items back. Your refund follows once they arrive.",
  rejected: "Return request declined.",
  received: "Returned items received — your refund is being processed.",
  refunded: "Return complete — your refund has been issued.",
};

// The return area of one order: its current return status if there is one,
// otherwise a "Return this order" button while the return period is open.
function OrderReturn({ order }: { order: MyOrder }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const returnMut = useMutation({
    mutationFn: () => requestReturn(order._id, reason.trim()),
    onSuccess: () => {
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["account", "orders"] });
    },
  });

  const status = order.returnRequest?.status;
  if (status) {
    return (
      <div className="mt-4 border-t border-gold/10 pt-3 text-xs">
        <p className={status === "rejected" ? "text-rose-300" : "text-gold"}>{RETURN_STATUS_TEXT[status]}</p>
        {order.returnRequest?.adminNote && <p className="mt-1 text-ivory/55">Note from our team: {order.returnRequest.adminNote}</p>}
      </div>
    );
  }

  if (!order.returnableUntil) return null;

  return (
    <div className="mt-4 border-t border-gold/10 pt-3">
      {!open ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-ivory/45">Returnable until {new Date(order.returnableUntil).toLocaleDateString()}</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="border border-gold/45 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-obsidian"
          >
            Return this order
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            returnMut.mutate();
          }}
        >
          <label htmlFor={`return-reason-${order._id}`} className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-ivory/45">
            Why are you returning it?
          </label>
          <textarea
            id={`return-reason-${order._id}`}
            required
            minLength={5}
            maxLength={1000}
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full resize-y border border-gold/20 bg-midnight/60 px-3 py-2 text-sm text-ivory outline-none focus:border-gold/60"
          />
          {returnMut.error && (
            <p role="alert" className="mt-2 text-xs text-rose-300">
              {returnMut.error instanceof ApiError
                ? returnMut.error.status === 400 && returnMut.error.message === "Validation failed"
                  ? "Please write a few words about why you're returning it."
                  : returnMut.error.message
                : "Couldn't send your request. Please try again."}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={returnMut.isPending}
              className="bg-gold px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-obsidian transition-colors hover:bg-champagne disabled:opacity-60"
            >
              {returnMut.isPending ? "Sending…" : "Request return"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50 hover:text-ivory"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Only appears while the referral program is switched on in the admin console.
function ReferralCard() {
  const { referrals: enabled, referralDiscountPercent } = useStoreSettings();
  const { data: profile } = useQuery({ queryKey: ["account", "profile"], queryFn: getMyProfile, enabled });
  const [copied, setCopied] = useState(false);

  if (!enabled || !profile?.referralCode) return null;

  const link = `${window.location.origin}/?ref=${profile.referralCode}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the link is visible to copy by hand.
    }
  };

  return (
    <section className="mt-8 border border-gold/20 bg-midnight/40 p-6">
      <p className="text-eyebrow">Refer a friend</p>
      <p className="mt-3 text-sm text-ivory/70">
        Share your code. A friend gets {referralDiscountPercent}% off their first order when they enter it at checkout.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="border border-gold/40 px-4 py-2 font-mono text-lg tracking-[0.2em] text-gold">{profile.referralCode}</span>
        <button
          type="button"
          onClick={() => void copy()}
          className="border border-gold/45 px-4 py-2.5 text-[10px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-obsidian"
        >
          {copied ? "Link copied" : "Copy share link"}
        </button>
      </div>
      <p className="mt-3 break-all text-xs text-ivory/40">{link}</p>
      <p className="mt-3 text-xs text-ivory/55">
        {profile.referrals
          ? `${profile.referrals} ${profile.referrals === 1 ? "friend has" : "friends have"} ordered with your code.`
          : "No one has ordered with your code yet."}
      </p>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  minLength,
  maxLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-ivory/45">{label}</span>
      <input
        type={type}
        required
        value={value}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gold/20 bg-midnight/60 px-3 py-2.5 text-sm text-ivory outline-none focus:border-gold/60"
      />
      {hint && <span className="mt-1 block text-[11px] text-ivory/40">{hint}</span>}
    </label>
  );
}
