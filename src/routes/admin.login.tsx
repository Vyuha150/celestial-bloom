import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login, isAuthenticated } from "@/admin/auth";
import { ApiError } from "@/lib/apiClient";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Celestial" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) {
    void navigate({ to: "/admin" });
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm border border-border bg-midnight/40 p-8 space-y-5">
        <div>
          <p className="text-eyebrow">Console</p>
          <h1 className="text-display text-3xl mt-1">Admin sign in</h1>
        </div>

        {error && (
          <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 px-3 py-2">{error}</div>
        )}

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-obsidian border border-border text-sm outline-none focus:border-gold"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-gold text-obsidian text-sm font-medium hover:bg-gold/90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
