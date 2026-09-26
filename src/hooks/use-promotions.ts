import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionsApi, Promotion } from '@/lib/api-services';

const QUERY_KEY = ['promotions'];

export function usePromotions() {
  return useQuery<Promotion[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/promotions');
      if (!res.ok) throw new Error('Failed to fetch promotions');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}

export function usePromotionsAdmin() {
  return useQuery<Promotion[]>({
    queryKey: [...QUERY_KEY, 'admin'],
    queryFn: promotionsApi.getAllAdmin,
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Promotion>) => promotionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Promotion> }) =>
      promotionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => promotionsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
