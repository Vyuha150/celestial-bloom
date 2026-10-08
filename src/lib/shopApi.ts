import { apiFetch } from "./apiClient";
import { customerFetch } from "@/shop/auth";

export type ApiCategory = {
  _id: string;
  slug: string;
  title: string;
  tagline: string;
  image: string;
  heroImage?: string;
  heroSprite?: { url: string; frames: number; cols: number; rows: number; aspect: number };
  items: string[];
  hero: { eyebrow: string; headline: string; italic: string; pitch: string; badge: string };
  stats: { value: string; label: string }[];
  benefits: { icon: string; title: string; body: string }[];
  infographic: { title?: string; bars: { label: string; value: number; suffix?: string }[] };
  faqs: { q: string; a: string }[];
  social?: { quote?: string; by?: string; role?: string };
};

export type ApiProduct = {
  _id: string;
  category: string;
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
};

export type CartItem = {
  product: string;
  // The pack/tier name, e.g. "Quarterly Protocol" — pair it with
  // categoryTitle when showing it, since on its own it doesn't say what it is.
  name: string;
  price: number;
  qty: number;
  lineTotal: number;
  cadence: string;
  categoryTitle: string;
  categorySlug: string;
  // First uploaded product image (an API path such as /uploads/...), if any.
  image: string | null;
  stock: number;
  // False when the item has gone out of stock or been withdrawn since it was added.
  available: boolean;
};
export type Cart = { items: CartItem[]; itemCount: number; subtotal: number };

export function getCategories(): Promise<ApiCategory[]> {
  return apiFetch("/categories");
}

export function getCategory(slug: string): Promise<ApiCategory> {
  return apiFetch(`/categories/${slug}`);
}

export function getProducts(categorySlug: string): Promise<ApiProduct[]> {
  return apiFetch(`/products?category=${encodeURIComponent(categorySlug)}`);
}

export function getCart(): Promise<Cart> {
  return customerFetch("/cart");
}

export function addToCart(productId: string, qty: number): Promise<Cart> {
  return customerFetch("/cart/items", { method: "POST", body: { productId, qty } });
}

export function updateCartItem(productId: string, qty: number): Promise<Cart> {
  return customerFetch(`/cart/items/${productId}`, { method: "PATCH", body: { qty } });
}

export function removeCartItem(productId: string): Promise<Cart> {
  return customerFetch(`/cart/items/${productId}`, { method: "DELETE" });
}

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type PaymentMethod = "razorpay" | "cod";

type CheckoutTotals = { orderId: string; orderNumber: string; subtotal: number; discount: number; total: number };

// An online order still has to be paid through Razorpay; a cash-on-delivery
// order is already placed by the time this comes back.
export type CheckoutSession =
  | (CheckoutTotals & { paymentMethod: "razorpay"; razorpayOrderId: string; amount: number; currency: string; keyId: string })
  | (CheckoutTotals & { paymentMethod: "cod" });

export function createCheckoutSession(
  customerName: string,
  customerEmail: string,
  shippingAddress: ShippingAddress,
  referralCode?: string,
  paymentMethod: PaymentMethod = "razorpay",
): Promise<CheckoutSession> {
  return customerFetch("/checkout/session", {
    method: "POST",
    body: { customerName, customerEmail, shippingAddress, referralCode: referralCode || undefined, paymentMethod },
  });
}

export function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
): Promise<{ orderId: string; orderNumber: string; status: string }> {
  return apiFetch("/checkout/verify", {
    method: "POST",
    body: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
  });
}

export function validateReferralCode(code: string, email: string): Promise<{ code: string; discountPercent: number }> {
  return customerFetch("/checkout/referral", { method: "POST", body: { code, email } });
}

// Store-wide details the storefront needs: name, support contact, and
// whether the shop is closed for maintenance or running a referral program.
export type PublicSettings = {
  storeName: string;
  currency: string;
  supportEmail: string;
  maintenance: boolean;
  // Whether cash on delivery is offered at checkout.
  cod: boolean;
  // Days after delivery a return can be requested; 0 = returns are off.
  returnWindowDays: number;
  referrals: boolean;
  referralDiscountPercent: number;
};

export function getPublicSettings(): Promise<PublicSettings> {
  return apiFetch("/settings/public");
}

export function subscribeToNewsletter(email: string, source: "journal" | "footer" | "site"): Promise<{ subscribed: true }> {
  return apiFetch("/newsletter/subscribe", { method: "POST", body: { email, source } });
}