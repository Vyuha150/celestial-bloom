import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useStoreSettings } from "@/lib/storeSettings";
import { REFERRAL_STORAGE_KEY } from "@/shop/referral";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Celestial Bloom" },
      { name: "description", content: "Celestial Bloom is a premium e-commerce platform for scientifically extracted, luxury wellness products." },
      { name: "author", content: "Celestial Bloom" },
      { property: "og:title", content: "Celestial Bloom" },
      { property: "og:description", content: "Celestial Bloom is a premium e-commerce platform for scientifically extracted, luxury wellness products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Celestial Bloom" },
      { name: "twitter:description", content: "Celestial Bloom is a premium e-commerce platform for scientifically extracted, luxury wellness products." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Reports each storefront page view to the API — this is what feeds the
// admin console's traffic-source and funnel analytics. Admin pages aren't
// counted, and a failed report is ignored: analytics must never break a page.
function PageViewTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const params = new URLSearchParams(window.location.search);
    // Arrived through a friend's referral link (?ref=CODE) — keep the code so
    // checkout can offer it, even if they browse for a while first.
    const ref = params.get("ref");
    if (ref && /^[A-Za-z0-9]{4,20}$/.test(ref)) {
      try {
        localStorage.setItem(REFERRAL_STORAGE_KEY, ref.toUpperCase());
      } catch {
        // Storage unavailable (private mode) — they can still type the code.
      }
    }
    const utmSource = params.get("utm_source") ?? undefined;
    // A referrer on our own site (e.g. after a reload) isn't a traffic source.
    const external = document.referrer && !document.referrer.startsWith(window.location.origin);
    void apiFetch("/track/pageview", {
      method: "POST",
      body: { path: pathname, referrer: external ? document.referrer : undefined, utmSource },
    }).catch(() => {});
  }, [pathname]);

  return null;
}

// While maintenance mode is on (Admin → Settings), every storefront page is
// replaced by a holding page. The admin console stays reachable so the
// store can be reopened.
function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { maintenance, storeName, supportEmail } = useStoreSettings();

  if (!maintenance || pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian px-6 text-center text-ivory">
      <div className="max-w-md">
        <p className="text-[13px] tracking-[0.42em] text-gold">{storeName.toUpperCase()}</p>
        <h1 className="text-display mt-8 text-4xl">We'll be back shortly</h1>
        <p className="mt-5 text-sm leading-relaxed text-ivory/60">
          The store is closed for a short while as we make some improvements. Please check back soon.
        </p>
        {supportEmail && (
          <p className="mt-6 text-xs text-ivory/50">
            Need help with an order?{" "}
            <a href={`mailto:${supportEmail}`} className="text-gold underline-offset-4 hover:underline">
              {supportEmail}
            </a>
          </p>
        )}
      </div>
    </main>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <PageViewTracker />
      <MaintenanceGate>
        <Outlet />
      </MaintenanceGate>
    </QueryClientProvider>
  );
}
