import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi, slidersApi } from '@/lib/api-services';

export function useSliders() {
  return useQuery({ queryKey: ['sliders'], queryFn: slidersApi.getAll });
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: categoriesApi.getAll });
}

export function useProducts(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  });
}
