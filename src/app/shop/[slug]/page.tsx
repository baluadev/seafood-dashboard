'use client';

import { use } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProductBySlug } from '@/hooks/use-products';
import { useAddToCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { ReviewsSection } from '@/components/reviews-section';

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { mutate: addToCart, isPending } = useAddToCart();
  const { isAuthenticated } = useAuthStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [addedMsg, setAddedMsg] = useState('');

  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '2rem', width: '70%' }} />
            <div className="skeleton" style={{ height: '1rem', width: '40%' }} />
            <div className="skeleton" style={{ height: '1.5rem', width: '50%' }} />
            <div className="skeleton" style={{ height: '3rem', borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (isError || !product) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '3rem' }}>😞</div>
        <h2>Không tìm thấy sản phẩm</h2>
        <Link href="/shop" className="btn btn-primary">← Quay lại cửa hàng</Link>
      </main>
      <Footer />
    </div>
  );

  const salePrice = Math.round(product.price * (1 - product.discountRate));
  const hasDiscount = product.discountRate > 0;
  const images = product.images?.length > 0 ? product.images : [];
  const mainImage = images[activeImg]?.url || product.thumbnailUrl;

  function handleAddToCart() {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    addToCart({ productId: product.id, quantity: qty }, {
      onSuccess: () => {
        setAddedMsg('✅ Đã thêm vào giỏ!');
        setTimeout(() => setAddedMsg(''), 2000);
      },
    });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--primary)' }}>Trang chủ</Link>
          <span>/</span>
          <Link href="/shop" style={{ color: 'var(--primary)' }}>Sản phẩm</Link>
          {product.category && <><span>/</span><Link href={`/shop?categoryId=${product.category.id}`} style={{ color: 'var(--primary)' }}>{product.category.name}</Link></>}
          <span>/</span>
          <span style={{ color: 'var(--gray-700)', fontWeight: 600 }}>{product.title}</span>
        </nav>

        <div className="grid-2col" style={{ alignItems: 'start' }}>
          {/* Image Gallery */}
          <div>
            <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--gray-50)', marginBottom: '1rem' }}>
              {mainImage ? (
                <Image src={mainImage} alt={product.title} fill style={{ objectFit: 'cover' }} priority />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>🦐</div>
              )}
              {hasDiscount && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--error)', color: 'white', borderRadius: 'var(--radius-full)', padding: '0.25rem 0.75rem', fontWeight: 700, fontSize: '0.875rem' }}>
                  -{Math.round(product.discountRate * 100)}%
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {images.map((img: any, i: number) => (
                  <button key={img.id} onClick={() => setActiveImg(i)} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: `2px solid ${activeImg === i ? 'var(--primary)' : 'var(--gray-200)'}`, position: 'relative', flexShrink: 0 }}>
                    <Image src={img.url} alt={`${product.title} ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {product.isHot && <span className="badge-hot" style={{ alignSelf: 'flex-start' }}>🔥 Đang hot</span>}
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.3 }}>{product.title}</h1>

            {product.avgRating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < Math.round(product.avgRating) ? 'var(--warning)' : 'var(--gray-300)', fontSize: '1.125rem' }}>★</span>
                  ))}
                </div>
                <span style={{ fontWeight: 600 }}>{product.avgRating.toFixed(1)}</span>
                <span style={{ color: 'var(--gray-400)' }}>({product.reviewCount} đánh giá)</span>
              </div>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
                {formatPrice(salePrice)}
                <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--gray-500)' }}>/{product.unit}</span>
              </span>
              {hasDiscount && <span style={{ fontSize: '1.125rem', color: 'var(--gray-400)', textDecoration: 'line-through' }}>{formatPrice(product.price)}</span>}
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.stockQuantity > 0 ? 'var(--success)' : 'var(--error)', flexShrink: 0 }} />
              {product.stockQuantity > 0 ? (
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>Còn hàng ({product.stockQuantity} {product.unit})</span>
              ) : (
                <span style={{ color: 'var(--error)', fontWeight: 600 }}>Hết hàng</span>
              )}
            </div>

            {/* Category */}
            {product.category && (
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                Danh mục: <Link href={`/shop?categoryId=${product.category.id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{product.category.name}</Link>
              </div>
            )}

            {/* Qty + Add to Cart */}
            {product.stockQuantity > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Số lượng:</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '0.5rem 1rem', fontWeight: 700, fontSize: '1.125rem', background: 'var(--gray-50)', transition: 'background 0.2s' }}>−</button>
                    <span style={{ padding: '0.5rem 1.25rem', fontWeight: 700, minWidth: '48px', textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))} style={{ padding: '0.5rem 1rem', fontWeight: 700, fontSize: '1.125rem', background: 'var(--gray-50)', transition: 'background 0.2s' }}>+</button>
                  </div>
                </div>

                {addedMsg && <div className="alert alert-success">{addedMsg}</div>}

                <button className="btn btn-accent btn-lg" onClick={handleAddToCart} disabled={isPending} style={{ justifyContent: 'center' }}>
                  {isPending ? 'Đang thêm...' : `🛒 Thêm vào giỏ — ${formatPrice(salePrice * qty)}`}
                </button>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>Mô tả sản phẩm</h3>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '0.9375rem', whiteSpace: 'pre-line' }}>{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <ReviewsSection slug={slug} productId={product.id} />
      </main>
      <Footer />
    </div>
  );
}
