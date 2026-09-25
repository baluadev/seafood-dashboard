'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useWishlist, useToggleWishlist } from '@/hooks/use-wishlist';
import { ProductCard } from '@/components/product-card';
import type { ProductCardData } from '@/components/product-card';

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data, isLoading } = useWishlist();
  const { mutate: toggle } = useToggleWishlist();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const items = data?.items ?? [];

  return (
    <main style={{ minHeight: '100vh', background: '#f4f5f9', fontFamily: 'Roboto, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <span style={{ fontSize: '28px' }}>❤️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#191c1d' }}>
              Sản phẩm yêu thích của bạn
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#868889' }}>
              {isLoading ? 'Đang tải...' : `${items.length} sản phẩm`}
            </p>
          </div>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: '340px', background: '#fff', borderRadius: '8px', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && items.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '80px 20px', gap: '16px', background: '#fff', borderRadius: '12px',
            boxShadow: '0px 1px 3px rgba(0,0,0,0.08)',
          }}>
            <span style={{ fontSize: '56px' }}>🤍</span>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#191c1d' }}>
              Bạn chưa yêu thích sản phẩm nào
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#868889', textAlign: 'center', maxWidth: '320px' }}>
              Nhấn vào biểu tượng ❤️ trên các sản phẩm để lưu vào danh sách yêu thích của bạn.
            </p>
            <Link
              href="/shop"
              style={{
                marginTop: '8px', padding: '12px 28px', background: '#6CC51D', color: '#fff',
                borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none',
              }}
            >
              Khám phá sản phẩm →
            </Link>
          </div>
        )}

        {/* Product grid */}
        {!isLoading && items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {items.map((item) => {
              const product: ProductCardData = {
                id: item.product.id,
                title: item.product.title,
                slug: item.product.slug,
                price: item.product.price,
                discountRate: item.product.discountRate,
                thumbnailUrl: item.product.thumbnailUrl,
                unit: item.product.unit,
                isHot: item.product.isHot,
                avgRating: item.product.avgRating,
                reviewCount: item.product.reviewCount,
                stockQuantity: item.product.stockQuantity,
              };
              return <ProductCard key={item.id} product={product} />;
            })}
          </div>
        )}
      </div>
    </main>
  );
}
