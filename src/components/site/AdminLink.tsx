import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { useCustomer } from "@/shop/auth";

/** Link to the admin console — rendered only for a signed-in admin account. */
export function AdminLink({ className = "", iconClassName = "h-3.5 w-3.5" }: { className?: string; iconClassName?: string }) {
  const customer = useCustomer();
  if (customer?.role !== "admin") return null;

  return (
    <Link to="/admin" title="Admin console" aria-label="Admin console" className={className}>
      <Shield className={iconClassName} />
    </Link>
  );
}
