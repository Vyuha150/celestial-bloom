// The store sells in Indian rupees — Razorpay charges INR, so every price
// shown must be in the same currency. Use this everywhere a price is rendered.
export function formatMoney(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
