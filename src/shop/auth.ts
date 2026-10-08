import { useSyncExternalStore } from "react";
import { apiFetch, ApiError } from "@/lib/apiClient";

// Customer (storefront) session. Kept under separate keys from the admin
// console's session (src/admin/auth.ts) so signing in to one never signs
// you in to — or out of — the other.
const ACCESS_KEY = "celestial_customer_access";
const REFRESH_KEY = "celestial_customer_refresh";
const USER_KEY = "celestial_customer_user";

export type Customer = { id: string; name: string; email: string; role: "admin" | "customer" };
type Session = { accessToken: string; refreshToken: string; user: Customer };

// This app is server-rendered (TanStack Start) — localStorage doesn't
// exist during the SSR pass, so every accessor must guard for it.
const hasStorage = () => typeof window !== "undefined";

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedUser: Customer | null = null;

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keeps other tabs in sync when one signs in or out.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// useSyncExternalStore needs a referentially stable snapshot, so the parsed
// user is cached against the raw string it came from.
export function getStoredCustomer(): Customer | null {
  if (!hasStorage()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedUser = raw ? (JSON.parse(raw) as Customer) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

export function useCustomer(): Customer | null {
  return useSyncExternalStore(subscribe, getStoredCustomer, () => null);
}

function setSession(accessToken: string, refreshToken: string, user?: Customer) {
  if (!hasStorage()) return;
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  notify();
}

function clearSession() {
  if (!hasStorage()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  notify();
}

export async function login(email: string, password: string): Promise<Customer> {
  const res = await apiFetch<Session>("/auth/login", { method: "POST", body: { email, password } });
  setSession(res.accessToken, res.refreshToken, res.user);
  return res.user;
}

export async function register(name: string, email: string, password: string): Promise<Customer> {
  const res = await apiFetch<Session>("/auth/register", { method: "POST", body: { name, email, password } });
  setSession(res.accessToken, res.refreshToken, res.user);
  return res.user;
}

export async function logout(): Promise<void> {
  const refreshToken = hasStorage() ? localStorage.getItem(REFRESH_KEY) : null;
  clearSession();
  if (refreshToken) {
    await apiFetch("/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {
      // Best-effort — the local session is already cleared either way.
    });
  }
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = hasStorage() ? localStorage.getItem(REFRESH_KEY) : null;
  if (!refreshToken) return null;

  // Coalesce concurrent 401s into a single refresh call.
  refreshInFlight ??= apiFetch<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  })
    .then((res) => {
      setSession(res.accessToken, res.refreshToken);
      return res.accessToken;
    })
    .catch(() => {
      clearSession();
      return null;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

// Authenticated request wrapper — injects the access token, and on a 401
// (expired token) transparently refreshes once and retries before giving up.
export async function customerFetch<T>(path: string, options: Parameters<typeof apiFetch>[1] = {}): Promise<T> {
  const attempt = async (): Promise<T> => {
    const token = hasStorage() ? localStorage.getItem(ACCESS_KEY) : null;
    return apiFetch<T>(path, {
      ...options,
      headers: { ...options.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
  };

  try {
    return await attempt();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) return attempt();
      clearSession();
    }
    throw err;
  }
}

export type ReturnStatus = "requested" | "approved" | "rejected" | "received" | "refunded";

export type MyOrder = {
  _id: string;
  orderNumber: string;
  items: { name: string; category: string; qty: number; price: number; lineTotal: number }[];
  itemCount: number;
  total: number;
  status: "pending" | "confirmed" | "paid" | "shipped" | "delivered" | "refunded" | "cancelled";
  paymentMethod?: "razorpay" | "cod";
  tracking?: { carrier?: string; trackingNumber?: string; trackingUrl?: string; deliveredAt?: string };
  returnRequest?: { status?: ReturnStatus; reason?: string; adminNote?: string; requestedAt?: string };
  // Set while the order can still be returned; null once it can't.
  returnableUntil: string | null;
  createdAt: string;
};

export function getMyOrders(): Promise<MyOrder[]> {
  return customerFetch("/auth/me/orders");
}

export function requestReturn(orderId: string, reason: string): Promise<MyOrder> {
  return customerFetch(`/auth/me/orders/${orderId}/return`, { method: "POST", body: { reason } });
}

// referralCode/referrals are only present while the referral program is on.
export type MyProfile = { name: string; email: string; referralCode?: string | null; referrals?: number };

export function getMyProfile(): Promise<MyProfile> {
  return customerFetch("/auth/me");
}

// Where to send someone back to after they sign in — set when a signed-out
// visitor tries to use the bag, read (once) by the account page.
const RETURN_KEY = "celestial_return_to";

export function rememberReturnPath(path: string) {
  if (hasStorage()) sessionStorage.setItem(RETURN_KEY, path);
}

export function hasReturnPath(): boolean {
  return hasStorage() && sessionStorage.getItem(RETURN_KEY) !== null;
}

export function takeReturnPath(): string | null {
  if (!hasStorage()) return null;
  const path = sessionStorage.getItem(RETURN_KEY);
  sessionStorage.removeItem(RETURN_KEY);
  // Only ever an in-site path — never navigate to an address someone else supplied.
  return path && path.startsWith("/") && !path.startsWith("//") ? path : null;
}
