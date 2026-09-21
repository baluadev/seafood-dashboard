'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard, ProductCardSkeleton } from '@/components/product-card';
import { useSliders, useCategories, useProducts } from '@/hooks/use-products';
import { useState } from 'react';

export default function HomePage() {
  const { data: sliders, isLoading: loadingSliders } = useSliders();
  const { data: categories, isLoading: loadingCats } = useCategories();
  const { data: hotProducts, isLoading: loadingHot } = useProducts({ isHot: true, limit: 8 });
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* ─── Hero Slider ──────────────────────────────── */}
        <section style={{ background: 'var(--gray-900)', minHeight: '520px', position: 'relative', overflow: 'hidden' }}>
          {loadingSliders ? (
            <div style={{ minHeight: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="skeleton" style={{ width: '100%', height: '520px', borderRadius: 0 }} />
            </div>
          ) : sliders?.length > 0 ? (
            <>
              {sliders.map((slider: any, i: number) => (
                <div key={slider.id} style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  inset: 0,
                  opacity: activeSlide === i ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                  minHeight: '520px',
                }}>
                  {slider.imageUrl && (
                    <Image src={slider.imageUrl} alt={slider.title} fill style={{ objectFit: 'cover', opacity: 0.45 }} priority={i === 0} />
                  )}
                  <div className="container" style={{ position: 'relative', height: '520px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ maxWidth: '560px' }}>
                      {slider.subtitle && (
                        <p style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                          {slider.subtitle}
                        </p>
                      )}
                      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1rem' }}>
                        {slider.title}
                      </h1>
                      {slider.description && (
                        <p style={{ color: 'var(--gray-300)', fontSize: '1.0625rem', marginBottom: '2rem', lineHeight: 1.7 }}>
                          {slider.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href={slider.linkUrl || '/shop'} className="btn btn-primary btn-lg">
                          Mua ngay →
                        </Link>
                        <Link href="/shop" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
                          Xem tất cả
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Dots */}
              {sliders.length > 1 && (
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
                  {sliders.map((_: any, i: number) => (
                    <button key={i} onClick={() => setActiveSlide(i)} style={{
                      width: activeSlide === i ? '2rem' : '0.5rem', height: '0.5rem',
                      borderRadius: '999px',
                      background: activeSlide === i ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                      transition: 'all 0.3s ease',
                    }} />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Fallback hero */
            <div className="container" style={{ height: '520px', display: 'flex', alignItems: 'center' }}>
              <div style={{ maxWidth: '560px' }}>
                <p style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  🌊 Tươi từ biển khơi
                </p>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1rem' }}>
                  Hải Sản Tươi Ngon<br />Giao Tận Nhà
                </h1>
                <p style={{ color: 'var(--gray-300)', fontSize: '1.0625rem', marginBottom: '2rem' }}>
                  Trực tiếp từ ngư dân — đảm bảo tươi sống, an toàn vệ sinh thực phẩm.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link href="/shop" className="btn btn-primary btn-lg">Mua ngay →</Link>
                  <Link href="/shop" className="btn btn-lg" style={{ border: '2px solid white', color: 'white' }}>Khám phá</Link>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ─── Categories ───────────────────────────────── */}
        <section className="section" style={{ background: 'var(--gray-50)' }}>
          <div className="container">
            <h2 className="section-title">Danh mục sản phẩm</h2>
            <p className="section-subtitle">Đa dạng hải sản tươi ngon từ biển</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
              {loadingCats ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)' }} />
                ))
              ) : (
                categories?.map((cat: any) => (
                  <Link key={cat.id} href={`/shop?categoryId=${cat.id}`}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem',
                      padding: '1.25rem 1rem',
                      background: 'white', borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--gray-100)',
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-100)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
                  >
                    {cat.imageUrl ? (
                      <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
                        <Image src={cat.imageUrl} alt={cat.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <span style={{ fontSize: '2.5rem' }}>🦐</span>
                    )}
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)' }}>{cat.name}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ─── Hot Products ─────────────────────────────── */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h2 className="section-title">🔥 Sản phẩm nổi bật</h2>
              <Link href="/shop?isHot=true" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
                Xem tất cả →
              </Link>
            </div>
            <p className="section-subtitle">Những sản phẩm được yêu thích nhất</p>
            <div className="product-grid">
              {loadingHot ? (
                Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              ) : (
                hotProducts?.data?.map((p: any) => <ProductCard key={p.id} product={p} />)
              )}
            </div>
          </div>
        </section>

        {/* ─── Trust Banner ─────────────────────────────── */}
        <section style={{ background: 'var(--primary)', padding: '3rem 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
              {[
                { icon: '🚚', title: 'Giao hàng nhanh', desc: 'Trong ngày tại TP.Hà Nội' },
                { icon: '✅', title: 'An toàn vệ sinh', desc: 'Kiểm định chất lượng nghiêm ngặt' },
                { icon: '💬', title: 'Hỗ trợ 24/7', desc: 'Tư vấn chọn hải sản tận tâm' },
              ].map((item) => (
                <div key={item.title} style={{ color: 'white' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.375rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', opacity: 0.85 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
