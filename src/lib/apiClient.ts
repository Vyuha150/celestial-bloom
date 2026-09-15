// Base fetch wrapper for the Celestial backend API. `credentials: "include"`
// is required on every call so the guest-cart session cookie (set by the
// backend's cartSession middleware) round-trips correctly cross-origin.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  // FormData (file uploads) must be sent as-is — JSON.stringify would
  // mangle it, and the browser needs to set its own multipart boundary in
  // Content-Type, which it only does when we don't set that header ourselves.
  const isFormData = body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === "object" && data && "error" in data ? String(data.error) : "Request failed";
    throw new ApiError(res.status, message, typeof data === "object" ? (data as { details?: unknown }).details : undefined);
  }

  return data as T;
}
