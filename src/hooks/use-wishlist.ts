'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';

/** Lấy toàn bộ wishlist của user */
export function useWishlist() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.getAll,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

/** Kiểm tra 1 sản phẩm có trong wishlist không */
export function useWishlistCheck(productId: string) {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['wishlist-check', productId],
    queryFn: () => wishlistApi.check(productId),
    enabled: isAuthenticated && !!productId,
    staleTime: 30_000,
  });
}

/** Toggle thêm/bỏ yêu thích */
export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.toggle(productId),
    onSuccess: (data, productId) => {
      // Cập nhật cache check cho product này
      qc.setQueryData(['wishlist-check', productId], { isWishlisted: data.isWishlisted });
      // Invalidate toàn bộ wishlist list
      qc.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
