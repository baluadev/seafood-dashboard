'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCategories, useProducts } from '@/hooks/use-products';
import { useAddToCart } from '@/hooks/use-cart';
import { ProductCard, ProductCardSkeleton } from '@/components/product-card';

/* ─────────────── SVG Icons ─────────────── */
const HomeIcon = () => (
  <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
    <path d="M1 4.5L5.5 1L10 4.5V11H7V7.5H4V11H1V4.5Z" stroke="#868889" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="4" height="7" viewBox="0 0 4 7" fill="none">
    <path d="M1 0.5L3.5 3.5L1 6.5" stroke="#868889" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const GridIcon = ({ active }: { active?: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="0.5" y="0.5" width="5.5" height="5.5" rx="1" stroke={active ? '#356b00' : '#868889'} strokeWidth="1.2"/>
    <rect x="9" y="0.5" width="5.5" height="5.5" rx="1" stroke={active ? '#356b00' : '#868889'} strokeWidth="1.2"/>
    <rect x="0.5" y="9" width="5.5" height="5.5" rx="1" stroke={active ? '#356b00' : '#868889'} strokeWidth="1.2"/>
    <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke={active ? '#356b00' : '#868889'} strokeWidth="1.2"/>
  </svg>
);
const ListIcon = ({ active }: { active?: boolean }) => (
  <svg width="17" height="14" viewBox="0 0 17 14" fill="none">
    <rect x="5" y="0.5" width="11.5" height="2.5" rx="1" stroke={active ? '#356b00' : '#868889'} strokeWidth="1.2"/>
    <rect x="5" y="5.5" width="11.5" height="2.5" rx="1" stroke={active ? '#356b00' : '#868889'} strokeWidth="1.2"/>
    <rect x="5" y="10.5" width="11.5" height="2.5" rx="1" stroke={active ? '#356b00' : '#868889'} strokeWidth="1.2"/>
    <circle cx="1.5" cy="1.75" r="1" fill={active ? '#356b00' : '#868889'}/>
    <circle cx="1.5" cy="6.75" r="1" fill={active ? '#356b00' : '#868889'}/>
    <circle cx="1.5" cy="11.75" r="1" fill={active ? '#356b00' : '#868889'}/>
  </svg>
);
const XIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <path d="M1 1L7 7M7 1L1 7" stroke="#356b00" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const XIconGray = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <path d="M1 1L7 7M7 1L1 7" stroke="#868889" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const ResetIcon = () => (
  <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
    <path d="M1 2.5C2.15 1.3 3.74 0.5 5.5 0.5C8.81 0.5 11.5 3.19 11.5 6.5S8.81 12.5 5.5 12.5C2.95 12.5 0.76 10.93 0 8.5" stroke="#868889" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M0 0.5V3.5H3" stroke="#868889" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 13.3333 16.6667" fill="none">
    <path d="M1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V5C0 4.54167 0.163194 4.14931 0.489583 3.82292C0.815972 3.49653 1.20833 3.33333 1.66667 3.33333H3.33333C3.33333 2.41667 3.65972 1.63194 4.3125 0.979167C4.96528 0.326389 5.75 0 6.66667 0C7.58333 0 8.36806 0.326389 9.02083 0.979167C9.67361 1.63194 10 2.41667 10 3.33333H11.6667C12.125 3.33333 12.5174 3.49653 12.8438 3.82292C13.1701 4.14931 13.3333 4.54167 13.3333 5V15C13.3333 15.4583 13.1701 15.8507 12.8438 16.1771C12.5174 16.5035 12.125 16.6667 11.6667 16.6667H1.66667ZM1.66667 15H11.6667V5H10V6.66667C10 6.90278 9.92014 7.10069 9.76042 7.26042C9.60069 7.42014 9.40278 7.5 9.16667 7.5C8.93056 7.5 8.73264 7.42014 8.57292 7.26042C8.41319 7.10069 8.33333 6.90278 8.33333 6.66667V5H5V6.66667C5 6.90278 4.92014 7.10069 4.76042 7.26042C4.60069 7.42014 4.40278 7.5 4.16667 7.5C3.93056 7.5 3.73264 7.42014 3.57292 7.26042C3.41319 7.10069 3.33333 6.90278 3.33333 6.66667V5H1.66667V15ZM5 3.33333H8.33333C8.33333 2.875 8.17014 2.48264 7.84375 2.15625C7.51736 1.82986 7.125 1.66667 6.66667 1.66667C6.20833 1.66667 5.81597 1.82986 5.48958 2.15625C5.16319 2.48264 5 2.875 5 3.33333Z" fill="white"/>
  </svg>
);

/* ─────────────── Helpers ─────────────── */
function fmtPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

/* ─────────────── Shop List Card (alternate layout for list view) ─────────────── */
function ShopListCard({ product, onAddToCart }: { product: any; onAddToCart: (id: string) => void }) {
  const price = Number(product.price ?? 0);
  const discount = Number(product.discountRate ?? 0);
  const salePrice = discount > 0 ? Math.round(price * (1 - discount)) : price;

  return (
    <Link href={`/shop/${product.slug}`} style={{
      display: 'flex', gap: '16px', background: '#fff', borderRadius: '12px',
      boxShadow: '0 1px 1px rgba(0,0,0,0.05)', padding: '16px',
      textDecoration: 'none', color: 'inherit', alignItems: 'center',
    }}>
      <div style={{ width: '120px', height: '120px', background: '#F4F5F9', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        {product.thumbnailUrl && (
          <img src={product.thumbnailUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        {product.isHot && (
          <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'linear-gradient(90deg,#ea580c,#f97316)', padding: '2px 8px', borderRadius: '12px', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>🔥 HOT</span>
          </div>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {product.category?.name && <span style={{ fontSize: '11px', fontWeight: 500, color: '#868889' }}>{product.category.name}{product.unit ? ` • ${product.unit}` : ''}</span>}
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#191c1d', lineHeight: '22px' }}>{product.title}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#ea580c' }}>{fmtPrice(salePrice)}</span>
          {discount > 0 && <span style={{ fontSize: '12px', color: '#868889', textDecoration: 'line-through' }}>{fmtPrice(price)}</span>}
        </div>
      </div>
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); onAddToCart(product.id); }}
        style={{ flexShrink: 0, padding: '10px 20px', background: '#6CC51D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Roboto, sans-serif' }}
      >
        <CartIcon /> Thêm vào giỏ
      </button>
    </Link>
  );
}

/* ─────────────── Shop Card (grid view — Figma style) ─────────────── */
function ShopGridCard({ product, onAddToCart }: { product: any; onAddToCart: (id: string) => void }) {
  const price = Number(product.price ?? 0);
  const discount = Number(product.discountRate ?? 0);
  const salePrice = discount > 0 ? Math.round(price * (1 - discount)) : price;
  const images = product.images ?? [];

  return (
    <Link href={`/shop/${product.slug}`} style={{
      display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '16px',
      boxShadow: '0 1px 1px rgba(0,0,0,0.05)', padding: '12px',
      textDecoration: 'none', color: 'inherit', position: 'relative',
      flex: '1 0 0', minWidth: 0,
    }}>
      {/* Image area */}
      <div style={{ background: '#F4F5F9', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', position: 'relative' }}>
        <div style={{ display: 'flex', gap: '2px', height: '193px' }}>
          {/* Main image */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {product.thumbnailUrl && (
              <img src={product.thumbnailUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            {/* Product name label bottom-left */}
            <div style={{ position: 'absolute', bottom: '6px', left: '8px', textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{product.title?.split(' ').slice(-2).join(' ')}</span>
            </div>
          </div>
          {/* Second image (from images[]) */}
          {images[0]?.url && (
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <img src={images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Brand overlay top-right */}
              <div style={{ position: 'absolute', top: '4px', right: '8px', background: 'rgba(255,255,255,0.85)', borderRadius: '2px', padding: '0 4px', boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#f97316' }}>Tạp hóa SIN</span>
              </div>
            </div>
          )}
        </div>

        {/* HOT badge top-left */}
        {product.isHot && (
          <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'linear-gradient(90deg,#ea580c,#f97316)', padding: '2px 10px', borderRadius: '12px', boxShadow: '0 1px 1px rgba(0,0,0,0.1)', zIndex: 2 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>🔥 HOT</span>
          </div>
        )}
      </div>

      {/* Title */}
      <div style={{ marginBottom: '4px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#191c1d', letterSpacing: '-0.45px', lineHeight: '24px' }}>{product.title}</h3>
      </div>

      {/* Price row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '16px' }}>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#ea580c' }}>{fmtPrice(salePrice)}</span>
        {product.unit && <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889' }}>/{product.unit}</span>}
        {discount > 0 && <span style={{ fontSize: '10px', fontWeight: 500, color: '#868889', textDecoration: 'line-through' }}>{fmtPrice(price)}</span>}
      </div>

      {/* CTA Button */}
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); onAddToCart(product.id); }}
        style={{
          width: '100%', padding: '8px 12px', background: '#6CC51D',
          color: '#fff', border: 'none', borderRadius: '8px',
          fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          fontFamily: 'Roboto, sans-serif', boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
        }}
      >
        <CartIcon /> Thêm vào giỏ
      </button>
    </Link>
  );
}

/* ─────────────── Price Range Slider ─────────────── */
function PriceRangeSlider({ max, value, onChange }: { max: number; value: number; onChange: (v: number) => void }) {
  const pct = ((value - 50000) / (max - 50000)) * 100;
  return (
    <div style={{ width: '100%' }}>
      <input
        type="range"
        min={50000}
        max={max}
        step={10000}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#6CC51D', height: '4px' }}
      />
      <style>{`input[type=range]{height:4px;}`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '10px', fontWeight: 500, color: '#868889' }}>50.000₫</span>
        <span style={{ fontSize: '10px', fontWeight: 500, color: '#868889' }}>{fmtPrice(max)}</span>
      </div>
    </div>
  );
}

/* ─────────────── Pagination ─────────────── */
function Pagination({ page, total, limit, onPage }: { page: number; total: number; limit: number; onPage: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;
  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
      <span style={{ fontSize: '13px', color: '#868889', fontWeight: 500 }}>
        Đang hiển thị <strong style={{ color: '#191c1d' }}>{Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)}</strong> trên tổng số <strong style={{ color: '#191c1d' }}>{total}</strong> kết quả
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1.5px solid #EBEBEB', background: '#fff', cursor: page > 1 ? 'pointer' : 'not-allowed', opacity: page > 1 ? 1 : 0.4, fontSize: '14px' }}>
          ‹
        </button>
        {pages.map((p, i) => (
          <button key={i} onClick={() => typeof p === 'number' && onPage(p)} disabled={p === '...'}
            style={{
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px',
              border: p === page ? 'none' : '1.5px solid #EBEBEB',
              background: p === page ? '#6CC51D' : '#fff',
              color: p === page ? '#fff' : '#191c1d',
              fontWeight: p === page ? 700 : 500, fontSize: '13px',
              cursor: typeof p === 'number' ? 'pointer' : 'default',
              fontFamily: 'Roboto, sans-serif',
            }}>
            {p}
          </button>
        ))}
        <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1.5px solid #EBEBEB', background: '#fff', cursor: page < totalPages ? 'pointer' : 'not-allowed', opacity: page < totalPages ? 1 : 0.4, fontSize: '14px' }}>
          ›
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*  SHOP PAGE                                              */
/* ═══════════════════════════════════════════════════════ */
const LIMIT = 9;
const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá thấp → cao' },
  { value: 'price_desc', label: 'Giá cao → thấp' },
  { value: 'bestseller', label: 'Bán chạy nhất' },
];
const MAX_PRICE = 500000;

export default function ShopPage() {
  const { mutate: addToCart } = useAddToCart();

  /* Filters */
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [hotOnly, setHotOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  /* API params */
  const params: Record<string, string | number | boolean> = { limit: LIMIT, page };
  if (selectedCat) params.categoryId = selectedCat;
  if (hotOnly) params.isHot = 'true';
  if (maxPrice < MAX_PRICE) params.maxPrice = maxPrice;
  if (sortBy === 'price_asc') params.sortBy = 'price'; params.order = 'asc';
  if (sortBy === 'price_desc') { params.sortBy = 'price'; params.order = 'desc'; }
  if (sortBy === 'bestseller') params.sortBy = 'soldCount';

  const { data: catRes } = useCategories();
  const { data: productsRes, isLoading } = useProducts(params);

  const categories: any[] = catRes?.data ?? catRes ?? [];
  const products: any[] = productsRes?.data ?? [];
  const total: number = productsRes?.total ?? productsRes?.meta?.total ?? products.length;

  /* Active filter chips */
  const chips: { label: string; onRemove: () => void }[] = [];
  if (selectedCat) {
    const cat = categories.find((c: any) => c.id === selectedCat);
    chips.push({ label: `Danh mục: ${cat?.name ?? selectedCat}`, onRemove: () => { setSelectedCat(null); setPage(1); } });
  } else {
    chips.push({ label: 'Danh mục: Tất cả', onRemove: () => {} });
  }
  if (hotOnly) chips.push({ label: '🔥 Sản phẩm nổi bật', onRemove: () => { setHotOnly(false); setPage(1); } });

  function resetFilters() {
    setSelectedCat(null); setHotOnly(false); setMaxPrice(MAX_PRICE); setSortBy('newest'); setPage(1);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA', fontFamily: 'Roboto, sans-serif' }}>
      <Header />
      <div style={{ paddingTop: '80px', flex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
              <HomeIcon />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889' }}>Trang chủ</span>
            </Link>
            <ChevronIcon />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d' }}>Tất cả sản phẩm</span>
          </nav>

          {/* Main grid: sidebar (3col) + content (9col) */}
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>

            {/* ════ LEFT SIDEBAR ════ */}
            <aside style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '96px' }}>

              {/* Categories */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#191c1d', lineHeight: '20px' }}>Danh mục</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {/* All */}
                  <button
                    onClick={() => { setSelectedCat(null); setPage(1); }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: !selectedCat ? '#6CC51D' : 'transparent',
                      boxShadow: !selectedCat ? '0 1px 1px rgba(0,0,0,0.05)' : 'none',
                      transition: 'background 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 600, color: !selectedCat ? '#fff' : '#868889' }}>Tất cả</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: !selectedCat ? '#fff' : '#868889', background: !selectedCat ? 'rgba(255,255,255,0.2)' : 'transparent', padding: '1px 8px', borderRadius: '12px' }}>
                      {total || products.length}
                    </span>
                  </button>

                  {/* Category items */}
                  {categories.map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCat(cat.id); setPage(1); }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: selectedCat === cat.id ? '#6CC51D' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: selectedCat === cat.id ? 600 : 500, color: selectedCat === cat.id ? '#fff' : '#868889' }}>
                        {cat.name}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: selectedCat === cat.id ? '#fff' : '#868889' }}>
                        {cat.productCount ?? cat._count?.products ?? ''}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#191c1d', lineHeight: '20px' }}>Sắp xếp</span>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowSortDropdown(v => !v)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: '#F4F5F9', border: 'none', borderRadius: '8px', padding: '8px 12px',
                      cursor: 'pointer', fontSize: '14px', fontFamily: 'Roboto, sans-serif',
                    }}
                  >
                    <span style={{ color: '#191c1d' }}>{SORT_OPTIONS.find(s => s.value === sortBy)?.label}</span>
                    <span style={{ fontSize: '10px', color: '#868889', transform: showSortDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </button>
                  {showSortDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden' }}>
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); setPage(1); }}
                          style={{ width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: sortBy === opt.value ? '#EBFFD7' : 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: sortBy === opt.value ? 600 : 400, color: sortBy === opt.value ? '#356b00' : '#191c1d', fontFamily: 'Roboto, sans-serif' }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Hot filter checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
                <button
                  onClick={() => { setHotOnly(v => !v); setPage(1); }}
                  style={{
                    width: '20px', height: '20px', borderRadius: '2.5px', flexShrink: 0,
                    background: hotOnly ? '#6CC51D' : '#fff',
                    border: `1.5px solid ${hotOnly ? '#6CC51D' : '#D0D5DD'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {hotOnly && (
                    <svg width="10" height="8" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#191c1d' }}>🔥 Sản phẩm nổi bật</span>
              </div>

              {/* Price range */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#191c1d' }}>Khoảng giá</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#356b00' }}>Đến {fmtPrice(maxPrice)}</span>
                </div>
                <PriceRangeSlider max={MAX_PRICE} value={maxPrice} onChange={v => { setMaxPrice(v); setPage(1); }} />
              </div>

              {/* Reset button */}
              <button
                onClick={resetFilters}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: '#F4F5F9', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', width: '100%' }}
              >
                <ResetIcon />
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889', fontFamily: 'Roboto, sans-serif' }}>Thiết lập lại bộ lọc</span>
              </button>
            </aside>

            {/* ════ RIGHT COLUMN ════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Status bar */}
              <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Left: count + filter chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#868889' }}>
                    Hiển thị <strong style={{ color: '#191c1d' }}>{products.length}</strong> / <strong style={{ color: '#191c1d' }}>{total}</strong> sản phẩm
                  </span>
                  {/* Active chips */}
                  {chips.map((chip, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', background: i === 0 && !selectedCat ? '#EBFFD7' : '#F4F5F9' }}>
                      <span style={{ fontSize: '10px', fontWeight: 500, color: i === 0 && !selectedCat ? '#356b00' : '#191c1d' }}>{chip.label}</span>
                      {chip.onRemove && (selectedCat || hotOnly) && (
                        <button onClick={chip.onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', lineHeight: 0 }}>
                          {i === 0 ? <XIcon /> : <XIconGray />}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right: view mode toggles */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{ padding: '6px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: viewMode === 'grid' ? '#EBFFD7' : '#F4F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <GridIcon active={viewMode === 'grid'} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{ padding: '6px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: viewMode === 'list' ? '#EBFFD7' : '#F4F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ListIcon active={viewMode === 'list'} />
                  </button>
                </div>
              </div>

              {/* Product grid/list */}
              {isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(3, 1fr)' : '1fr', gap: '16px' }}>
                  {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '16px', padding: '60px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#191c1d', marginBottom: '8px' }}>Không tìm thấy sản phẩm</h3>
                  <p style={{ fontSize: '14px', color: '#868889' }}>Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác</p>
                  <button onClick={resetFilters} style={{ marginTop: '16px', padding: '10px 24px', background: '#6CC51D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Roboto, sans-serif' }}>
                    Xóa bộ lọc
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Rows of 3 */}
                  {Array.from({ length: Math.ceil(products.length / 3) }).map((_, rowIdx) => (
                    <div key={rowIdx} style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}>
                      {products.slice(rowIdx * 3, rowIdx * 3 + 3).map((p: any) => (
                        <ShopGridCard key={p.id} product={p} onAddToCart={id => addToCart({ productId: id, quantity: 1 })} />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {products.map((p: any) => (
                    <ShopListCard key={p.id} product={p} onAddToCart={id => addToCart({ productId: id, quantity: 1 })} />
                  ))}
                </div>
              )}

              {/* Trust banner */}
              {!isLoading && products.length > 0 && (
                <div style={{ background: '#fff', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>
                  <div style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #6CC51D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🛡</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#191c1d', marginBottom: '2px' }}>Cam kết chất lượng thực phẩm Tạp hóa SIN</div>
                    <div style={{ fontSize: '12px', color: '#868889' }}>100% nguyên liệu tươi sạch, đóng gói hút chân không không an toàn VSTP, đổi trả miễn phí trong 24h nếu không đúng cam kết.</div>
                  </div>
                </div>
              )}

              {/* Pagination */}
              <Pagination page={page} total={total} limit={LIMIT} onPage={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
