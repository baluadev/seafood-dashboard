import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi, slidersApi } from '@/lib/api-services';

// ── Edge-cached fetchers (public data → Vercel Edge proxy) ──
// Gọi /api/* trên cùng domain Vercel → cache ở edge SG (~20ms)
// Thay vì gọi thẳng Render US (~1700ms)

async function fetchEdge(path: string) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Edge fetch failed: ${res.status}`);
  return res.json();
}

export function useSliders() {
  return useQuery({
    queryKey: ['sliders'],
    queryFn: () => fetchEdge('/api/sliders'),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchEdge('/api/categories'),
    staleTime: 10 * 60 * 1000, // 10 phút
  });
}

export function useProducts(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            searchParams.set(k, String(v));
          }
        });
      }
      const qs = searchParams.toString();
      return fetchEdge(`/api/products${qs ? '?' + qs : ''}`);
    },
    staleTime: 2 * 60 * 1000, // 2 phút
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id), // By ID → direct API (less common)
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => fetchEdge(`/api/products/slug/${slug}`),
    enabled: !!slug,
    staleTime: 3 * 60 * 1000, // 3 phút
  });
}
