'use client';

import { useState } from 'react';
import Link from 'next/link';
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
const FilterIcon = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
    <path d="M0 1H16M3 7H13M6 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ─────────────── Helpers ─────────────── */
function fmtPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

/* ─────────────── Price Range Slider ─────────────── */
function PriceRangeSlider({ max, value, onChange }: { max: number; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ width: '100%' }}>
      <input
        type="range" min={50000} max={max} step={10000} value={value}
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
    <div className="pagination-wrap">
      <span style={{ fontSize: '13px', color: '#868889', fontWeight: 500, textAlign: 'center' }}>
        Hiển thị <strong style={{ color: '#191c1d' }}>{Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)}</strong> / <strong style={{ color: '#191c1d' }}>{total}</strong>
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
          style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1.5px solid #EBEBEB', background: '#fff', cursor: page > 1 ? 'pointer' : 'not-allowed', opacity: page > 1 ? 1 : 0.4, fontSize: '16px' }}>
          ‹
        </button>
        {pages.map((p, i) => (
          <button key={i} onClick={() => typeof p === 'number' && onPage(p)} disabled={p === '...'}
            style={{
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px',
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
          style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1.5px solid #EBEBEB', background: '#fff', cursor: page < totalPages ? 'pointer' : 'not-allowed', opacity: page < totalPages ? 1 : 0.4, fontSize: '16px' }}>
          ›
        </button>
      </div>
    </div>
  );
}

/* ─────────────── Sidebar Filter Panel (shared between desktop sidebar & mobile drawer) ─────────────── */
function FilterPanel({
  categories, selectedCat, setSelectedCat, sortBy, setSortBy,
  hotOnly, setHotOnly, maxPrice, setMaxPrice, setPage, total, products,
  showSortDropdown, setShowSortDropdown, resetFilters, onClose,
}: any) {
  const MAX_PRICE = 500000;
  const SORT_OPTIONS = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá thấp → cao' },
    { value: 'price_desc', label: 'Giá cao → thấp' },
    { value: 'bestseller', label: 'Bán chạy nhất' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header for mobile drawer */}
      {onClose && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F4F5F9' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#191c1d' }}>Bộ lọc</span>
          <button onClick={onClose} style={{ background: '#F4F5F9', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 8 8" fill="none"><path d="M1 1L7 7M7 1L1 7" stroke="#191c1d" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}

      {/* Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#191c1d' }}>Danh mục</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button onClick={() => { setSelectedCat(null); setPage(1); onClose?.(); }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: !selectedCat ? '#6CC51D' : 'transparent', transition: 'background 0.15s' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: !selectedCat ? '#fff' : '#868889' }}>Tất cả</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: !selectedCat ? '#fff' : '#868889', background: !selectedCat ? 'rgba(255,255,255,0.2)' : 'transparent', padding: '1px 8px', borderRadius: '12px' }}>
              {total || products.length}
            </span>
          </button>
          {categories.map((cat: any) => (
            <button key={cat.id} onClick={() => { setSelectedCat(cat.id); setPage(1); onClose?.(); }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: selectedCat === cat.id ? '#6CC51D' : 'transparent', transition: 'background 0.15s' }}>
              <span style={{ fontSize: '12px', fontWeight: selectedCat === cat.id ? 600 : 500, color: selectedCat === cat.id ? '#fff' : '#868889' }}>{cat.name}</span>
              <span style={{ fontSize: '12px', color: selectedCat === cat.id ? '#fff' : '#868889' }}>{cat.productCount ?? cat._count?.products ?? ''}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#191c1d' }}>Sắp xếp</span>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowSortDropdown((v: boolean) => !v)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F4F5F9', border: 'none', borderRadius: '8px', padding: '9px 12px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Roboto, sans-serif' }}>
            <span style={{ color: '#191c1d' }}>{SORT_OPTIONS.find(s => s.value === sortBy)?.label}</span>
            <span style={{ fontSize: '10px', color: '#868889', transform: showSortDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
          </button>
          {showSortDropdown && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden' }}>
              {SORT_OPTIONS.map(opt => (
                <button key={opt.value}
                  onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); setPage(1); }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: sortBy === opt.value ? '#EBFFD7' : 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: sortBy === opt.value ? 600 : 400, color: sortBy === opt.value ? '#356b00' : '#191c1d', fontFamily: 'Roboto, sans-serif' }}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hot filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => { setHotOnly((v: boolean) => !v); setPage(1); }}
          style={{ width: '20px', height: '20px', borderRadius: '4px', flexShrink: 0, background: hotOnly ? '#6CC51D' : '#fff', border: `1.5px solid ${hotOnly ? '#6CC51D' : '#D0D5DD'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
          {hotOnly && <svg width="10" height="8" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#191c1d' }}>🔥 Sản phẩm nổi bật</span>
      </div>

      {/* Price range */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#191c1d' }}>Khoảng giá</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#356b00' }}>Đến {fmtPrice(maxPrice)}</span>
        </div>
        <PriceRangeSlider max={MAX_PRICE} value={maxPrice} onChange={v => { setMaxPrice(v); setPage(1); }} />
      </div>

      {/* Reset */}
      <button onClick={() => { resetFilters(); onClose?.(); }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#F4F5F9', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', width: '100%' }}>
        <ResetIcon />
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889', fontFamily: 'Roboto, sans-serif' }}>Thiết lập lại bộ lọc</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*  SHOP PAGE                                              */
/* ═══════════════════════════════════════════════════════ */
const LIMIT = 9;
const MAX_PRICE = 500000;

export default function ShopPage() {
  const { mutate: addToCart } = useAddToCart();

  /* Filters */
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [hotOnly, setHotOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [page, setPage] = useState(1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* API params */
  const params: Record<string, string | number | boolean> = { limit: LIMIT, page };
  if (selectedCat) params.categoryId = selectedCat;
  if (hotOnly) params.isHot = 'true';
  if (maxPrice < MAX_PRICE) params.maxPrice = maxPrice;
  if (sortBy === 'price_asc') { params.sortBy = 'price'; params.order = 'asc'; }
  if (sortBy === 'price_desc') { params.sortBy = 'price'; params.order = 'desc'; }
  if (sortBy === 'bestseller') { params.sortBy = 'soldCount'; }

  const { data: catRes } = useCategories();
  const { data: productsRes, isLoading } = useProducts(params);

  const categories: any[] = Array.isArray(catRes) ? catRes : (catRes?.data ?? []);
  const products: any[] = productsRes?.data ?? [];
  const total: number = productsRes?.meta?.total ?? products.length;

  /* Active filter chips */
  const chips: { label: string; onRemove: () => void }[] = [];
  if (selectedCat) {
    const cat = categories.find((c: any) => c.id === selectedCat);
    chips.push({ label: `Danh mục: ${cat?.name ?? selectedCat}`, onRemove: () => { setSelectedCat(null); setPage(1); } });
  } else {
    chips.push({ label: 'Tất cả', onRemove: () => {} });
  }
  if (hotOnly) chips.push({ label: '🔥 Nổi bật', onRemove: () => { setHotOnly(false); setPage(1); } });
  if (maxPrice < MAX_PRICE) chips.push({ label: `≤ ${fmtPrice(maxPrice)}`, onRemove: () => { setMaxPrice(MAX_PRICE); setPage(1); } });

  const activeFilterCount = (selectedCat ? 1 : 0) + (hotOnly ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0);

  function resetFilters() {
    setSelectedCat(null); setHotOnly(false); setMaxPrice(MAX_PRICE); setSortBy('newest'); setPage(1);
  }

  const sharedFilterProps = {
    categories, selectedCat, setSelectedCat, sortBy, setSortBy,
    hotOnly, setHotOnly, maxPrice, setMaxPrice, setPage, total, products,
    showSortDropdown, setShowSortDropdown, resetFilters,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA', fontFamily: 'Roboto, sans-serif' }}>
      <Header />

      {/* ── Mobile filter drawer overlay ── */}
      <div className={`filter-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <div className={`filter-drawer${drawerOpen ? ' open' : ''}`}>
        <FilterPanel {...sharedFilterProps} onClose={() => setDrawerOpen(false)} />
      </div>

      <div style={{ paddingTop: 'var(--header-h)', flex: 1 }}>
        <div className="page-wrap" style={{ paddingTop: '12px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
              <HomeIcon />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889' }}>Trang chủ</span>
            </Link>
            <ChevronIcon />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d' }}>Tất cả sản phẩm</span>
          </nav>

          {/* ── MOBILE: top filter bar ── */}
          <div className="shop-filter-bar" style={{ gap: '8px', alignItems: 'center' }}>
            {/* Filter button */}
            <button onClick={() => setDrawerOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', background: '#fff', border: '1.5px solid #EBEBEB', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#191c1d', flexShrink: 0, position: 'relative' }}>
              <FilterIcon />
              Bộ lọc
              {activeFilterCount > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#6CC51D', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Active chips scroll */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', flex: 1 }}>
              {chips.map((chip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '10px', background: i === 0 && !selectedCat ? '#EBFFD7' : '#F4F5F9', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: i === 0 && !selectedCat ? '#356b00' : '#191c1d', whiteSpace: 'nowrap' }}>{chip.label}</span>
                  {((i === 0 && selectedCat) || (i > 0)) && (
                    <button onClick={chip.onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', lineHeight: 0 }}>
                      {i === 0 ? <XIcon /> : <XIconGray />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── MAIN LAYOUT: sidebar + content ── */}
          <div className="shop-layout">

            {/* ════ LEFT SIDEBAR (desktop only) ════ */}
            <aside className="shop-sidebar-desktop" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', padding: '20px', flexDirection: 'column', gap: '0', position: 'sticky', top: '90px' }}>
              <FilterPanel {...sharedFilterProps} onClose={undefined} />
            </aside>

            {/* ════ RIGHT COLUMN ════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Status bar */}
              <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#868889' }}>
                  Hiển thị <strong style={{ color: '#191c1d' }}>{products.length}</strong> / <strong style={{ color: '#191c1d' }}>{total}</strong> sản phẩm
                </span>
                {/* Desktop chips */}
                <div className="hide-on-mobile" style={{ gap: '6px', flexWrap: 'wrap' }}>
                  {chips.map((chip, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', background: i === 0 && !selectedCat ? '#EBFFD7' : '#F4F5F9' }}>
                      <span style={{ fontSize: '11px', fontWeight: 500, color: i === 0 && !selectedCat ? '#356b00' : '#191c1d' }}>{chip.label}</span>
                      {((i === 0 && selectedCat) || (i > 0)) && (
                        <button onClick={chip.onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', lineHeight: 0 }}>
                          {i === 0 ? <XIcon /> : <XIconGray />}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product grid */}
              {isLoading ? (
                <div className="shop-product-grid">
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
              ) : (
                <div className="shop-product-grid">
                  {products.map((p: any, i: number) => (
                    <ProductCard key={p.id} product={p} rank={p.isHot ? i + 1 : undefined} />
                  ))}
                </div>
              )}

              {/* Trust banner */}
              {!isLoading && products.length > 0 && (
                <div style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>
                  <div style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6CC51D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🛡</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#191c1d', marginBottom: '2px' }}>Cam kết chất lượng thực phẩm Tạp hóa SIN</div>
                    <div style={{ fontSize: '12px', color: '#868889', lineHeight: '1.5' }}>100% nguyên liệu tươi sạch, đóng gói hút chân không, đổi trả miễn phí trong 24h nếu không đúng cam kết.</div>
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
