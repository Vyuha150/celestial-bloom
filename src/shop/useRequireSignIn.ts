import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getStoredCustomer, rememberReturnPath } from "./auth";
import { closePanel } from "./cartUi";

// The bag belongs to an account. Anything that needs it calls this first:
// it returns true for a signed-in customer; otherwise it sends the visitor
// to the sign-in page, remembering where to bring them back to.
export function useRequireSignIn() {
  const navigate = useNavigate();

  return useCallback((): boolean => {
    if (getStoredCustomer()) return true;
    rememberReturnPath(window.location.pathname + window.location.search);
    closePanel();
    void navigate({ to: "/account" });
    return false;
  }, [navigate]);
}
