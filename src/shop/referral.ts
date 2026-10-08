// A referral code picked up from a friend's link (?ref=CODE) is kept here
// until checkout, where it is offered as the default.
export const REFERRAL_STORAGE_KEY = "celestial_referral_code";

export function getStoredReferralCode(): string {
  try {
    return localStorage.getItem(REFERRAL_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function clearStoredReferralCode() {
  try {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
  } catch {
    // Nothing stored, nothing to clear.
  }
}
