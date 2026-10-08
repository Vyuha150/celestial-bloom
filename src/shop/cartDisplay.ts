import { API_URL } from "@/lib/apiClient";
import { categories } from "@/data/products";
import type { CartItem } from "@/lib/shopApi";

// What to show for a cart line: the product's own uploaded photo when it has
// one, otherwise the artwork of the collection it belongs to.
export function cartItemImage(item: Pick<CartItem, "image" | "categorySlug">): string | null {
  if (item.image) return item.image.startsWith("http") ? item.image : `${API_URL}${item.image}`;
  return categories.find((c) => c.slug === item.categorySlug)?.image ?? null;
}

// "Core Performance Stack" is the product; "Quarterly Protocol" is the pack.
export function cartItemTitle(item: Pick<CartItem, "categoryTitle" | "name">): string {
  return item.categoryTitle || item.name;
}

export function cartItemVariant(item: Pick<CartItem, "categoryTitle" | "name" | "cadence">): string {
  const cadence = item.cadence.replace(/^\/\s*/, "");
  const pack = item.categoryTitle ? item.name : "";
  return [pack, cadence].filter(Boolean).join(" · ");
}
