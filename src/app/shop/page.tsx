'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard, ProductCardSkeleton } from '@/components/product-card';
import { useProducts, useCategories } from '@/hooks/use-products';
import { Suspense } from 'react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page') || 1);
  const categoryId = searchParams.get('categoryId') || undefined;
  const isHot = searchParams.get('isHot') || undefined;
  const sort = searchParams.get('sort') || undefined;
  const search = searchParams.get('search') || undefined;

  const { data: categories } = useCategories();
  const { data, isLoading } = useProducts({ page, limit: 12, ...(categoryId && { categoryId }), ...(isHot && { isHot }), ...(sort && { sort }), ...(search && { search }) });

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, width: '100%', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>🦐 Tất cả sản phẩm</h1>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Sidebar Filters */}
          <aside style={{ width: '220px', flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Search */}
              <div>
                <label className="form-label">Tìm kiếm</label>
                <input className="form-input" placeholder="Nhập tên sản phẩm..." defaultValue={search} onKeyDown={e => { if (e.key === 'Enter') updateParam('search', (e.target as HTMLInputElement).value || null); }} />
              </div>

              {/* Categories */}
              <div>
                <p className="form-label" style={{ marginBottom: '0.5rem' }}>Danh mục</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <button className={`btn btn-sm ${!categoryId ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }} onClick={() => updateParam('categoryId', null)}>
                    Tất cả
                  </button>
                  {categories?.map((cat: any) => (
                    <button key={cat.id} className={`btn btn-sm ${categoryId === cat.id ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }} onClick={() => updateParam('categoryId', cat.id)}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="form-label" style={{ marginBottom: '0.5rem' }}>Sắp xếp</label>
                <select className="form-input" value={sort || ''} onChange={e => updateParam('sort', e.target.value || null)}>
                  <option value="">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>

              {/* Hot filter */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                <input type="checkbox" checked={isHot === 'true'} onChange={e => updateParam('isHot', e.target.checked ? 'true' : null)} style={{ width: '16px', height: '16px' }} />
                🔥 Sản phẩm nổi bật
              </label>
            </div>
          </aside>

          {/* Product Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {isLoading ? (
              <div className="product-grid">
                {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : data?.data?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-400)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p style={{ fontSize: '1.125rem' }}>Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
                  Hiển thị {data?.data?.length} / {data?.meta?.total} sản phẩm
                </p>
                <div className="product-grid">
                  {data?.data?.map((p: any) => <ProductCard key={p.id} product={p} />)}
                </div>
                {/* Pagination */}
                {data?.meta?.totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                    {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-outline'}`} onClick={() => updateParam('page', String(p))}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return <Suspense><ShopContent /></Suspense>;
}
