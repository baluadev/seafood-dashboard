'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProductBySlug, useProducts } from '@/hooks/use-products';
import { useAddToCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { ReviewsSection } from '@/components/reviews-section';
import { ProductCard, ProductCardSkeleton } from '@/components/product-card';

/* ── SVG Icons (from Figma) ── */
const ChevronIcon = () => (
  <svg width="5" height="8" viewBox="0 0 5 8" fill="none"><path d="M0.5 0.5L4.5 4L0.5 7.5" stroke="#868889" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 11.6667 11.0833" fill="none">
    <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z" fill={filled ? '#6CC51D' : '#E0E0E0'}/>
  </svg>
);
const FlashIcon = () => (
  <svg width="9" height="12" viewBox="0 0 9 12" fill="none"><path d="M0 6.75H3.375L1.125 12L9 5.25H5.625L7.875 0L0 6.75Z" fill="white"/></svg>
);
const OrganicIcon = () => (
  <svg width="10" height="10" viewBox="0 0 9.91401 9.91218" fill="none">
    <path d="M1.4 8.51218C0.9625 8.07468 0.619792 7.56912 0.371875 6.99551C0.123958 6.4219 0 5.82885 0 5.21635C0 4.60385 0.116667 3.99864 0.35 3.40072C0.583333 2.8028 0.9625 2.24135 1.4875 1.71635C1.82778 1.37607 2.24826 1.0844 2.74896 0.841346C3.24965 0.598291 3.84271 0.406277 4.52812 0.265304C5.21354 0.124332 5.99618 0.0392628 6.87604 0.0100962C7.7559 -0.0190705 8.74028 0.0149573 9.82917 0.112179C9.90694 1.14274 9.93125 2.09065 9.90208 2.95593C9.87292 3.82121 9.79271 4.60142 9.66146 5.29655C9.53021 5.99169 9.34549 6.59933 9.10729 7.11947C8.8691 7.63961 8.575 8.07468 8.225 8.42468C7.70972 8.93996 7.16285 9.31669 6.58437 9.55489C6.0059 9.79308 5.41528 9.91218 4.8125 9.91218C4.18056 9.91218 3.56319 9.78822 2.96042 9.5403C2.35764 9.29239 1.8375 8.94968 1.4 8.51218Z" fill="#356B00"/>
  </svg>
);
const ShipIcon = () => (
  <svg width="17" height="12" viewBox="0 0 16.5 12" fill="none">
    <path d="M3.75 12C3.125 12 2.59375 11.7812 2.15625 11.3438C1.71875 10.9062 1.5 10.375 1.5 9.75H0V1.5C0 1.0875 0.146875 0.734375 0.440625 0.440625C0.734375 0.146875 1.0875 0 1.5 0H12V3H14.25L16.5 6V9.75H15C15 10.375 14.7812 10.9062 14.3438 11.3438C13.9062 11.7812 13.375 12 12.75 12C12.125 12 11.5938 11.7812 11.1562 11.3438C10.7188 10.9062 10.5 10.375 10.5 9.75H6C6 10.375 5.78125 10.9062 5.34375 11.3438C4.90625 11.7812 4.375 12 3.75 12ZM3.75 10.5C3.9625 10.5 4.14063 10.4281 4.28438 10.2844C4.42813 10.1406 4.5 9.9625 4.5 9.75C4.5 9.5375 4.42813 9.35937 4.28438 9.21562C4.14063 9.07187 3.9625 9 3.75 9C3.5375 9 3.35938 9.07187 3.21563 9.21562C3.07188 9.35937 3 9.5375 3 9.75C3 9.9625 3.07188 10.1406 3.21563 10.2844C3.35938 10.4281 3.5375 10.5 3.75 10.5ZM1.5 8.25H2.1C2.3125 8.025 2.55625 7.84375 2.83125 7.70625C3.10625 7.56875 3.4125 7.5 3.75 7.5C4.0875 7.5 4.39375 7.56875 4.66875 7.70625C4.94375 7.84375 5.1875 8.025 5.4 8.25H10.5V1.5H1.5V8.25ZM12.75 10.5C12.9625 10.5 13.1406 10.4281 13.2844 10.2844C13.4281 10.1406 13.5 9.9625 13.5 9.75C13.5 9.5375 13.4281 9.35937 13.2844 9.21562C13.1406 9.07187 12.9625 9 12.75 9C12.5375 9 12.3594 9.07187 12.2156 9.21562C12.0719 9.35937 12 9.5375 12 9.75C12 9.9625 12.0719 10.1406 12.2156 10.2844C12.3594 10.4281 12.5375 10.5 12.75 10.5ZM12 6.75H15.1875L13.5 4.5H12V6.75Z" fill="#356B00"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="16" viewBox="0 0 13.5 15.75" fill="none">
    <path d="M4.5 1.5V0H9V1.5H4.5ZM6 9.75H7.5V5.25H6V9.75ZM6.75 15.75C5.825 15.75 4.95313 15.5719 4.13438 15.2156C3.31563 14.8594 2.6 14.375 1.9875 13.7625C1.375 13.15 0.890625 12.4344 0.534375 11.6156C0.178125 10.7969 0 9.925 0 9C0 8.075 0.178125 7.20313 0.534375 6.38438C0.890625 5.56563 1.375 4.85 1.9875 4.2375C2.6 3.625 3.31563 3.14062 4.13438 2.78437C4.95313 2.42812 5.825 2.25 6.75 2.25C7.525 2.25 8.26875 2.375 8.98125 2.625C9.69375 2.875 10.3625 3.2375 10.9875 3.7125L12.0375 2.6625L13.0875 3.7125L12.0375 4.7625C12.5125 5.3875 12.875 6.05625 13.125 6.76875C13.375 7.48125 13.5 8.225 13.5 9C13.5 9.925 13.3219 10.7969 12.9656 11.6156C12.6094 12.4344 12.125 13.15 11.5125 13.7625C10.9 14.375 10.1844 14.8594 9.36563 15.2156C8.54688 15.5719 7.675 15.75 6.75 15.75ZM6.75 14.25C8.2 14.25 9.4375 13.7375 10.4625 12.7125C11.4875 11.6875 12 10.45 12 9C12 7.55 11.4875 6.3125 10.4625 5.2875C9.4375 4.2625 8.2 3.75 6.75 3.75C5.3 3.75 4.0625 4.2625 3.0375 5.2875C2.0125 6.3125 1.5 7.55 1.5 9C1.5 10.45 2.0125 11.6875 3.0375 12.7125C4.0625 13.7375 5.3 14.25 6.75 14.25Z" fill="#868889"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="17" height="13" viewBox="0 0 16.5 12" fill="none">
    <path d="M8.25 6C8.8625 6 9.38542 5.78125 9.81875 5.34375C10.2521 4.90625 10.4688 4.3875 10.4688 3.7875C10.4688 3.175 10.2521 2.64583 9.81875 2.195C9.38542 1.74417 8.8625 1.51875 8.25 1.51875C7.6375 1.51875 7.11458 1.74417 6.68125 2.195C6.24792 2.64583 6.03125 3.175 6.03125 3.7875C6.03125 4.3875 6.24792 4.90625 6.68125 5.34375C7.11458 5.78125 7.6375 6 8.25 6ZM8.25 12C6.6125 10.6375 5.38542 9.37083 4.56875 8.2C3.75208 7.02917 3.34375 5.9625 3.34375 5C3.34375 3.5 3.82708 2.27083 4.79375 1.3125C5.76042 0.354167 6.9125 -0.125 8.25 -0.125C9.5875 -0.125 10.7396 0.354167 11.7063 1.3125C12.6729 2.27083 13.1563 3.5 13.1563 5C13.1563 5.9625 12.748 7.02917 11.9313 8.2C11.1146 9.37083 9.8875 10.6375 8.25 12Z" fill="#356B00"/>
  </svg>
);
const CartAddIcon = () => (
  <svg width="18" height="18" viewBox="0 0 13.3333 16.6667" fill="none">
    <path d="M1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V5C0 4.54167 0.163194 4.14931 0.489583 3.82292C0.815972 3.49653 1.20833 3.33333 1.66667 3.33333H3.33333C3.33333 2.41667 3.65972 1.63194 4.3125 0.979167C4.96528 0.326389 5.75 0 6.66667 0C7.58333 0 8.36806 0.326389 9.02083 0.979167C9.67361 1.63194 10 2.41667 10 3.33333H11.6667C12.125 3.33333 12.5174 3.49653 12.8438 3.82292C13.1701 4.14931 13.3333 4.54167 13.3333 5V15C13.3333 15.4583 13.1701 15.8507 12.8438 16.1771C12.5174 16.5035 12.125 16.6667 11.6667 16.6667H1.66667ZM1.66667 15H11.6667V5H10V6.66667C10 6.90278 9.92014 7.10069 9.76042 7.26042C9.60069 7.42014 9.40278 7.5 9.16667 7.5C8.93056 7.5 8.73264 7.42014 8.57292 7.26042C8.41319 7.10069 8.33333 6.90278 8.33333 6.66667V5H5V6.66667C5 6.90278 4.92014 7.10069 4.76042 7.26042C4.60069 7.42014 4.40278 7.5 4.16667 7.5C3.93056 7.5 3.73264 7.42014 3.57292 7.26042C3.41319 7.10069 3.33333 6.90278 3.33333 6.66667V5H1.66667V15ZM5 3.33333H8.33333C8.33333 2.875 8.17014 2.48264 7.84375 2.15625C7.51736 1.82986 7.125 1.66667 6.66667 1.66667C6.20833 1.66667 5.81597 1.82986 5.48958 2.15625C5.16319 2.48264 5 2.875 5 3.33333Z" fill="white"/>
  </svg>
);

/* ── Countdown Timer ── */
function CountdownTimer({ endMs }: { endMs: number }) {
  const calc = () => {
    const diff = Math.max(0, endMs - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [endMs]);
  return <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#191c1d', letterSpacing: '0.05em' }}>{time}</span>;
}

/* ── Format helpers ── */
function fmtPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

/* ── Tabs ── */
const TABS = ['Thông tin sản phẩm & Dinh dưỡng', 'Nguồn gốc & Chứng nhận VietGAP', 'Gợi ý món ngon & Bảo quản', 'Đánh giá từ khách hàng'];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { mutate: addToCart, isPending } = useAddToCart();
  const { isAuthenticated } = useAuthStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [addedMsg, setAddedMsg] = useState('');
  const SALE_END_MS = Date.now() + 4 * 3600000 + 22 * 60000 + 6000; // demo: 4h22m06s

  /* Related products */
  const { data: relatedRes } = useProducts(
    product?.category?.id ? { categoryId: product.category.id, limit: 4 } : undefined
  );
  const related = (relatedRes?.data ?? []).filter((p: { id: string }) => p.id !== product?.id).slice(0, 4);

  /* Loading */
  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA', fontFamily: "Roboto, sans-serif" }}>
      <Header />
      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '80px 40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '24px', marginTop: '24px' }}>
          <div style={{ height: '486px', background: '#F4F5F9', borderRadius: '8px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[200, 80, 60, 120, 60, 52, 52].map((w, i) => (
              <div key={i} style={{ height: i === 0 ? '40px' : '16px', width: `${w}px`, background: '#F4F5F9', borderRadius: '4px' }} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (isError || !product) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA', fontFamily: "Roboto, sans-serif" }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '3rem' }}>😞</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Không tìm thấy sản phẩm</h2>
        <Link href="/shop" style={{ background: '#6CC51D', color: '#fff', padding: '10px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}>
          ← Quay lại cửa hàng
        </Link>
      </main>
      <Footer />
    </div>
  );

  const salePrice = product.discountRate > 0 ? Math.round(product.price * (1 - product.discountRate)) : product.price;
  const hasDiscount = product.discountRate > 0;
  const images: { url: string }[] = product.images?.length > 0 ? product.images : [];
  const mainImage = images[activeImg]?.url || product.thumbnailUrl;

  function handleAddToCart(e?: React.MouseEvent) {
    e?.preventDefault();
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    addToCart({ productId: product.id, quantity: qty }, {
      onSuccess: () => { setAddedMsg('✅ Đã thêm vào giỏ!'); setTimeout(() => setAddedMsg(''), 2500); },
    });
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    addToCart({ productId: product.id, quantity: qty }, { onSuccess: () => router.push('/cart') });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA', fontFamily: "Roboto, sans-serif" }}>
      <Header />
      <div style={{ paddingTop: '80px' }}>

        {/* ── Container ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 40px' }}>

          {/* ── Breadcrumb ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '12px 0', flexWrap: 'wrap' }}>
            {[
              { label: 'Trang chủ', href: '/' },
              ...(product.category ? [{ label: product.category.name, href: `/shop?categoryId=${product.category.id}` }] : []),
              { label: product.title, href: null },
            ].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {i > 0 && <span style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}><ChevronIcon /></span>}
                {item.href ? (
                  <Link href={item.href} style={{ fontSize: '12px', fontWeight: 500, color: '#868889', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d', maxWidth: '448px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* ── Hero: 12-col grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '24px', paddingBottom: '32px', alignItems: 'start' }}>

            {/* ─── Col 1: Image Gallery ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Main image */}
              <div style={{ position: 'relative', height: '486px', background: '#F4F5F9', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {mainImage ? (
                  <Image src={mainImage} alt={product.title} fill style={{ objectFit: 'cover' }} priority unoptimized />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>🛒</div>
                )}

                {/* Floating badges top-left */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {hasDiscount && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ba1a1a', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '4px 12px' }}>
                      <FlashIcon />
                      <span style={{ fontSize: '12px', color: '#fff', fontWeight: 500 }}>
                        -{Math.round(product.discountRate * 100)}% Flash Sale
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#EBFFD7', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '4px 12px' }}>
                    <OrganicIcon />
                    <span style={{ fontSize: '12px', color: '#356b00', fontWeight: 500 }}>100% Organic</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '2px 12px' }}>
                    <span style={{ fontSize: '10px' }}>✓</span>
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#191c1d' }}>Chuẩn VietGAP</span>
                  </div>
                </div>

                {/* Thumbnail strip bottom */}
                {images.length > 0 && (
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', borderRadius: '8px', padding: '4px', display: 'flex', gap: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                      {images.map((img, i) => (
                        <button key={i} onClick={() => setActiveImg(i)} style={{
                          width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', position: 'relative',
                          border: 'none', padding: '2px', background: '#F4F5F9', cursor: 'pointer',
                          opacity: activeImg === i ? 1 : 0.7, outline: activeImg === i ? '2px solid #6CC51D' : 'none',
                          outlineOffset: '1px',
                        }}>
                          <Image src={img.url} alt={`${product.title} ${i + 1}`} fill style={{ objectFit: 'cover', borderRadius: '4px' }} unoptimized />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ─── Col 2: Buy Box ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>



              {/* Title */}
              <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#191c1d', lineHeight: '38px', letterSpacing: '-0.75px', margin: 0 }}>
                {product.title}
                {product.unit && <span style={{ fontSize: '16px', fontWeight: 400, color: '#868889' }}> / {product.unit}</span>}
              </h1>

              {/* Rating & social proof bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#EBFFD7', padding: '4px 8px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#244c00' }}>{product.avgRating > 0 ? product.avgRating.toFixed(1) : '5.0'}</span>
                  <div style={{ display: 'flex', gap: '1px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} filled={i < Math.round(product.avgRating || 5)} />
                    ))}
                  </div>
                </div>
                {product.reviewCount > 0 && (
                  <>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889', textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => setActiveTab(3)} >
                      {product.reviewCount} đánh giá thực tế
                    </span>
                    <div style={{ width: '1px', height: '12px', background: '#EBEBEB' }} />
                  </>
                )}
                <span style={{ fontSize: '12px', color: '#868889' }}>
                  Còn{' '}
                  <span style={{ fontWeight: 700, color: '#191c1d' }}>{product.stockQuantity ?? '—'} {product.unit}</span>
                </span>
              </div>

              {/* Flash Sale Price Block */}
              <div style={{
                background: 'linear-gradient(to right, #EBFFD7, #F4F5F9 50%)',
                borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                {/* Price row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '36px', fontWeight: 700, color: '#356b00', lineHeight: '44px' }}>
                      {fmtPrice(salePrice)}
                    </span>
                    {hasDiscount && (
                      <span style={{ fontSize: '15px', fontWeight: 600, color: '#868889', textDecoration: 'line-through' }}>
                        {fmtPrice(product.price)}
                      </span>
                    )}
                    {hasDiscount && (
                      <span style={{ background: '#ba1a1a', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                        Tiết kiệm {fmtPrice(product.price - salePrice)}
                      </span>
                    )}
                  </div>
                  {/* Countdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', borderRadius: '8px', padding: '4px 12px' }}>
                    <ClockIcon />
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#868889' }}>Kết thúc sau:</span>
                    <CountdownTimer endMs={SALE_END_MS} />
                  </div>
                </div>
                {/* Freeship */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShipIcon />
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#486f21' }}>
                    Miễn phí giao hàng cho thành viên SIN Club từ 150.000₫
                  </span>
                </div>
              </div>

              {/* Qty selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889' }}>Số lượng:</span>
                <div style={{ display: 'flex', alignItems: 'center', background: '#F4F5F9', borderRadius: '8px', padding: '4px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
                    −
                  </button>
                  <div style={{ width: '48px', textAlign: 'center', fontSize: '15px', fontWeight: 700, color: '#191c1d' }}>{qty}</div>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
                    +
                  </button>
                </div>
              </div>

              {/* Success message */}
              {addedMsg && (
                <div style={{ background: '#EBFFD7', color: '#244c00', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
                  {addedMsg}
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
                <button onClick={handleAddToCart} disabled={isPending} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', borderRadius: '8px', border: 'none',
                  background: '#EBFFD7', color: '#356b00', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: "Roboto, sans-serif",
                  filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.05))',
                }}>
                  🛒 {isPending ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
                <button onClick={handleBuyNow} disabled={isPending} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', borderRadius: '8px', border: 'none',
                  background: '#6CC51D', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: "Roboto, sans-serif",
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                }}>
                  ⚡ Mua ngay (Giao 2H)
                </button>
              </div>

              {/* Coupon bar — Figma: bg #f3f4f4, p-12, rounded-8 */}
              <div style={{ background: '#f3f4f4', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '14px' }}>🎫</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#191c1d' }}>Mã giảm giá cho sản phẩm này</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#356b00', cursor: 'pointer' }}>Xem tất cả 6 mã</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                  {[
                    { code: 'SIN30', desc: 'Giảm 30.000₫ cho đơn từ 199k' },
                    { code: 'FREESHIP', desc: 'Miễn phí ship đơn 250k' },
                  ].map(v => (
                    <div key={v.code} style={{
                      background: '#fff', borderRadius: '4px', padding: '4px 12px',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.05))',
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#356b00', fontFamily: "'Liberation Mono', monospace" }}>{v.code}</div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: '#868889' }}>{v.desc}</div>
                      </div>
                      <div style={{ background: '#EBFFD7', borderRadius: '6px', padding: '4px 8px', fontSize: '10px', fontWeight: 600, color: '#356b00', flexShrink: 0 }}>Lưu</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs — Figma: bg #f3f4f4, border-b #ebebeb, active: #356b00 bold, border-b-2 #356b00 ── */}
          <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '32px' }}>
            <div style={{ background: '#f3f4f4', borderBottom: '1px solid #ebebeb', display: 'flex', overflowX: 'auto', padding: '0 24px', gap: '12px' }}>
              {TABS.map((tab, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{
                  padding: '16px 0', paddingBottom: activeTab === i ? '16px' : '18px', fontSize: '15px',
                  fontWeight: activeTab === i ? 700 : 600,
                  color: activeTab === i ? '#356b00' : '#868889',
                  borderBottom: activeTab === i ? '2px solid #356b00' : '2px solid transparent',
                  background: 'none', border: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "Roboto, sans-serif",
                  transition: 'all 0.15s',
                }}>
                  {tab}{i === 3 && product.reviewCount > 0 ? ` (${product.reviewCount})` : ''}
                </button>
              ))}
            </div>

            <div style={{ padding: '24px' }}>
              {/* ── Tab 0: Thông tin sản phẩm & Dinh dưỡng ── */}
              {activeTab === 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '32px', alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#191c1d', margin: '0 0 8px', lineHeight: '24px' }}>
                        Đặc điểm nổi bật của {product.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#404a37', lineHeight: '22.75px', margin: 0 }}>
                        {product.description || 'Sản phẩm được tuyển chọn trực tiếp từ các nhà vườn nông nghiệp sạch, đảm bảo chất lượng tươi ngon nhất.'}
                      </p>
                    </div>

                    {/* Info grid 3 col */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'Xuất xứ', value: product.origin || product.category?.name || 'Việt Nam', color: '#191c1d' },
                        { label: 'Quy cách đóng gói', value: product.packagingInfo || `1 ${product.unit}`, color: '#191c1d' },
                        { label: 'Thời gian bảo quản', value: product.preservationDays ? `${product.preservationDays} ngày` : '3–5 ngày', color: '#191c1d' },
                        { label: 'Phương pháp trồng', value: product.cultivationMethod || 'Thuần hữu cơ', color: '#191c1d' },
                        { label: 'Đơn vị bán', value: `1 ${product.unit}`, color: '#356b00' },
                        { label: 'Đạt tiêu chuẩn', value: product.certifications?.length ? product.certifications[0] : 'VietGAP sạch', color: '#191c1d' },
                      ].map(item => (
                        <div key={item.label} style={{ background: '#f4f5f9', borderRadius: '8px', padding: '14px 12px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 500, color: '#868889', marginBottom: '4px' }}>{item.label}</div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: item.color, lineHeight: '20px' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Bảng dinh dưỡng nếu có */}
                    {product.nutritionInfo && Object.values(product.nutritionInfo).some(v => v) && (
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#191c1d', margin: '0 0 12px' }}>🥗 Thông tin dinh dưỡng (per 100g)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                          {Object.entries(product.nutritionInfo as Record<string, string>)
                            .filter(([, v]) => v)
                            .map(([key, value]) => (
                            <div key={key} style={{ background: '#EBFFD7', borderRadius: '8px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', color: '#486f21', fontWeight: 500, textTransform: 'capitalize' }}>
                                {key === 'calories' ? 'Calories' : key === 'protein' ? 'Protein' : key === 'fat' ? 'Chất béo' : key === 'carbs' ? 'Carbs' : key === 'fiber' ? 'Chất xơ' : 'Vitamin C'}
                              </span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: '#244c00' }}>{value as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right image */}
                  <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '340px' }}>
                    {images[1]?.url ? (
                      <Image src={images[1].url} alt="Chi tiết sản phẩm" fill style={{ objectFit: 'cover' }} unoptimized />
                    ) : (
                      <div style={{ background: '#F4F5F9', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#868889', fontSize: '14px' }}>
                        📷 Ảnh mô tả sản phẩm
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 500, fontStyle: 'italic', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                      Thu hoạch từ vườn nông sản sạch
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tab 1: Nguồn gốc & Chứng nhận ── */}
              {activeTab === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '32px', alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#191c1d', margin: '0 0 12px' }}>Nguồn gốc & Chứng nhận</h3>
                      {product.farmName && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '16px' }}>🏡</span>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#191c1d' }}>{product.farmName}</span>
                          </div>
                          {product.farmAddress && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{ fontSize: '14px' }}>📍</span>
                              <span style={{ fontSize: '13px', color: '#486f21' }}>{product.farmAddress}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {!product.farmName && (
                        <p style={{ fontSize: '14px', color: '#486f21', lineHeight: '24px', margin: 0 }}>
                          Sản phẩm {product.title} được thu mua trực tiếp từ các trang trại liên kết, đạt tiêu chuẩn VietGAP, không sử dụng thuốc bảo vệ thực vật hóa học.
                        </p>
                      )}
                    </div>

                    {/* Certifications */}
                    {product.certifications?.length > 0 ? (
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#191c1d', margin: '0 0 12px' }}>🏅 Chứng nhận đạt được</h4>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {product.certifications.map((cert: string) => (
                            <span key={cert} style={{
                              background: '#EBFFD7', color: '#244c00', border: '1px solid #6CC51D',
                              borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: 700,
                              display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                              ✓ {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['VietGAP', 'Không hóa chất', 'An toàn thực phẩm'].map(c => (
                          <span key={c} style={{ background: '#EBFFD7', color: '#244c00', border: '1px solid #6CC51D', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: 700 }}>✓ {c}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Farm image */}
                  <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '280px' }}>
                    {(product.farmImageUrl || images[0]?.url) ? (
                      <Image src={product.farmImageUrl || images[0]?.url} alt="Trang trại" fill style={{ objectFit: 'cover' }} unoptimized />
                    ) : (
                      <div style={{ background: '#F4F5F9', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#868889', fontSize: '14px', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '3rem' }}>🌿</span>
                        <span>Ảnh trang trại</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Tab 2: Gợi ý món ngon & Bảo quản ── */}
              {activeTab === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#191c1d', margin: 0 }}>Mẹo bảo quản & Công thức món ngon</h3>

                  {/* Recipes từ DB */}
                  {product.recipes && (product.recipes as {icon:string;title:string;content:string}[]).length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                      {(product.recipes as {icon:string;title:string;content:string}[]).map((recipe, i) => (
                        <div key={i} style={{
                          background: '#F8F9FA', borderRadius: '8px', padding: '20px',
                          borderLeft: '3px solid #6CC51D',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '24px' }}>{recipe.icon}</span>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#191c1d', margin: 0, lineHeight: '20px' }}>{recipe.title}</h4>
                          </div>
                          <p style={{ fontSize: '13px', color: '#486f21', lineHeight: '22px', margin: 0 }}>{recipe.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Fallback khi chưa có data */
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ background: '#F8F9FA', borderRadius: '8px', padding: '20px', borderLeft: '3px solid #6CC51D' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ fontSize: '22px' }}>🍽️</span>
                          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#191c1d', margin: 0 }}>Công thức từ {product.title}</h4>
                        </div>
                        <p style={{ fontSize: '13px', color: '#486f21', lineHeight: '22px', margin: 0 }}>Khám phá những công thức nấu ăn ngon từ {product.title}. Thêm vào các món salad, sinh tố hoặc dùng trực tiếp.</p>
                      </div>
                      <div style={{ background: '#F8F9FA', borderRadius: '8px', padding: '20px', borderLeft: '3px solid #6CC51D' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ fontSize: '22px' }}>❄️</span>
                          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#191c1d', margin: 0 }}>Hướng dẫn bảo quản</h4>
                        </div>
                        <p style={{ fontSize: '13px', color: '#486f21', lineHeight: '22px', margin: 0 }}>
                          {product.preservationDays
                            ? `Bảo quản trong ngăn mát 0–5°C, dùng trong ${product.preservationDays} ngày.`
                            : 'Bảo quản trong tủ lạnh 0–5°C, dùng trong 3–5 ngày để giữ độ tươi ngon tốt nhất.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Storage guide nếu có */}
                  {product.storageGuide && (
                    <div style={{ background: '#EBFFD7', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>💡</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#244c00', marginBottom: '4px' }}>Mẹo bảo quản thêm</div>
                        <p style={{ fontSize: '13px', color: '#356b00', lineHeight: '22px', margin: 0 }}>{product.storageGuide}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab 3: Đánh giá ── */}
              {activeTab === 3 && (
                <ReviewsSection slug={slug} productId={product.id} />
              )}
            </div>
          </div>

          {/* ── Related Products ── */}
          {related.length > 0 && (
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#6CC51D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    CÙNG DANH MỤC
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#000', margin: 0 }}>
                    Sản phẩm tươi ngon cùng danh mục
                  </h2>
                </div>
                {product.category && (
                  <Link href={`/shop?categoryId=${product.category.id}`} style={{ fontSize: '13px', fontWeight: 600, color: '#6CC51D', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Xem tất cả {product.category.name} →
                  </Link>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {related.map((p: { id: string }, i: number) => (
                  <ProductCard key={(p as { id: string }).id} product={p as Parameters<typeof ProductCard>[0]['product']} rank={i + 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
