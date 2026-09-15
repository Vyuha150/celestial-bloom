import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { createCheckoutSession, verifyPayment, type ShippingAddress } from "@/lib/shopApi";
import { openRazorpayCheckout } from "@/lib/loadRazorpay";
import { ApiError } from "@/lib/apiClient";
import { useCart } from "./useCart";

type Props = {
  onClose: () => void;
};

type Stage = "form" | "processing" | "success" | "error";

export function CheckoutModal({ onClose }: Props) {
  const { invalidate } = useCart();
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<ShippingAddress>({
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
    phone: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStage("processing");

    try {
      const session = await createCheckoutSession(name, email, address);

      await openRazorpayCheckout({
        key: session.keyId,
        amount: session.amount,
        currency: session.currency,
        order_id: session.razorpayOrderId,
        name: "Celestial",
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
              invalidate();
            } catch {
              setError("Payment succeeded but verification failed — contact support with your order number.");
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
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/85 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[1.5rem] border border-gold/20 bg-midnight p-7 text-ivory"
      >
        {stage === "success" ? (
          <div className="text-center py-6">
            <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
            <h2 className="text-display text-2xl mt-4">Order confirmed</h2>
            <p className="mt-2 text-sm text-ivory/60">
              Order <span className="font-mono text-gold">{orderNumber}</span> is being processed.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-gold px-6 py-2.5 text-xs uppercase tracking-[0.25em] text-obsidian hover:bg-champagne"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <h2 className="text-display text-2xl">Checkout</h2>
              <button onClick={onClose} className="text-ivory/50 hover:text-ivory"><X className="h-5 w-5" /></button>
            </div>

            {error && (
              <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-4 space-y-3">
              <Field label="Full name" value={name} onChange={setName} required />
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
              <Field label="Address line 1" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} required />
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} required />
                <Field label="State" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Postal code" value={address.postalCode} onChange={(v) => setAddress({ ...address, postalCode: v })} required />
                <Field label="Phone" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} required />
              </div>

              <button
                type="submit"
                disabled={stage === "processing"}
                className="mt-2 w-full rounded-full bg-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-obsidian hover:bg-champagne disabled:opacity-60"
              >
                {stage === "processing" ? "Opening payment…" : "Continue to payment"}
              </button>
            </form>
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
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.25em] text-ivory/45 mb-1 block">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gold/20 bg-obsidian/60 px-3 py-2 text-sm text-ivory outline-none focus:border-gold/60"
      />
    </div>
  );
}
