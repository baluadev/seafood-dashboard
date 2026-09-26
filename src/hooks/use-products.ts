import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi, slidersApi } from '@/lib/api-services';

export function useSliders() {
  return useQuery({
    queryKey: ['sliders'],
    queryFn: slidersApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 phút — backend cache 15 phút
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 phút — backend cache 30 phút
  });
}

export function useProducts(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 phút — backend cache 5 phút
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000, // 3 phút — backend cache 10 phút
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 3 * 60 * 1000, // 3 phút — backend cache 10 phút
  });
}
