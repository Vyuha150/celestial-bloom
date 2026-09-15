import { apiFetch, ApiError } from "@/lib/apiClient";

const ACCESS_KEY = "celestial_admin_access";
const REFRESH_KEY = "celestial_admin_refresh";
const USER_KEY = "celestial_admin_user";

export type AdminUser = { id: string; name: string; email: string; role: "admin" };

// This app is server-rendered (TanStack Start) — localStorage doesn't
// exist during the SSR pass, so every accessor must guard for it.
const hasStorage = () => typeof window !== "undefined";

export function getAccessToken(): string | null {
  return hasStorage() ? localStorage.getItem(ACCESS_KEY) : null;
}

export function getRefreshToken(): string | null {
  return hasStorage() ? localStorage.getItem(REFRESH_KEY) : null;
}

export function getStoredUser(): AdminUser | null {
  if (!hasStorage()) return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AdminUser) : null;
}

function setSession(accessToken: string, refreshToken: string, user?: AdminUser) {
  if (!hasStorage()) return;
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (!hasStorage()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await apiFetch<{ accessToken: string; refreshToken: string; user: AdminUser }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  if (res.user.role !== "admin") throw new ApiError(403, "This account does not have admin access");
  setSession(res.accessToken, res.refreshToken, res.user);
  return res.user;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  clearSession();
  if (refreshToken) {
    await apiFetch("/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {
      // Best-effort — the local session is already cleared either way.
    });
  }
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
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
export async function adminFetch<T>(path: string, options: Parameters<typeof apiFetch>[1] = {}): Promise<T> {
  const attempt = async (): Promise<T> => {
    const token = getAccessToken();
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
    }
    throw err;
  }
}
