import { apiFetch } from "./apiClient";

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

export type CartItem = { product: string; name: string; price: number; qty: number };
export type Cart = { sessionId: string; items: CartItem[]; subtotal: number };

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
  return apiFetch("/cart");
}

export function addToCart(productId: string, qty: number): Promise<Cart> {
  return apiFetch("/cart/items", { method: "POST", body: { productId, qty } });
}

export function updateCartItem(productId: string, qty: number): Promise<Cart> {
  return apiFetch(`/cart/items/${productId}`, { method: "PATCH", body: { qty } });
}

export function removeCartItem(productId: string): Promise<Cart> {
  return apiFetch(`/cart/items/${productId}`, { method: "DELETE" });
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

export type CheckoutSession = {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export function createCheckoutSession(
  customerName: string,
  customerEmail: string,
  shippingAddress: ShippingAddress,
): Promise<CheckoutSession> {
  return apiFetch("/checkout/session", { method: "POST", body: { customerName, customerEmail, shippingAddress } });
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
