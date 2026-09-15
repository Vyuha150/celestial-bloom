import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeCartItem as apiRemoveCartItem } from "@/lib/shopApi";

const CART_KEY = ["cart"];

export function useCart() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({ queryKey: CART_KEY, queryFn: getCart });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: CART_KEY });

  const addMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) => apiAddToCart(productId, qty),
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) => apiUpdateCartItem(productId, qty),
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => apiRemoveCartItem(productId),
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    itemCount: cartQuery.data?.items.reduce((n, i) => n + i.qty, 0) ?? 0,
    addToCart: addMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    invalidate,
  };
}
