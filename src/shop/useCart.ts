import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeCartItem as apiRemoveCartItem } from "@/lib/shopApi";
import { useCustomer } from "./auth";

// The bag belongs to an account, so there is nothing to load until someone
// is signed in. Keyed by customer so one person's bag is never shown to the
// next person who signs in on the same browser.
export function useCart() {
  const queryClient = useQueryClient();
  const customer = useCustomer();
  const key = ["cart", customer?.id ?? null];

  const cartQuery = useQuery({ queryKey: key, queryFn: getCart, enabled: Boolean(customer) });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["cart"] });

  const addMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) => apiAddToCart(productId, qty),
    onSuccess: (cart) => queryClient.setQueryData(key, cart),
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) => apiUpdateCartItem(productId, qty),
    onSuccess: (cart) => queryClient.setQueryData(key, cart),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => apiRemoveCartItem(productId),
    onSuccess: (cart) => queryClient.setQueryData(key, cart),
  });

  const cart = customer ? cartQuery.data : undefined;

  return {
    signedIn: Boolean(customer),
    cart,
    isLoading: Boolean(customer) && cartQuery.isLoading,
    isError: Boolean(customer) && cartQuery.isError,
    itemCount: cart?.itemCount ?? 0,
    addToCart: addMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    refetch: cartQuery.refetch,
    invalidate,
  };
}
