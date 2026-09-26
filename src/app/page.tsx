'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCategories, useProducts, useSliders } from '@/hooks/use-products';
import { usePromotions } from '@/hooks/use-promotions';
import { useAddToCart } from '@/hooks/use-cart';
import { ProductCard, ProductCardSkeleton } from '@/components/product-card';
import { useState, useEffect } from 'react';

/* ---- Live Toast data ---- */
const TOASTS = [
  { name: 'Chị Lan', item: 'Bơ sáp Đắk Lắk', district: 'Hoàn Kiếm' },
  { name: 'Anh Minh', item: 'Cá hồi Nauy fillet', district: 'Cầu Giấy' },
  { name: 'Chị Hoa', item: 'Rau củ hữu cơ Đà Lạt', district: 'Đống Đa' },
  { name: 'Anh Tuấn', item: 'Thịt bò Úc Wagyu', district: 'Tây Hồ' },
];

/* ---- Static reviews ---- */
const REVIEWS = [
  {
    name: 'Chị Thảo Nguyên',
    location: 'Cầu Giấy, Hà Nội',
    tier: 'Khách hàng Platinum',
    quote: '"Từ ngày đặt hàng trên Tạp hóa SIN, mình tiết kiệm được 2 tiếng đi siêu thị mỗi chiều. Rau củ tươi rói, đóng gói cẩn thận bằng túi giấy thân thiện môi trường."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqCOLrVurfjdKDLkYcg8dReBtADprMjsql99FZEbTqRhKKePQY6uqBfG5jSbQiYvzCKCiV7oEyuk9M19yBZ8YaLqCgFLtcdLmPcyOpVUEuxj2AoOF6Rg2m0EyX5yzoCud38A7KTT6VKOjkPAaXbsjVvrxQ9yG4sbF8MRUYktsdjO99zY9ETD6mEQtE0hmPWpttizOkIJKpWv-UNZXBZGxT_4Ab4EgEaNBs6-',
  },
  {
    name: 'Anh Hoàng Long',
    location: 'Quận 2, TP. Hồ Chí Minh',
    tier: 'Khách hàng thân thiết',
    quote: '"Giao hàng siêu tốc đúng 1 tiếng 20 phút là tới nơi! Thịt bò Úc và cá hồi rất tươi, còn nguyên túi đá gel lạnh buốt. Chính sách hoàn tiền nếu đập nát làm mình cực kỳ yên tâm."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoi5DT6TYECs73P1coGijNHpLlnYdmg5n0rqEaLzykJpiXFYkQC4NdHjUP8FdFQY0eetGZ84TtPDZoEVgFwjTj4_8a8ai-uNZTupoOifqn_hfkYy0f-8-Ia727dx2izUV8SM1RnXl0y8hbFkYro-wC7HlHuKNUrpePug070rUA_s4iRYyTPevCf1DZuBxIIIhHHqGlVN1XMIobNIU3o4jfoc2nEBWveD0u8KskiuHGgDEVSRJRGNwh',
  },
  {
    name: 'Chị Minh Trang',
    location: 'Bình Thạnh, TP. Hồ Chí Minh',
    tier: 'Thành viên VIP',
    quote: '"Gia đình có bé nhỏ nên mình rất khắt khe về nguồn gốc thực phẩm. Nhờ Tạp hóa SIN có thông tin rõ ràng nên mình hoàn toàn tin cậy nấu ăn cho cả nhà."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_knXDFBI8RKJVi58E_dwSKYAZmJDVXA-RBw5w_xQF5F88S40QM7T_V7FtvVJTNSskRn3gG-UFHkXkZMqKX7gOftJiWjUOP3daGAsOTTpH7NoJc_x9pQcmU9XdDC8arogLgr58RBalyokzGTIiTpULhpfyv_d5tVfdZDdI7FK3IL-6ZvCMzdgTSkQ9p8X1nr-pun359HlUJSk4utLhQ3c79OtisUuQEn9VdtmKujJoSdCOrcZ5VOaA',
  },
];

/* ---- Default fallback category icons ---- */
const CAT_ICON_EMOJI: Record<string, string> = {
  default: '🛒', rau: '🥬', trai: '🍎', thit: '🥩', hai: '🦐',
  sua: '🥛', trung: '🥚', banh: '🍞', do: '🥤', gia: '🧄',
};

function getCatEmoji(name: string) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(CAT_ICON_EMOJI)) {
    if (key !== 'default' && lower.includes(key)) return CAT_ICON_EMOJI[key];
  }
  return CAT_ICON_EMOJI.default;
}

/* ── Dynamic Promo Banners — Figma: rounded-12px ── */
function PromoBanners() {
  const { data: promos = [] } = usePromotions();
  if (promos.length === 0) return null;
  return (
    <section style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '16px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(promos.length, 2)}, 1fr)`, gap: '24px' }}>
        {promos.slice(0, 4).map((p, idx) => (
          <div key={p.id} style={{
            position: 'relative', background: idx === 0 ? '#ebffd7' : '#c2f193',
            borderRadius: '12px', padding: '24px', overflow: 'hidden', minHeight: '220px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}>
            {p.imageUrl && (
              <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', width: '224px', height: '224px', boxShadow: '0 2px 2px rgba(0,0,0,0.06), 0 4px 3px rgba(0,0,0,0.07)' }}>
                <Image src={p.imageUrl} alt={p.title} fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
            )}
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '320px' }}>
              <div style={{
                display: 'inline-block', background: '#fff', color: idx === 0 ? '#6cc51d' : '#356b00',
                fontSize: '12px', fontWeight: 700, padding: '3.5px 12px', borderRadius: '12px',
                boxShadow: '0 1px 1px rgba(0,0,0,0.05)', marginBottom: '7px',
              }}>{p.tag}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#000', margin: '0 0 4px', lineHeight: '28px' }}>{p.title}</h3>
              {p.description && <p style={{ fontSize: '14px', color: idx === 0 ? '#486f21' : '#2b5002', margin: '0 0 8px', lineHeight: '20px' }}>{p.description}</p>}
              <Link href={p.linkUrl || '/shop'} style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: idx === 0 ? '#6cc51d' : '#356b00', color: '#fff',
                fontSize: '12px', fontWeight: 700, padding: '4px 16px', borderRadius: '8px',
                textDecoration: 'none', boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
              }}>{p.buttonText} →</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function fmt(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('vi-VN').format(num) + '\u0111';
}

const FONT = "Roboto, sans-serif";

export default function HomePage() {
  const { data: sliders, isLoading: loadingSliders } = useSliders();
  const { data: categories, isLoading: loadingCats } = useCategories();
  const { data: hotProductsRes, isLoading: loadingHot } = useProducts({ isHot: 'true', limit: 8 });
  const hotProducts = (hotProductsRes as any)?.data ?? hotProductsRes;
  const { mutate: addToCart } = useAddToCart();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [toast, setToast] = useState(TOASTS[0]);
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    if (!sliders || (sliders as any[]).length <= 1) return;
    const t = setInterval(() => setActiveSlide(i => (i + 1) % (sliders as any[]).length), 4000);
    return () => clearInterval(t);
  }, [sliders]);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => { idx = (idx + 1) % TOASTS.length; setToast(TOASTS[idx]); setShowToast(true); }, 6000);
    return () => clearInterval(interval);
  }, []);

  const catData = (Array.isArray(categories) && categories.length > 0 ? categories : [
    { id: '1', name: 'Trái cây tươi', slug: 'trai-cay', imageUrl: null },
    { id: '2', name: 'Rau củ hữu cơ', slug: 'rau-cu', imageUrl: null },
    { id: '3', name: 'Thịt & Hải sản', slug: 'thit-hai-san', imageUrl: null },
    { id: '4', name: 'Sữa & Trứng', slug: 'sua-trung', imageUrl: null },
    { id: '5', name: 'Đồ uống sạch', slug: 'do-uong', imageUrl: null },
    { id: '6', name: 'Bánh mì & Hạt', slug: 'banh-hat', imageUrl: null },
  ]).slice(0, 6);
  const catCounts = ['120+', '85+', '60+', '45+', '55+', '70+'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa', fontFamily: FONT }}>
      <Header />
      <main style={{ flex: 1, width: '100%', paddingTop: '80px' }}>

        {/* ===== 1. HERO — Figma: rounded-12, grid 7:5, minH 325, p-32 ===== */}
        <section style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '32px 40px 24px' }}>
          {loadingSliders ? (
            <div style={{ height: '325px', background: '#F4F5F9', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
          ) : (() => {
            const slides: any[] = Array.isArray(sliders) && (sliders as any[]).length > 0
              ? sliders as any[]
              : [{ id: 'fb', title: 'Thực phẩm sạch & hữu cơ giao tận nhà trong 2 giờ', subtitle: 'ƯU ĐÃI KHÁCH HÀNG MỚI', description: 'Nông sản được thu hoạch trực tiếp từ nông trại Đà Lạt & Đồng Bằng Sông Cửu Long, đạt chứng nhận hữu cơ quốc tế và tiêu chuẩn VietGAP nghiêm ngặt.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs1t-tN1UlJuMo3wSMMRuUVirvC3mmwkqqQrBIYEfYY7I82J_arlxGzbasc8Vl-UhNJQkXNtEDdrkvw9Q4BIn2B5v7DbIdYkX03ZKp5k9qsCkBFELfjtTqSUWIiYcYwXE7xDGxa0vk6Z5iqLQQeB2WTGDS7hjEnW_g50CtooyY-DfGse2Wrt7NH8Gd53eMZwWMkumG_1kt5eLQ2jKEmmq2WphjE6k2pjljwuvMxJ137zJYfxIZZNhw', linkUrl: '/shop' }];
            const c = slides[activeSlide];
            const t = c.title || '';
            const gi = t.indexOf('giao tận nhà');
            return (
              <div style={{ width: '100%', borderRadius: '12px', background: '#fff', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '7fr 5fr', minHeight: '325px' }}>
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {c.subtitle && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EBFFD7', color: '#356b00', padding: '4px 12px', borderRadius: '12px', width: 'fit-content', fontSize: '12px', fontWeight: 600, letterSpacing: '0.3px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>
                      ✓ {c.subtitle}
                    </div>
                  )}
                  <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#000', lineHeight: '49.5px', letterSpacing: '-0.9px', margin: 0, paddingTop: '12px' }}>
                    {gi >= 0 ? <>{t.slice(0, gi)}<span style={{ color: '#6cc51d' }}>giao tận nhà</span>{t.slice(gi + 12)}</> : t}
                  </h1>
                  {c.description && <p style={{ fontSize: '15px', color: '#868889', lineHeight: '22px', maxWidth: '540px', margin: 0, paddingTop: '12px' }}>{c.description}</p>}
                  <div style={{ display: 'flex', gap: '12px', paddingTop: '24px' }}>
                    <Link href={c.linkUrl || '/shop'} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#6cc51d', color: '#fff', fontWeight: 600, fontSize: '15px', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)', textDecoration: 'none' }}>
                      Mua sắm ngay →
                    </Link>
                    <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EBFFD7', color: '#356b00', fontWeight: 600, fontSize: '15px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>
                      🔥 Xem tất cả
                    </Link>
                  </div>
                  {slides.length > 1 && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
                      {slides.map((_: any, i: number) => (
                        <button key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === activeSlide ? '#6CC51D' : '#C8C8C8', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ position: 'relative', background: '#F4F5F9', minHeight: '325px' }}>
                  <Image src={c.imageUrl} alt={c.title} fill style={{ objectFit: 'cover', transition: 'opacity 0.5s' }} unoptimized />
                </div>
              </div>
            );
          })()}
        </section>

        {/* ===== 2. CATEGORIES — Figma: icon 80×80 white rounded-12, name 15px Bold ===== */}
        <section style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '24px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6.5px', paddingTop: '5.5px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#356b00', textTransform: 'uppercase', letterSpacing: '0.6px' }}>DANH MỤC THỰC PHẨM</div>
              <div style={{ fontSize: '25px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>Khám phá theo gian hàng</div>
            </div>
            <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#356b00', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Xem tất cả danh mục ›</Link>
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {loadingCats
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ width: '186px', height: '152px', background: '#F4F5F9', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />)
              : catData.map((cat: any, idx: number) => (
                <Link key={cat.id} href={`/shop?category=${cat.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{ background: '#f4f5f9', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '186px', cursor: 'pointer', filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.05))' }}>
                    <div style={{ paddingBottom: '8px' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        {cat.imageUrl ? <Image src={cat.imageUrl} alt={cat.name} width={64} height={64} style={{ objectFit: 'cover' }} unoptimized /> : <span style={{ fontSize: '32px' }}>{getCatEmoji(cat.name)}</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#000', textAlign: 'center', lineHeight: '20px' }}>{cat.name}</div>
                    <div style={{ paddingTop: '4px', fontSize: '12px', fontWeight: 500, color: '#868889', textAlign: 'center' }}>{catCounts[idx] || '50+'} sản phẩm</div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* ===== 3. PROMO BANNERS ===== */}
        <PromoBanners />

        {/* ===== 4. BEST SELLERS — Figma: tabs Tất cả/Trái cây/Rau/Thịt, gap 24px ===== */}
        <section style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '24px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6.5px', paddingTop: '5.5px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#356b00', textTransform: 'uppercase', letterSpacing: '0.6px' }}>LỰA CHỌN HÀNG ĐẦU</div>
              <div style={{ fontSize: '25px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>Sản phẩm bán chạy nhất</div>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: '#F4F5F9', padding: '4px', borderRadius: '8px' }}>
              {[{ id: 'all', label: 'Tất cả' }, { id: 'fruit', label: 'Trái cây' }, { id: 'veg', label: 'Rau hữu cơ' }, { id: 'meat', label: 'Thịt & Hải sản' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  padding: '4px 12px', borderRadius: '8px', fontSize: '12px',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  background: activeTab === tab.id ? '#fff' : 'transparent',
                  color: activeTab === tab.id ? '#356b00' : '#868889',
                  border: 'none', cursor: 'pointer',
                  boxShadow: activeTab === tab.id ? '0 1px 1px rgba(0,0,0,0.05)' : 'none',
                }}>{tab.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {loadingHot
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : (Array.isArray(hotProducts) && hotProducts.length > 0 ? hotProducts : []).slice(0, 8).map((product: any, i: number) => (
                <ProductCard key={product.id} product={product} rank={i + 1} />
              ))}
          </div>
        </section>

        {/* ===== 5. REVIEWS — Figma node 1-260 ===== */}
        <section style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '24px 40px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '5.5px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#356b00', textTransform: 'uppercase', letterSpacing: '0.6px', lineHeight: '16px' }}>KHÁCH HÀNG TIN TƯỞNG</div>
              <div style={{ fontSize: '25px', fontWeight: 700, color: '#000', lineHeight: '32px', marginTop: '6.5px' }}>Hơn 50,000+ bữa ăn ngon mỗi tháng</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#356b00', lineHeight: '20px' }}>4.9 / 5</span>
              {/* Figma: 5 SVG star icons 15×14.25 */}
              {[0,1,2,3,4].map(i => (
                <svg key={i} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 0L9.18 5.18H14.66L10.24 8.38L11.92 13.56L7.5 10.36L3.08 13.56L4.76 8.38L0.34 5.18H5.82L7.5 0Z" fill="#6CC51D"/>
                </svg>
              ))}
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889', lineHeight: '16px' }}>(Google Reviews)</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: '8px', padding: '24px', flex: '1 0 0', minWidth: 0,
                filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.05))',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                {/* Stars + Quote */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0,1,2,3,4].map(j => (
                      <svg key={j} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 0L9.18 5.18H14.66L10.24 8.38L11.92 13.56L7.5 10.36L3.08 13.56L4.76 8.38L0.34 5.18H5.82L7.5 0Z" fill="#6CC51D"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize: '14px', color: '#000', fontStyle: 'italic', fontWeight: 400, lineHeight: '20px', margin: 0 }}>{r.quote}</p>
                </div>
                {/* Author — Figma: pt-16, then inner pt-12, no border */}
                <div style={{ paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '12px' }}>
                    <Image src={r.avatar} alt={r.name} width={48} height={48} style={{ borderRadius: '12px', objectFit: 'cover', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} unoptimized />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5.5px', paddingBottom: '2.5px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#000', lineHeight: '20px' }}>{r.name}</div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#868889', lineHeight: '16px' }}>{r.location} • {r.tier}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />

      {/* ===== 6. LIVE TOAST ===== */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 9999, background: '#fff', borderRadius: '999px', padding: '12px 20px 12px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '320px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EBFFD7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🛒</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{toast.name} vừa đặt {toast.item}</div>
            <div style={{ fontSize: '11px', color: '#868889' }}>Cách đây 2 phút &bull; {toast.district}</div>
          </div>
          <button onClick={() => setShowToast(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#868889', fontSize: '16px', padding: '2px', flexShrink: 0 }}>×</button>
        </div>
      )}
    </div>
  );
}
