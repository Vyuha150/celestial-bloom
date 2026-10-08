import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useRequireSignIn } from "@/shop/useRequireSignIn";
import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/shop/useCart";
import { useCustomer } from "@/shop/auth";
import { usePanel, openPanel, closePanel } from "@/shop/cartUi";
import { CartDrawer } from "@/shop/CartDrawer";
import { CheckoutModal } from "@/shop/CheckoutModal";
import { SearchOverlay } from "./SearchOverlay";

/** Search, account and bag buttons for a site header, with their overlays. */
export function HeaderActions() {
  const panel = usePanel();
  const { itemCount } = useCart();
  const customer = useCustomer();
  const requireSignIn = useRequireSignIn();

  // The bag and checkout only exist for a signed-in customer; if the session
  // ends while one is open (sign-out, expiry), close it rather than show an
  // empty shell.
  const visiblePanel = panel !== "search" && !customer ? null : panel;
  useEffect(() => {
    if (panel && panel !== "search" && !customer) closePanel();
  }, [panel, customer]);

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        onClick={() => openPanel("search")}
        className="text-ivory/60 transition-colors hover:text-gold"
      >
        <Search className="h-[15px] w-[15px]" />
      </button>
      <Link
        to="/account"
        aria-label={customer ? `Account: ${customer.name}` : "Sign in"}
        title={customer ? customer.name : "Sign in"}
        className={`relative transition-colors hover:text-gold ${customer ? "text-gold" : "text-ivory/60"}`}
      >
        <User className="h-[15px] w-[15px]" />
      </Link>
      <button
        type="button"
        aria-label={`Bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        onClick={() => requireSignIn() && openPanel("cart")}
        className="relative text-ivory/60 transition-colors hover:text-gold"
      >
        <ShoppingBag className="h-[15px] w-[15px]" />
        {itemCount > 0 && (
          <span className="absolute -right-2.5 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-medium leading-none text-obsidian">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      {/* Portalled to <body>: a header with backdrop-blur becomes the
          containing block for fixed children, which would trap these
          full-screen overlays inside the header bar. */}
      {visiblePanel &&
        createPortal(
          visiblePanel === "search" ? (
            <SearchOverlay onClose={closePanel} />
          ) : visiblePanel === "cart" ? (
            <CartDrawer onClose={closePanel} onCheckout={() => openPanel("checkout")} />
          ) : (
            <CheckoutModal onClose={closePanel} />
          ),
          document.body,
        )}
    </>
  );
}
