import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { ApiError } from "@/lib/apiClient";
import { formatMoney } from "@/lib/money";
import type { CartItem } from "@/lib/shopApi";
import { useCart } from "./useCart";
import { cartItemImage, cartItemTitle, cartItemVariant } from "./cartDisplay";

type Props = {
  onClose: () => void;
  onCheckout: () => void;
};

const MAX_QTY = 99;

export function CartDrawer({ onClose, onCheckout }: Props) {
  const { cart, isLoading, isError, itemCount, updateItem, removeItem, refetch } = useCart();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Stop the page behind the drawer from scrolling while it's open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const run = async (productId: string, action: () => Promise<unknown>) => {
    setError(null);
    setBusyId(productId);
    try {
      await action();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update your bag. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const items = cart?.items ?? [];
  const hasUnavailable = items.some((i) => !i.available);

  return (
    <div className="fixed inset-0 z-[110] flex justify-end bg-obsidian/75 backdrop-blur-sm" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-[460px] flex-col border-l border-gold/20 bg-midnight text-ivory shadow-[-30px_0_80px_rgba(0,0,0,0.5)]"
      >
        <header className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
          <div className="flex items-baseline gap-3">
            <h2 className="text-display text-2xl">Your bag</h2>
            {itemCount > 0 && (
              <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/45">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close bag"
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/20 text-ivory/60 transition-colors hover:border-gold hover:text-gold"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* data-lenis-prevent: let this panel scroll natively instead of the page behind it */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-2">
          {error && (
            <div role="alert" className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}

          {isLoading ? (
            <ul aria-label="Loading your bag" className="divide-y divide-gold/10">
              {[0, 1].map((i) => (
                <li key={i} className="flex animate-pulse gap-4 py-5">
                  <div className="h-24 w-24 shrink-0 rounded-xl bg-ivory/5" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-3 w-2/3 rounded bg-ivory/10" />
                    <div className="h-3 w-1/3 rounded bg-ivory/5" />
                    <div className="h-7 w-24 rounded-full bg-ivory/5" />
                  </div>
                </li>
              ))}
            </ul>
          ) : isError ? (
            <div className="py-20 text-center">
              <p className="text-sm text-rose-300">We couldn't load your bag.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-5 border border-gold/50 px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-obsidian"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-gold/25 text-gold">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <p className="text-display mt-6 text-2xl">Your bag is empty</p>
              <p className="mt-2 max-w-[16rem] text-sm text-ivory/50">Formulas you add will appear here.</p>
              <Link
                to="/products"
                onClick={onClose}
                className="mt-7 rounded-full bg-gold px-7 py-3 text-[10px] uppercase tracking-[0.3em] text-obsidian transition-colors hover:bg-champagne"
              >
                Explore the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gold/10">
              {items.map((item) => (
                <CartLine
                  key={item.product}
                  item={item}
                  busy={busyId === item.product}
                  onClose={onClose}
                  onQty={(qty) => run(item.product, () => updateItem({ productId: item.product, qty }))}
                  onRemove={() => run(item.product, () => removeItem(item.product))}
                />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-gold/15 bg-obsidian/40 px-6 py-5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-ivory/60">
                <dt>Subtotal</dt>
                <dd>{formatMoney(cart?.subtotal ?? 0)}</dd>
              </div>
              <div className="flex justify-between text-ivory/60">
                <dt>Delivery</dt>
                <dd className="text-gold">Free</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-gold/10 pt-3">
                <dt className="text-[10px] uppercase tracking-[0.3em] text-ivory/55">Total</dt>
                <dd className="text-display text-3xl">{formatMoney(cart?.subtotal ?? 0)}</dd>
              </div>
            </dl>

            {hasUnavailable && (
              <p role="alert" className="mt-4 text-xs text-rose-300">
                Some items are no longer available in the quantity chosen. Adjust or remove them to continue.
              </p>
            )}

            <button
              type="button"
              onClick={onCheckout}
              disabled={hasUnavailable || busyId !== null}
              className="mt-5 w-full rounded-full bg-gold px-6 py-4 text-xs uppercase tracking-[0.3em] text-obsidian transition-colors hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-50"
            >
              Checkout · {formatMoney(cart?.subtotal ?? 0)}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full py-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50 transition-colors hover:text-gold"
            >
              Continue shopping
            </button>

            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-ivory/40">
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-gold/70" /> Secure payment
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-gold/70" /> Free delivery
              </li>
            </ul>
          </footer>
        )}
      </aside>
    </div>
  );
}

function CartLine({
  item,
  busy,
  onClose,
  onQty,
  onRemove,
}: {
  item: CartItem;
  busy: boolean;
  onClose: () => void;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const image = cartItemImage(item);
  const title = cartItemTitle(item);
  const variant = cartItemVariant(item);
  const maxQty = Math.min(MAX_QTY, item.stock);

  return (
    <li className={`flex gap-4 py-5 transition-opacity ${busy ? "opacity-60" : ""}`}>
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gold/15 bg-obsidian">
        {image ? (
          <img src={image} alt="" width={96} height={96} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-gold/40">
            <ShoppingBag className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {item.categorySlug ? (
              <Link
                to="/products/$slug"
                params={{ slug: item.categorySlug }}
                onClick={onClose}
                className="text-display block text-lg leading-tight text-ivory transition-colors hover:text-gold"
              >
                {title}
              </Link>
            ) : (
              <p className="text-display text-lg leading-tight text-ivory">{title}</p>
            )}
            {variant && <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gold/80">{variant}</p>}
            <p className="mt-1 text-xs text-ivory/45">{formatMoney(item.price)} each</p>
          </div>
          <p className="shrink-0 text-sm text-ivory">{formatMoney(item.lineTotal)}</p>
        </div>

        {!item.available && (
          <p className="mt-2 text-xs text-rose-300">
            {item.stock > 0 ? `Only ${item.stock} left — reduce the quantity.` : "No longer available."}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-full border border-gold/25">
            <button
              type="button"
              aria-label={`Decrease quantity of ${title}`}
              disabled={busy || item.qty <= 1}
              onClick={() => onQty(item.qty - 1)}
              className="grid h-8 w-8 place-items-center text-ivory/70 transition-colors hover:text-gold disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span aria-live="polite" className="w-7 text-center text-sm">
              {item.qty}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${title}`}
              disabled={busy || item.qty >= maxQty}
              onClick={() => onQty(item.qty + 1)}
              className="grid h-8 w-8 place-items-center text-ivory/70 transition-colors hover:text-gold disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            type="button"
            aria-label={`Remove ${title} from bag`}
            disabled={busy}
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-ivory/45 transition-colors hover:text-rose-300 disabled:opacity-30"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}
