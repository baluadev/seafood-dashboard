import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.addItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
