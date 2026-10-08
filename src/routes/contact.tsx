import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { apiFetch, ApiError } from "@/lib/apiClient";
import { useStoreSettings } from "@/lib/storeSettings";
import { useCustomer } from "@/shop/auth";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Celestial" },
      { name: "description", content: "Questions about an order, a formula or your protocol? Write to the Celestial team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { supportEmail } = useStoreSettings();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Signed-in customers get their details prefilled — after the page has
  // loaded, since the server renders this form without knowing who's signed in.
  const customer = useCustomer();
  useEffect(() => {
    if (!customer) return;
    setName((current) => current || customer.name);
    setEmail((current) => current || customer.email);
  }, [customer]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      await apiFetch("/contact", {
        method: "POST",
        body: { name: name.trim(), email: email.trim(), subject: subject.trim() || undefined, message: message.trim() },
      });
      setState("sent");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 400
            ? "Please check your email address and write at least a few words."
            : err.message
          : "We couldn't send your message. Check your connection and try again.",
      );
      setState("error");
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl gap-14 px-6 pb-24 pt-32 md:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="text-eyebrow">Contact</p>
          <h1 className="text-display mt-3 text-5xl">
            Write to <span className="italic text-gold">us.</span>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/60">
            Questions about an order, a formula, or which protocol fits you — send a note and the team will reply by email.
          </p>
          {supportEmail && (
            <p className="mt-8 text-sm text-ivory/60">
              Or email us directly:
              <br />
              <a href={`mailto:${supportEmail}`} className="text-gold underline-offset-4 hover:underline">
                {supportEmail}
              </a>
            </p>
          )}
        </div>

        {state === "sent" ? (
          <div role="status" className="self-start border border-gold/25 bg-midnight/40 p-8">
            <h2 className="text-display text-2xl">Message sent</h2>
            <p className="mt-3 text-sm text-ivory/60">Thank you, {name.trim().split(" ")[0]}. We'll reply to {email.trim()}.</p>
            <button
              type="button"
              onClick={() => {
                setSubject("");
                setMessage("");
                setState("idle");
              }}
              className="mt-6 border border-gold/45 px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-obsidian"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {state === "error" && (
              <div role="alert" className="border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                {error}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input required maxLength={120} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Email">
                <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </Field>
            </div>
            <Field label="Subject (optional)">
              <input maxLength={160} value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Message">
              <textarea
                required
                minLength={5}
                maxLength={5000}
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </Field>
            <button
              type="submit"
              disabled={state === "sending"}
              className="bg-gold px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-obsidian transition-colors hover:bg-champagne disabled:opacity-60"
            >
              {state === "sending" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

const inputClass = "w-full border border-gold/20 bg-midnight/60 px-3 py-2.5 text-sm text-ivory outline-none focus:border-gold/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-ivory/45">{label}</span>
      {children}
    </label>
  );
}
