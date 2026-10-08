import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/shopApi";
import { ApiError } from "@/lib/apiClient";

type Props = {
  source: "journal" | "footer";
  placeholder?: string;
  buttonLabel?: string;
  /** Classes for the row holding the input and button. */
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

/** Newsletter sign-up: stores the address and confirms inline. */
export function NewsletterForm({
  source,
  placeholder = "Email address",
  buttonLabel = "Join",
  className = "",
  inputClassName = "",
  buttonClassName = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const inputId = `newsletter-${source}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      await subscribeToNewsletter(email.trim(), source);
      setState("done");
      setEmail("");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 400
            ? "Please enter a valid email address."
            : err.message
          : "Couldn't sign you up just now. Please try again.",
      );
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p role="status" className="text-sm text-gold">
        You're on the list. Thank you.
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={submit} className={className} noValidate={false}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder={placeholder}
          className={inputClassName}
        />
        <button type="submit" disabled={state === "sending"} className={`${buttonClassName} disabled:opacity-50`}>
          {state === "sending" ? "Joining…" : buttonLabel}
        </button>
      </form>
      {state === "error" && (
        <p role="alert" className="mt-2 text-xs text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
