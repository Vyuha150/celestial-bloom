import { useEffect, useState } from "react";
import { X, CheckCircle2, Lock } from "lucide-react";
import {
  createCheckoutSession,
  verifyPayment,
  validateReferralCode,
  type ShippingAddress,
  type PaymentMethod,
} from "@/lib/shopApi";
import { useStoreSettings } from "@/lib/storeSettings";
import { getStoredReferralCode, clearStoredReferralCode } from "./referral";
import { openRazorpayCheckout } from "@/lib/loadRazorpay";
import { ApiError } from "@/lib/apiClient";
import { formatMoney } from "@/lib/money";
import { useCart } from "./useCart";
import { getStoredCustomer } from "./auth";
import { cartItemTitle, cartItemVariant } from "./cartDisplay";

type Props = {
  onClose: () => void;
};

type Stage = "form" | "processing" | "success" | "error";

export function CheckoutModal({ onClose }: Props) {
  const { cart, isLoading, invalidate } = useCart();
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  // Signed-in customers get their details prefilled; guests type them in.
  const [name, setName] = useState(() => getStoredCustomer()?.name ?? "");
  const [email, setEmail] = useState(() => getStoredCustomer()?.email ?? "");
  const [address, setAddress] = useState<ShippingAddress>({
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
    phone: "",
  });

  const settings = useStoreSettings();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  // If the store switches cash on delivery off while this is open, fall back to online.
  const method: PaymentMethod = paymentMethod === "cod" && !settings.cod ? "razorpay" : paymentMethod;
  // Set when a cash-on-delivery order is placed: the amount due at the door.
  const [paidOnDelivery, setPaidOnDelivery] = useState<number | null>(null);
  // Referral code: prefilled from a friend's link, applied only once the
  // server confirms it's valid for this buyer.
  const [referralInput, setReferralInput] = useState(() => getStoredReferralCode());
  const [referral, setReferral] = useState<{ code: string; percent: number } | null>(null);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [checkingReferral, setCheckingReferral] = useState(false);

  const applyReferral = async () => {
    const code = referralInput.trim();
    if (!code) return;
    if (!email.trim()) {
      setReferralError("Enter your email first, then apply the code.");
      return;
    }
    setReferralError(null);
    setCheckingReferral(true);
    try {
      const result = await validateReferralCode(code, email.trim());
      setReferral({ code: result.code, percent: result.discountPercent });
    } catch (err) {
      setReferral(null);
      setReferralError(err instanceof ApiError ? err.message : "Couldn't check that code. Please try again.");
    } finally {
      setCheckingReferral(false);
    }
  };

  const subtotal = cart?.subtotal ?? 0;
  const discount = referral ? Math.round(subtotal * referral.percent) / 100 : 0;
  const total = subtotal - discount;
  const supportLine = settings.supportEmail ? ` Please contact ${settings.supportEmail}` : " Please contact support";

  const busy = stage === "processing";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, busy]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStage("processing");

    try {
      const session = await createCheckoutSession(name.trim(), email.trim(), address, referral?.code, method);

      // Cash on delivery: the order is already placed, nothing to pay now.
      if (session.paymentMethod === "cod") {
        setOrderNumber(session.orderNumber);
        setPaidOnDelivery(session.total);
        setStage("success");
        clearStoredReferralCode();
        invalidate();
        return;
      }

      await openRazorpayCheckout({
        key: session.keyId,
        amount: session.amount,
        currency: session.currency,
        order_id: session.razorpayOrderId,
        name: settings.storeName,
        description: `Order ${session.orderNumber}`,
        prefill: { name, email, contact: address.phone },
        theme: { color: "#c9a24b" },
        handler: (response) => {
          void (async () => {
            try {
              const result = await verifyPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
              );
              setOrderNumber(result.orderNumber);
              setStage("success");
              clearStoredReferralCode();
              invalidate();
            } catch {
              setError(
                `Your payment went through, but we couldn't confirm it automatically.${supportLine} and quote order ${session.orderNumber}.`,
              );
              setStage("error");
            }
          })();
        },
        modal: {
          ondismiss: () => setStage("form"),
        },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start checkout. Please try again.");
      setStage("error");
      // A stock conflict means the bag is out of date — refresh it.
      invalidate();
    }
  };

  const items = cart?.items ?? [];
  const empty = !isLoading && items.length === 0;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur-sm"
      onClick={() => !busy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        className="max-h-[calc(100svh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[1.5rem] border border-gold/20 bg-midnight text-ivory"
      >
        {stage === "success" ? (
          <div className="px-7 py-14 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
            <h2 className="text-display mt-5 text-3xl">Order confirmed</h2>
            <p className="mt-3 text-sm text-ivory/60">
              Order <span className="font-mono text-gold">{orderNumber}</span> is being prepared.
            </p>
            {paidOnDelivery !== null && (
              <p className="mt-2 text-sm text-ivory/60">
                Please keep <span className="text-ivory">{formatMoney(paidOnDelivery)}</span> ready to pay in cash on delivery.
              </p>
            )}
            <button
              onClick={onClose}
              className="mt-8 rounded-full bg-gold px-8 py-3 text-xs uppercase tracking-[0.25em] text-obsidian hover:bg-champagne"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-gold/15 px-7 py-5">
              <h2 className="text-display text-2xl">Checkout</h2>
              <button
                onClick={onClose}
                disabled={busy}
                aria-label="Close checkout"
                className="grid h-9 w-9 place-items-center rounded-full border border-gold/20 text-ivory/60 transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {empty ? (
              <div className="px-7 py-14 text-center">
                <p className="text-sm text-ivory/60">Your bag is empty, so there's nothing to check out.</p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-full bg-gold px-7 py-3 text-[10px] uppercase tracking-[0.3em] text-obsidian hover:bg-champagne"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-[1.25fr_1fr]">
                <form onSubmit={submit} className="space-y-3 px-7 py-6">
                  {error && (
                    <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                      {error}
                    </div>
                  )}

                  <p className="text-eyebrow">Contact</p>
                  <Field label="Full name" value={name} onChange={setName} autoComplete="name" maxLength={160} />
                  <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(v) => {
                      setEmail(v);
                      setReferral(null);
                    }}
                    autoComplete="email"
                  />

                  <p className="text-eyebrow pt-3">Delivery address</p>
                  <Field
                    label="Address"
                    value={address.line1}
                    onChange={(v) => setAddress({ ...address, line1: v })}
                    autoComplete="address-line1"
                    maxLength={200}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="City"
                      value={address.city}
                      onChange={(v) => setAddress({ ...address, city: v })}
                      autoComplete="address-level2"
                      maxLength={100}
                    />
                    <Field
                      label="State"
                      value={address.state}
                      onChange={(v) => setAddress({ ...address, state: v })}
                      autoComplete="address-level1"
                      maxLength={100}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="PIN code"
                      value={address.postalCode}
                      onChange={(v) => setAddress({ ...address, postalCode: v })}
                      autoComplete="postal-code"
                      inputMode="numeric"
                      maxLength={20}
                    />
                    <Field
                      label="Phone"
                      type="tel"
                      value={address.phone}
                      onChange={(v) => setAddress({ ...address, phone: v })}
                      autoComplete="tel"
                      minLength={6}
                      maxLength={20}
                    />
                  </div>

                  {settings.cod && (
                    <fieldset className="pt-3">
                      <legend className="text-eyebrow">Payment</legend>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {(
                          [
                            ["razorpay", "Pay online", "Card, UPI or net banking"],
                            ["cod", "Cash on delivery", "Pay when it arrives"],
                          ] as const
                        ).map(([value, label, hint]) => (
                          <label
                            key={value}
                            className={`cursor-pointer rounded-lg border px-3 py-2.5 transition-colors ${
                              method === value ? "border-gold bg-gold/10" : "border-gold/20 hover:border-gold/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment-method"
                              value={value}
                              checked={method === value}
                              onChange={() => setPaymentMethod(value)}
                              className="sr-only"
                            />
                            <span className="block text-sm text-ivory">{label}</span>
                            <span className="mt-0.5 block text-[11px] text-ivory/50">{hint}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  <button
                    type="submit"
                    disabled={busy || isLoading}
                    className="!mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-xs uppercase tracking-[0.3em] text-obsidian hover:bg-champagne disabled:opacity-60"
                  >
                    {method === "razorpay" && <Lock className="h-3.5 w-3.5" />}
                    {method === "cod"
                      ? busy
                        ? "Placing order…"
                        : `Place order · ${formatMoney(total)}`
                      : busy
                        ? "Opening payment…"
                        : `Pay ${formatMoney(total)}`}
                  </button>
                  <p className="text-center text-[11px] text-ivory/40">
                    {method === "cod"
                      ? `You'll pay ${formatMoney(total)} in cash when your order is delivered.`
                      : "Payments are processed securely by Razorpay."}
                  </p>
                </form>

                <aside className="border-t border-gold/15 bg-obsidian/40 px-7 py-6 md:border-l md:border-t-0">
                  <p className="text-eyebrow">Order summary</p>
                  <ul className="mt-4 space-y-4">
                    {items.map((item) => (
                      <li key={item.product} className="flex justify-between gap-4 text-sm">
                        <div className="min-w-0">
                          <p className="text-ivory">{cartItemTitle(item)}</p>
                          <p className="mt-0.5 text-xs text-ivory/50">
                            {[cartItemVariant(item), `Qty ${item.qty}`].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <p className="shrink-0 text-ivory/80">{formatMoney(item.lineTotal)}</p>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-6 space-y-2 border-t border-gold/10 pt-4 text-sm">
                    <div className="flex justify-between text-ivory/60">
                      <dt>Subtotal</dt>
                      <dd>{formatMoney(cart?.subtotal ?? 0)}</dd>
                    </div>
                    <div className="flex justify-between text-ivory/60">
                      <dt>Delivery</dt>
                      <dd className="text-gold">Free</dd>
                    </div>
                    {referral && (
                      <div className="flex justify-between text-gold">
                        <dt>Referral ({referral.percent}% off)</dt>
                        <dd>−{formatMoney(discount)}</dd>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between pt-2">
                      <dt className="text-[10px] uppercase tracking-[0.3em] text-ivory/55">Total</dt>
                      <dd className="text-display text-2xl">{formatMoney(total)}</dd>
                    </div>
                  </dl>

                  {settings.referrals && (
                    <div className="mt-6 border-t border-gold/10 pt-4">
                      <label htmlFor="referral-code" className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-ivory/45">
                        Referral code
                      </label>
                      {referral ? (
                        <p className="flex items-center justify-between text-sm text-gold">
                          <span className="font-mono">{referral.code} applied</span>
                          <button
                            type="button"
                            onClick={() => setReferral(null)}
                            className="text-[10px] uppercase tracking-[0.25em] text-ivory/50 hover:text-ivory"
                          >
                            Remove
                          </button>
                        </p>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            id="referral-code"
                            value={referralInput}
                            maxLength={20}
                            onChange={(e) => {
                              setReferralInput(e.target.value.toUpperCase());
                              setReferralError(null);
                            }}
                            placeholder="Optional"
                            className="w-full rounded-lg border border-gold/20 bg-obsidian/60 px-3 py-2 font-mono text-sm text-ivory outline-none focus:border-gold/60"
                          />
                          <button
                            type="button"
                            onClick={() => void applyReferral()}
                            disabled={checkingReferral || !referralInput.trim()}
                            className="rounded-lg border border-gold/45 px-4 text-[10px] uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-obsidian disabled:opacity-50"
                          >
                            {checkingReferral ? "…" : "Apply"}
                          </button>
                        </div>
                      )}
                      {referralError && (
                        <p role="alert" className="mt-2 text-xs text-rose-300">
                          {referralError}
                        </p>
                      )}
                    </div>
                  )}
                </aside>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  minLength,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "tel" | "text";
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-ivory/45">{label}</span>
      <input
        type={type}
        required
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        minLength={minLength}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gold/20 bg-obsidian/60 px-3 py-2.5 text-sm text-ivory outline-none focus:border-gold/60"
      />
    </label>
  );
}
