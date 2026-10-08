import { customerFetch, getStoredCustomer, logout as signOut, type Customer } from "@/shop/auth";

// There is one sign-in for the whole site (src/shop/auth.ts). An admin is
// simply a signed-in account whose role is "admin" — this module is the
// admin console's view of that same session. The server re-checks the role
// on every admin request, so nothing here is a security boundary; it only
// decides what to show.

export type AdminUser = Customer & { role: "admin" };

export function getStoredUser(): AdminUser | null {
  const user = getStoredCustomer();
  return user?.role === "admin" ? (user as AdminUser) : null;
}

export function isAuthenticated(): boolean {
  return getStoredUser() !== null;
}

export const logout = signOut;

// Same token handling (including refresh-on-401) as the storefront.
export const adminFetch = customerFetch;
