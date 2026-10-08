import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Filter, Eye, X, Truck, RotateCcw } from "lucide-react";
import {
  listOrders,
  updateOrderStatus,
  updateOrderTracking,
  updateOrderReturn,
  type AdminOrder,
  type OrderTracking,
  type ReturnAction,
  type ReturnRequest,
} from "@/admin/api";
import { StatusPill } from "./admin.index";
import { formatMoney } from "@/lib/money";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
});

const STATUSES = ["pending", "confirmed", "paid", "shipped", "delivered", "refunded", "cancelled"] as const;
// Filter value for "orders with a return waiting on us" — not an order status.
const OPEN_RETURNS = "open-returns";

function OrdersPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [active, setActive] = useState<AdminOrder | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "orders", q, status],
    queryFn: () =>
      listOrders({
        search: q || undefined,
        status: status === "all" || status === OPEN_RETURNS ? undefined : status,
        returns: status === OPEN_RETURNS ? "open" : undefined,
        limit: 100,
      }),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status: s }: { id: string; status: AdminOrder["status"] }) => updateOrderStatus(id, s),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      setActive(updated);
    },
  });

  const trackingMut = useMutation({
    mutationFn: ({ id, tracking }: { id: string; tracking: OrderTracking }) => updateOrderTracking(id, tracking),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      setActive(updated);
    },
  });

  const returnMut = useMutation({
    mutationFn: ({ id, action, note }: { id: string; action: ReturnAction; note?: string }) => updateOrderReturn(id, action, note),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      setActive(updated);
    },
  });

  const orders = data?.items ?? [];
  const openReturns = data?.openReturns ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-eyebrow">Operations</p>
          <h1 className="text-display text-4xl mt-1">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data?.pagination.total ?? 0} orders
            {openReturns > 0 && (
              <button onClick={() => setStatus(OPEN_RETURNS)} className="ml-3 text-gold underline-offset-4 hover:underline">
                {openReturns} return {openReturns === 1 ? "request needs" : "requests need"} attention
              </button>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-2 border border-border bg-midnight/40 flex-1 min-w-64">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by order number, name, email…"
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border border-border bg-midnight/40">
          <Filter className="size-4 text-muted-foreground" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-transparent outline-none text-sm">
            <option value="all">All statuses</option>
            <option value={OPEN_RETURNS}>Open return requests</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s[0]!.toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-rose-400">Failed to load orders.</p>}

      <div className="border border-border bg-midnight/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left font-normal px-5 py-3">Order</th>
              <th className="text-left font-normal py-3">Customer</th>
              <th className="text-left font-normal py-3">Date</th>
              <th className="text-left font-normal py-3">Items</th>
              <th className="text-left font-normal py-3">Status</th>
              <th className="text-right font-normal py-3">Total</th>
              <th className="text-right font-normal px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">No orders match your filters</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="border-b border-border/40 hover:bg-midnight/60">
                  <td className="px-5 py-3 font-mono text-xs">{o.orderNumber}</td>
                  <td className="py-3">
                    <div>{o.customerName}</div>
                    <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                  </td>
                  <td className="py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">{o.itemCount}</td>
                  <td className="py-3">
                    <StatusPill status={o.status} />
                    {o.returnRequest?.status && o.returnRequest.status !== "refunded" && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-gold">
                        <RotateCcw className="size-3" /> Return {o.returnRequest.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">{formatMoney(o.total)}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setActive(o)} className="inline-flex items-center gap-1 text-xs text-gold hover:underline">
                      <Eye className="size-3" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-end sm:items-center justify-center p-4" onClick={() => setActive(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-midnight border border-border w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-eyebrow">Order</p>
                <h2 className="text-display text-2xl font-mono">{active.orderNumber}</h2>
              </div>
              <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Customer" value={active.customerName} />
              <Field label="Email" value={active.customerEmail} />
              <Field label="Date" value={new Date(active.createdAt).toLocaleDateString()} />
              <Field label="Items" value={String(active.itemCount)} />
              <Field label="Total" value={formatMoney(active.total)} />
              <Field
                label="Payment"
                value={
                  active.paymentMethod === "cod"
                    ? `Cash on delivery — ${
                        active.paymentStatus === "cod_pending"
                          ? "to collect"
                          : active.paymentStatus === "refunded"
                            ? "refunded"
                            : "collected"
                      }`
                    : `Online — ${active.paymentStatus}`
                }
              />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                <StatusPill status={active.status} />
              </div>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Items</p>
              <div className="space-y-1 text-sm">
                {active.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {it.qty}× {it.category ? `${it.category} — ${it.name}` : it.name}
                    </span>
                    <span className="text-muted-foreground">{formatMoney(it.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Update status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={statusMut.isPending}
                    onClick={() => statusMut.mutate({ id: active._id, status: s })}
                    className={`px-3 py-1.5 text-xs border disabled:opacity-50 ${
                      active.status === s ? "border-gold text-gold" : "border-border hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {statusMut.error instanceof Error && (
                <p role="alert" className="mt-2 text-xs text-rose-400">{statusMut.error.message}</p>
              )}
            </div>

            {active.returnRequest?.status && (
              <ReturnSection
                key={`${active._id}-${active.returnRequest.status}`}
                request={active.returnRequest}
                isCod={active.paymentMethod === "cod"}
                total={active.total}
                busy={returnMut.isPending}
                error={returnMut.error instanceof Error ? returnMut.error.message : null}
                onAction={(action, note) => returnMut.mutate({ id: active._id, action, note })}
              />
            )}

            <TrackingSection
              key={active._id}
              tracking={active.tracking}
              saving={trackingMut.isPending}
              onSave={(tracking) => trackingMut.mutate({ id: active._id, tracking })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const RETURN_STAGE_TEXT: Record<string, string> = {
  requested: "The customer has asked to return this order. Approve or decline it.",
  approved: "Approved. Waiting for the customer to send the items back.",
  rejected: "Declined. The order stays as delivered.",
  received: "Items received. Refund the customer to finish the return.",
  refunded: "Refunded and restocked. This return is complete.",
};

function ReturnSection({
  request,
  isCod,
  total,
  busy,
  error,
  onAction,
}: {
  request: ReturnRequest;
  isCod: boolean;
  total: number;
  busy: boolean;
  error: string | null;
  onAction: (action: ReturnAction, note?: string) => void;
}) {
  const [note, setNote] = useState("");
  const status = request.status!;
  const button = "px-3 py-1.5 text-xs font-medium disabled:opacity-60";

  const refund = () => {
    const how = isCod
      ? "This was a cash-on-delivery order, so pay the customer back yourself; this only records it."
      : "The amount will be sent back to the customer through Razorpay.";
    if (confirm(`Refund ${formatMoney(total)} and put the items back in stock? ${how}`)) onAction("refund");
  };

  return (
    <div className="border-t border-border pt-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <RotateCcw className="size-3.5" /> Return request
      </p>
      <p className="text-sm text-gold">{RETURN_STAGE_TEXT[status]}</p>
      <dl className="mt-2 space-y-1 text-sm">
        <div>
          <dt className="inline text-muted-foreground">Customer's reason: </dt>
          <dd className="inline">{request.reason}</dd>
        </div>
        {request.requestedAt && (
          <div className="text-xs text-muted-foreground">Requested {new Date(request.requestedAt).toLocaleString()}</div>
        )}
        {request.adminNote && (
          <div>
            <dt className="inline text-muted-foreground">Your note to the customer: </dt>
            <dd className="inline">{request.adminNote}</dd>
          </div>
        )}
      </dl>

      {status === "requested" && (
        <>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={1000}
            placeholder="Note to the customer (optional, e.g. why it was declined)"
            className="mt-3 w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none focus:border-gold"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button disabled={busy} onClick={() => onAction("approve", note.trim())} className={`${button} bg-gold text-obsidian hover:bg-gold/90`}>
              Approve return
            </button>
            <button disabled={busy} onClick={() => onAction("reject", note.trim())} className={`${button} border border-rose-500/50 text-rose-300 hover:bg-rose-500/10`}>
              Decline
            </button>
          </div>
        </>
      )}
      {status === "approved" && (
        <button disabled={busy} onClick={() => onAction("received")} className={`mt-3 ${button} bg-gold text-obsidian hover:bg-gold/90`}>
          Mark items as received
        </button>
      )}
      {status === "received" && (
        <button disabled={busy} onClick={refund} className={`mt-3 ${button} bg-gold text-obsidian hover:bg-gold/90`}>
          Refund {formatMoney(total)}
        </button>
      )}
      {error && <p role="alert" className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

function TrackingSection({
  tracking,
  saving,
  onSave,
}: {
  tracking: OrderTracking | undefined;
  saving: boolean;
  onSave: (t: OrderTracking) => void;
}) {
  const [carrier, setCarrier] = useState(tracking?.carrier ?? "");
  const [trackingNumber, setTrackingNumber] = useState(tracking?.trackingNumber ?? "");
  const [trackingUrl, setTrackingUrl] = useState(tracking?.trackingUrl ?? "");

  return (
    <div className="border-t border-border pt-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Truck className="size-3.5" /> Delivery tracking
      </p>
      {(tracking?.shippedAt || tracking?.deliveredAt) && (
        <div className="flex gap-4 text-[11px] text-muted-foreground mb-2">
          {tracking.shippedAt && <span>Shipped {new Date(tracking.shippedAt).toLocaleDateString()}</span>}
          {tracking.deliveredAt && <span>Delivered {new Date(tracking.deliveredAt).toLocaleDateString()}</span>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <input
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          placeholder="Carrier (e.g. Bluedart)"
          className="px-3 py-2 bg-obsidian border border-border text-sm outline-none focus:border-gold"
        />
        <input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Tracking number"
          className="px-3 py-2 bg-obsidian border border-border text-sm outline-none focus:border-gold"
        />
        <input
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          placeholder="Tracking URL (optional)"
          className="col-span-2 px-3 py-2 bg-obsidian border border-border text-sm outline-none focus:border-gold"
        />
      </div>
      <button
        onClick={() => onSave({ carrier, trackingNumber, trackingUrl })}
        disabled={saving}
        className="mt-2 px-3 py-1.5 text-xs bg-gold text-obsidian font-medium hover:bg-gold/90 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save tracking"}
      </button>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p>{value}</p>
    </div>
  );
}
