import { useSyncExternalStore } from "react";

// Which storefront overlay is open. Lives outside React so any component —
// e.g. an "Add to cart" button far from the header — can open the bag.
export type Panel = "search" | "cart" | "checkout" | null;

let current: Panel = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function openPanel(panel: Panel) {
  if (current === panel) return;
  current = panel;
  listeners.forEach((l) => l());
}

export function closePanel() {
  openPanel(null);
}

export function usePanel(): Panel {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
