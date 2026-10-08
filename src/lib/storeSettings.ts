import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicSettings, type PublicSettings } from "./shopApi";

// Used until the real settings arrive (and if they can't be loaded), so the
// site renders normally rather than waiting on the API.
const FALLBACK: PublicSettings = {
  storeName: "Celestial",
  currency: "INR",
  supportEmail: "",
  maintenance: false,
  cod: false,
  returnWindowDays: 0,
  referrals: false,
  referralDiscountPercent: 0,
};

export const STORE_SETTINGS_KEY = ["store-settings"];

const noopSubscribe = () => () => {};

// False on the server and during the first client render, true after.
// The page's HTML is rendered on the server without the settings, so the
// first client render must match that exactly — even if the settings have
// already been fetched by the time a late-loading part of the page hydrates.
function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useStoreSettings(): PublicSettings {
  const hydrated = useHydrated();
  const { data } = useQuery({
    queryKey: STORE_SETTINGS_KEY,
    queryFn: getPublicSettings,
    staleTime: 60_000,
    // Picks up maintenance mode being switched on or off without a reload.
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
  return hydrated && data ? data : FALLBACK;
}
