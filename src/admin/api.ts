import { adminFetch } from "./auth";

export type Paginated<T> = { items: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } };

// `new URLSearchParams({ x: undefined })` stringifies to the literal text
// "undefined" rather than omitting the key — this drops undefined/empty
// values instead, so optional filters actually come out optional.
function toQueryString(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (entries.length === 0) return "";
  return `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}`;
}

// ---- Categories (for populating product-form selects) ----
export type AdminCategory = { _id: string; slug: string; title: string };

export function listCategories(): Promise<AdminCategory[]> {
  return adminFetch("/admin/categories");
}

// ---- Products ----
export type AdminProduct = {
  _id: string;
  category: { _id: string; slug: string; title: string } | string;
  sku: string;
  name: string;
  cadence: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: "live" | "draft" | "archived";
  images: string[];
  perks: string[];
  highlight: boolean;
  cta: string;
  sales30d: number;
};

export type ProductInput = {
  category: string;
  sku?: string;
  name: string;
  cadence?: string;
  price: number;
  compareAtPrice?: number;
  stock?: number;
  status?: AdminProduct["status"];
  images?: string[];
  perks?: string[];
  highlight?: boolean;
  cta?: string;
};

export function listProducts(params: { page?: number; limit?: number; category?: string; status?: string; search?: string } = {}) {
  return adminFetch<Paginated<AdminProduct>>(`/admin/products${toQueryString(params)}`);
}

export function createProduct(body: ProductInput): Promise<AdminProduct> {
  return adminFetch("/admin/products", { method: "POST", body });
}

export function updateProduct(id: string, body: Partial<ProductInput>): Promise<AdminProduct> {
  return adminFetch(`/admin/products/${id}`, { method: "PATCH", body });
}

export function deleteProduct(id: string): Promise<void> {
  return adminFetch(`/admin/products/${id}`, { method: "DELETE" });
}

export function adjustStock(id: string, change: number, reason: "restock" | "adjustment", note?: string): Promise<AdminProduct> {
  return adminFetch(`/admin/products/${id}/stock`, { method: "POST", body: { change, reason, note } });
}

export function uploadProductImages(id: string, files: File[]): Promise<AdminProduct> {
  const form = new FormData();
  for (const file of files) form.append("images", file);
  return adminFetch(`/admin/products/${id}/images`, { method: "POST", body: form });
}

// ---- Orders ----
export type AdminOrderItem = { product: string; name: string; category: string; price: number; qty: number; lineTotal: number };
export type OrderTracking = { carrier?: string; trackingNumber?: string; trackingUrl?: string; shippedAt?: string; deliveredAt?: string };
export type ReturnRequest = {
  status?: "requested" | "approved" | "rejected" | "received" | "refunded";
  reason?: string;
  adminNote?: string;
  requestedAt?: string;
  decidedAt?: string;
  receivedAt?: string;
  refundedAt?: string;
};
export type ReturnAction = "approve" | "reject" | "received" | "refund";

export type AdminOrder = {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: AdminOrderItem[];
  itemCount: number;
  total: number;
  status: "pending" | "confirmed" | "paid" | "shipped" | "delivered" | "refunded" | "cancelled";
  paymentStatus: string;
  paymentMethod?: "razorpay" | "cod";
  tracking?: OrderTracking;
  returnRequest?: ReturnRequest;
  createdAt: string;
};

export function listOrders(params: { page?: number; limit?: number; status?: string; search?: string; returns?: "open" | "any" } = {}) {
  // openReturns = return requests still waiting on the store, across all orders.
  return adminFetch<Paginated<AdminOrder> & { openReturns: number }>(`/admin/orders${toQueryString(params)}`);
}

export function getOrder(id: string): Promise<AdminOrder> {
  return adminFetch(`/admin/orders/${id}`);
}

export function updateOrderStatus(id: string, status: AdminOrder["status"], note?: string): Promise<AdminOrder> {
  return adminFetch(`/admin/orders/${id}/status`, { method: "PATCH", body: { status, note } });
}

export function updateOrderReturn(id: string, action: ReturnAction, note?: string): Promise<AdminOrder> {
  return adminFetch(`/admin/orders/${id}/return`, { method: "PATCH", body: { action, note: note || undefined } });
}

export function deleteOrder(id: string): Promise<void> {
  return adminFetch(`/admin/orders/${id}`, { method: "DELETE" });
}

export function refreshOrderPayment(id: string): Promise<{ razorpayStatus: string; order: AdminOrder }> {
  return adminFetch(`/admin/orders/${id}/refresh-payment`, { method: "POST" });
}

export function updateOrderTracking(id: string, body: OrderTracking): Promise<AdminOrder> {
  return adminFetch(`/admin/orders/${id}/tracking`, { method: "PATCH", body });
}

// ---- Customers ----
export type AdminCustomer = {
  _id: string;
  name: string;
  email: string;
  tier: "Founder" | "Member" | "Trial";
  role: "admin" | "customer";
  createdAt: string;
  orders: number;
  lifetime: number;
};

export function listCustomers(params: { page?: number; limit?: number; search?: string; tier?: string } = {}) {
  return adminFetch<Paginated<AdminCustomer>>(`/admin/customers${toQueryString(params)}`);
}

export type AdminCustomerCart = {
  items: { product: string; name: string; categoryTitle: string; qty: number; price: number; lineTotal: number }[];
  itemCount: number;
  subtotal: number;
  updatedAt: string;
};

export function getCustomer(id: string): Promise<{ customer: AdminCustomer; orders: AdminOrder[]; cart: AdminCustomerCart | null }> {
  return adminFetch(`/admin/customers/${id}`);
}

export function updateCustomer(id: string, body: Partial<Pick<AdminCustomer, "name" | "tier" | "role">>): Promise<AdminCustomer> {
  return adminFetch(`/admin/customers/${id}`, { method: "PATCH", body });
}

export function deleteCustomer(id: string): Promise<void> {
  return adminFetch(`/admin/customers/${id}`, { method: "DELETE" });
}

// ---- Contact messages ----
export type ContactMessage = { _id: string; name: string; email: string; subject: string; message: string; handled: boolean; createdAt: string };

export function listMessages(): Promise<{ messages: ContactMessage[]; unhandled: number }> {
  return adminFetch("/admin/messages");
}

export function setMessageHandled(id: string, handled: boolean): Promise<ContactMessage> {
  return adminFetch(`/admin/messages/${id}`, { method: "PATCH", body: { handled } });
}

export function deleteMessage(id: string): Promise<void> {
  return adminFetch(`/admin/messages/${id}`, { method: "DELETE" });
}

// ---- Settings ----
export type StoreFeatures = { maintenance: boolean; cod: boolean; abandonedCart: boolean; referrals: boolean; transactionalEmails: boolean };

export type StoreSettings = {
  storeName: string;
  // Read-only: payments are taken in INR.
  currency: string;
  supportEmail: string;
  timezone: string;
  // Days after delivery a customer may request a return; 0 = returns off.
  returnWindowDays: number;
  features: StoreFeatures;
  // Read-only facts about the server, shown alongside the switches.
  email: { configured: boolean; from: string | null };
  abandonedCartDelayMinutes: number;
  referralDiscountPercent: number;
  subscribers: number;
};

export type SettingsUpdate = {
  storeName?: string;
  supportEmail?: string;
  timezone?: string;
  returnWindowDays?: number;
  features?: Partial<StoreFeatures>;
};

export function getSettings(): Promise<StoreSettings> {
  return adminFetch("/admin/settings");
}

export function updateSettings(body: SettingsUpdate): Promise<StoreSettings> {
  return adminFetch("/admin/settings", { method: "PATCH", body });
}

export function sendTestEmail(to?: string): Promise<{ sent: true; to: string }> {
  return adminFetch("/admin/settings/test-email", { method: "POST", body: to ? { to } : {} });
}

export type Subscriber = { _id: string; email: string; source: string; createdAt: string };

export function listSubscribers(): Promise<Subscriber[]> {
  return adminFetch("/admin/settings/subscribers");
}

// ---- Analytics ----
export type DashboardData = {
  kpis: Record<"revenue" | "orders" | "newCustomers" | "aov", { value: number; changePct: number }>;
  revenueTrend: { d: string; revenue: number; orders: number }[];
  categoryMix: { name: string; value: number }[];
  topProducts: { _id: string; name: string; revenue: number; qty: number }[];
  recentOrders: AdminOrder[];
  trafficSources: { src: string; v: number }[];
};

export function getDashboard(): Promise<DashboardData> {
  return adminFetch("/admin/analytics/dashboard");
}

export function getCohortRetention(): Promise<{ cohort: string; customers: number; repeatRatePct: number }[]> {
  return adminFetch("/admin/analytics/cohorts");
}

export function getFunnel(): Promise<{ stage: string; count: number }[]> {
  return adminFetch("/admin/analytics/funnel");
}
