// Lazily loads the Razorpay Checkout script once, reusing the same
// promise across calls so multiple "Buy it now" clicks don't inject it twice.
let razorpayScriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window !== "undefined" && (window as unknown as { Razorpay?: unknown }).Razorpay) {
    return Promise.resolve();
  }

  razorpayScriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script"));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  modal?: { ondismiss?: () => void };
};

export async function openRazorpayCheckout(options: RazorpayCheckoutOptions): Promise<void> {
  await loadRazorpayScript();
  const Razorpay = (window as unknown as { Razorpay: new (opts: RazorpayCheckoutOptions) => { open: () => void } }).Razorpay;
  new Razorpay(options).open();
}
