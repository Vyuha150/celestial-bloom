// Mock admin data store (frontend only). Replace with real backend later.
export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "live" | "draft" | "archived";
  sales30d: number;
};

export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  total: number;
  items: number;
  status: "paid" | "pending" | "shipped" | "refunded" | "cancelled";
  date: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  lifetime: number;
  tier: "Founder" | "Member" | "Trial";
  joined: string;
};

export type AdminPage = {
  slug: string;
  title: string;
  route: string;
  status: "published" | "draft";
  updated: string;
};

export const adminProducts: AdminProduct[] = [
  { id: "p_001", name: "NMN Elixir 1000", category: "Core", price: 248, stock: 142, status: "live", sales30d: 318 },
  { id: "p_002", name: "NAD+ Gummies", category: "Gummies", price: 96, stock: 64, status: "live", sales30d: 412 },
  { id: "p_003", name: "Mitochondrial Matrix", category: "Bio", price: 184, stock: 28, status: "live", sales30d: 201 },
  { id: "p_004", name: "Telomere Reserve", category: "Luxury", price: 720, stock: 9, status: "live", sales30d: 47 },
  { id: "p_005", name: "Aurora Powder", category: "Powders", price: 88, stock: 0, status: "draft", sales30d: 0 },
  { id: "p_006", name: "Solstice Beverage", category: "Beverages", price: 64, stock: 311, status: "live", sales30d: 588 },
  { id: "p_007", name: "Genome Diagnostic", category: "Diagnostic", price: 420, stock: 22, status: "live", sales30d: 73 },
];

export const adminOrders: AdminOrder[] = [
  { id: "ORD-29481", customer: "Eleanor Vance", email: "eleanor@vance.io", total: 482, items: 3, status: "paid", date: "2026-05-13" },
  { id: "ORD-29480", customer: "Marcus Reid", email: "m.reid@helix.co", total: 248, items: 1, status: "shipped", date: "2026-05-13" },
  { id: "ORD-29479", customer: "Yuki Tanaka", email: "yuki.t@nori.jp", total: 1124, items: 5, status: "paid", date: "2026-05-12" },
  { id: "ORD-29478", customer: "Sofia Marquez", email: "sofia@studio.es", total: 96, items: 1, status: "pending", date: "2026-05-12" },
  { id: "ORD-29477", customer: "Aiden Kohl", email: "aiden@kohlre.com", total: 720, items: 1, status: "paid", date: "2026-05-11" },
  { id: "ORD-29476", customer: "Priya Anand", email: "p.anand@orbit.in", total: 184, items: 1, status: "refunded", date: "2026-05-10" },
  { id: "ORD-29475", customer: "Lucas Bauer", email: "lb@meridian.de", total: 312, items: 2, status: "shipped", date: "2026-05-10" },
  { id: "ORD-29474", customer: "Nora Hess", email: "nora@hess.ch", total: 64, items: 1, status: "cancelled", date: "2026-05-09" },
];

export const adminCustomers: AdminCustomer[] = [
  { id: "u_01", name: "Eleanor Vance", email: "eleanor@vance.io", orders: 14, lifetime: 6240, tier: "Founder", joined: "2024-08-12" },
  { id: "u_02", name: "Marcus Reid", email: "m.reid@helix.co", orders: 6, lifetime: 1488, tier: "Member", joined: "2025-02-04" },
  { id: "u_03", name: "Yuki Tanaka", email: "yuki.t@nori.jp", orders: 22, lifetime: 9876, tier: "Founder", joined: "2024-05-19" },
  { id: "u_04", name: "Sofia Marquez", email: "sofia@studio.es", orders: 1, lifetime: 96, tier: "Trial", joined: "2026-05-12" },
  { id: "u_05", name: "Aiden Kohl", email: "aiden@kohlre.com", orders: 4, lifetime: 2880, tier: "Member", joined: "2025-09-01" },
  { id: "u_06", name: "Priya Anand", email: "p.anand@orbit.in", orders: 9, lifetime: 1656, tier: "Member", joined: "2025-01-22" },
];

export const adminPages: AdminPage[] = [
  { slug: "home", title: "Home — Landing", route: "/", status: "published", updated: "2026-05-13" },
  { slug: "products", title: "Products Index", route: "/products", status: "published", updated: "2026-05-12" },
  { slug: "brand-new", title: "Brand New", route: "/brand-new", status: "published", updated: "2026-05-12" },
  { slug: "universe", title: "Customization", route: "/universe", status: "published", updated: "2026-05-13" },
  { slug: "science", title: "Science", route: "/science", status: "published", updated: "2026-05-11" },
  { slug: "protocol", title: "Protocol", route: "/protocol", status: "published", updated: "2026-05-11" },
  { slug: "journal", title: "Journal", route: "/journal", status: "published", updated: "2026-05-10" },
];

export const revenueSeries = [
  { d: "Apr 14", revenue: 8420, orders: 42 },
  { d: "Apr 21", revenue: 9180, orders: 48 },
  { d: "Apr 28", revenue: 11240, orders: 61 },
  { d: "May 05", revenue: 12880, orders: 68 },
  { d: "May 12", revenue: 15420, orders: 81 },
];

export const categoryMix = [
  { name: "Core", value: 34 },
  { name: "Gummies", value: 22 },
  { name: "Beverages", value: 18 },
  { name: "Bio", value: 14 },
  { name: "Luxury", value: 8 },
  { name: "Diagnostic", value: 4 },
];

export const trafficSources = [
  { src: "Direct", v: 38 },
  { src: "Organic", v: 27 },
  { src: "Referral", v: 18 },
  { src: "Email", v: 11 },
  { src: "Social", v: 6 },
];
