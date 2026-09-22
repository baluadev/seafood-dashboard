'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCategories, useProducts, useSliders } from '@/hooks/use-products';
import { useAddToCart } from '@/hooks/use-cart';
import { useState, useEffect } from 'react';

/* ---- Live Toast data ---- */
const TOASTS = [
  { name: 'Chi Lan', item: 'Bo sap Dak Lak', district: 'Hoan Kiem' },
  { name: 'Anh Minh', item: 'Ca hoi Nauy fillet', district: 'Cau Giay' },
  { name: 'Chi Hoa', item: 'Rau cu huu co Da Lat', district: 'Dong Da' },
  { name: 'Anh Tuan', item: 'Thit bo Uc Wagyu', district: 'Tay Ho' },
];

/* ---- Static reviews ---- */
const REVIEWS = [
  {
    name: 'Chi Thao Nguyen',
    location: 'Cau Giay, Ha Noi',
    tier: 'Khach hang Platinum',
    quote: '"Tu ngay dat hang tren Tap hoa SIN, minh tiet kiem duoc 2 tieng di sieu thi moi chieu. Rau cu tuoi roi roi, dong goi can than bang tui giay than thien moi truong."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqCOLrVurfjdKDLkYcg8dReBtADprMjsql99FZEbTqRhKKePQY6uqBfG5jSbQiYvzCKCiV7oEyuk9M19yBZ8YaLqCgFLtcdLmPcyOpVUEuxj2AoOF6Rg2m0EyX5yzoCud38A7KTT6VKOjkPAaXbsjVvrxQ9yG4sbF8MRUYktsdjO99zY9ETD6mEQtE0hmPWpttizOkIJKpWv-UNZXBZGxT_4Ab4EgEaNBs6-',
  },
  {
    name: 'Anh Hoang Long',
    location: 'Quan 2, TP. Ho Chi Minh',
    tier: 'Khach hang than thiet',
    quote: '"Giao hang sieu toc dung 1 tieng 20 phut la toi noi! Thit bo va ca hoi rat tuoi, con nguyen tui da gel lanh buot. Chinh sach hoan tien neu dap nat lam minh cuc ky yen tam."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoi5DT6TYECs73P1coGijNHpLlnYdmg5n0rqEaLzykJpiXFYkQC4NdHjUP8FdFQY0eetGZ84TtPDZoEVgFwjTj4_8a8ai-uNZTupoOifqn_hfkYy0f-8-Ia727dx2izUV8SM1RnXl0y8hbFkYro-wC7HlHuKNUrpePug070rUA_s4iRYyTPevCf1DZuBxIIIhHHqGlVN1XMIobNIU3o4jfoc2nEBWveD0u8KskiuHGgDEVSRJRGNwh',
  },
  {
    name: 'Chi Minh Trang',
    location: 'Binh Thanh, TP. Ho Chi Minh',
    tier: 'Thanh vien VIP',
    quote: '"Gia dinh co be nho nen minh rat khat khe ve nguon goc thuc pham. Nho Tap hoa SIN co thong tin ro rang nen minh hoan toan tin cay nau an cho ca nha."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_knXDFBI8RKJVi58E_dwSKYAZmJDVXA-RBw5w_xQF5F88S40QM7T_V7FtvVJTNSskRn3gG-UFHkXkZMqKX7gOftJiWjUOP3daGAsOTTpH7NoJc_x9pQcmU9XdDC8arogLgr58RBalyokzGTIiTpULhpfyv_d5tVfdZDdI7FK3IL-6ZvCMzdgTSkQ9p8X1nr-pun359HlUJSk4utLhQ3c79OtisUuQEn9VdtmKujJoSdCOrcZ5VOaA',
  },
];

/* ---- Default fallback category icons ---- */
const CAT_ICON_EMOJI: Record<string, string> = {
  default: '🛒',
  rau: '🥬',
  trai: '🍎',
  thit: '🥩',
  hai: '🦐',
  sua: '🥛',
  trung: '🥚',
  banh: '🍞',
  do: '🥤',
  gia: '🧄',
};

function getCatEmoji(name: string) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(CAT_ICON_EMOJI)) {
    if (key !== 'default' && lower.includes(key)) return CAT_ICON_EMOJI[key];
  }
  return CAT_ICON_EMOJI.default;
}

function fmt(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('vi-VN').format(num) + '\u0111';
}

function calcOriginalPrice(price: number | string, discountRate: number | string) {
  const p = typeof price === 'string' ? parseFloat(price) : price;
  const d = typeof discountRate === 'string' ? parseFloat(discountRate) : discountRate;
  if (!d || d <= 0) return null;
  return p / (1 - d);
}

export default function HomePage() {
  const { data: sliders, isLoading: loadingSliders } = useSliders();
  const { data: categories, isLoading: loadingCats } = useCategories();
  // isHot phải là string 'true' theo ProductQueryDto
  const { data: hotProductsRes, isLoading: loadingHot } = useProducts({ isHot: 'true', limit: 8 });
  const hotProducts = (hotProductsRes as any)?.data ?? hotProductsRes;
  const { mutate: addToCart } = useAddToCart();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [toast, setToast] = useState(TOASTS[0]);
  const [showToast, setShowToast] = useState(true);

  // Auto-rotate slider
  useEffect(() => {
    if (!sliders || (sliders as any[]).length <= 1) return;
    const t = setInterval(() => setActiveSlide(i => (i + 1) % (sliders as any[]).length), 4000);
    return () => clearInterval(t);
  }, [sliders]);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % TOASTS.length;
      setToast(TOASTS[idx]);
      setShowToast(true);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa', fontFamily: 'Poppins, sans-serif' }}>
      <Header />

      <main style={{ flex: 1, width: '100%', paddingTop: '80px' }}>

        {/* ===== 1. HERO SLIDER ===== */}
        <section style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '24px 40px 16px' }}>
          {loadingSliders ? (
            <div style={{ height: '400px', background: '#F4F5F9', borderRadius: '32px', animation: 'pulse 1.5s infinite' }} />
          ) : (
            (() => {
              const slides: any[] = Array.isArray(sliders) && (sliders as any[]).length > 0
                ? sliders as any[]
                : [{ id: 'fallback', title: 'Thực phẩm tươi sạch giao tận nhà', subtitle: 'ƯU ĐÃI KHÁCH HÀNG MỚI', description: 'Nông sản được thu hoạch trực tiếp từ nông trại, đạt chứng nhận hữu cơ quốc tế.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs1t-tN1UlJuMo3wSMMRuUVirvC3mmwkqqQrBIYEfYY7I82J_arlxGzbasc8Vl-UhNJQkXNtEDdrkvw9Q4BIn2B5v7DbIdYkX03ZKp5k9qsCkBFELfjtTqSUWIiYcYwXE7xDGxa0vk6Z5iqLQQeB2WTGDS7hjEnW_g50CtooyY-DfGse2Wrt7NH8Gd53eMZwWMkumG_1kt5eLQ2jKEmmq2WphjE6k2pjljwuvMxJ137zJYfxIZZNhw', linkUrl: '/shop' }];
              const current = slides[activeSlide];
              return (
                <div style={{ position: 'relative', width: '100%', borderRadius: '32px', background: '#fff', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', display: 'grid', gridTemplateColumns: '7fr 5fr', minHeight: '400px' }}>
                  {/* Text side */}
                  <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                    {current.subtitle && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EBFFD7', color: '#356b00', padding: '6px 14px', borderRadius: '999px', width: 'fit-content', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>
                        &#10003; {current.subtitle}
                      </div>
                    )}
                    <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#000', lineHeight: 1.25, margin: 0 }}>
                      {current.title.split(' ').map((w: string, i: number) =>
                        i < 3 ? w + ' ' : i === 3 ? <span key={i} style={{ color: '#6CC51D' }}>{w} </span> : w + ' '
                      )}
                    </h1>
                    {current.description && (
                      <p style={{ fontSize: '15px', color: '#868889', lineHeight: 1.6, maxWidth: '480px', margin: 0 }}>
                        {current.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                      <Link href={current.linkUrl || '/shop'} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#4CAF18', color: '#fff', fontWeight: 600, fontSize: '15px', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(76,175,24,0.3)', textDecoration: 'none' }}>
                        Mua sắm ngay &rarr;
                      </Link>
                      <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EBFFD7', color: '#356b00', fontWeight: 600, fontSize: '15px', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none' }}>
                        &#128293; Xem tất cả
                      </Link>
                    </div>
                    {/* Slide dots */}
                    {slides.length > 1 && (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                        {slides.map((_: any, i: number) => (
                          <button key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === activeSlide ? '#6CC51D' : '#C8C8C8', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Image side */}
                  <div style={{ position: 'relative', background: '#F4F5F9', minHeight: '300px' }}>
                    <Image src={current.imageUrl} alt={current.title} fill style={{ objectFit: 'cover', transition: 'opacity 0.5s' }} unoptimized />
                  </div>
                </div>
              );
            })()
          )}
        </section>

        {/* ===== 2. CATEGORY GRID ===== */}
        <section style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '16px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6CC51D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                DANH MỤC THỰC PHẨM
              </div>
            </div>
            <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6CC51D', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Xem tất cả &rsaquo;
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
            {loadingCats
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ height: '128px', background: '#F4F5F9', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
                ))
              : (Array.isArray(categories) && categories.length > 0 ? categories : [
                  { id: '1', name: 'Trai cay tuoi', slug: 'trai-cay', imageUrl: null },
                  { id: '2', name: 'Rau cu huu co', slug: 'rau-cu', imageUrl: null },
                  { id: '3', name: 'Thit & Hai san', slug: 'thit-hai-san', imageUrl: null },
                  { id: '4', name: 'Sua & Trung', slug: 'sua-trung', imageUrl: null },
                  { id: '5', name: 'Do uong sach', slug: 'do-uong', imageUrl: null },
                  { id: '6', name: 'Banh mi & Hat', slug: 'banh-hat', imageUrl: null },
                ]).slice(0, 6).map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      background: '#F4F5F9', borderRadius: '12px', padding: '16px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                      cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fff', e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#F4F5F9', e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
                    >
                      <div style={{
                        width: '72px', height: '72px', borderRadius: '50%', background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '10px', overflow: 'hidden',
                      }}>
                        {cat.imageUrl ? (
                          <Image src={cat.imageUrl} alt={cat.name} width={56} height={56} style={{ objectFit: 'cover', borderRadius: '50%' }} unoptimized />
                        ) : (
                          <span style={{ fontSize: '28px' }}>{getCatEmoji(cat.name)}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#000', lineHeight: 1.3 }}>{cat.name}</div>
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        {/* ===== 3. DUAL PROMO BANNERS ===== */}
        <section style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '8px 40px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Promo 1 - Green light */}
            <div style={{
              position: 'relative', background: '#EBFFD7', borderRadius: '32px',
              padding: '32px', overflow: 'hidden', minHeight: '220px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            }}>
              <div style={{ zIndex: 1, maxWidth: '240px' }}>
                <span style={{
                  background: '#fff', color: '#6CC51D', fontSize: '12px', fontWeight: 700,
                  padding: '4px 12px', borderRadius: '999px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  display: 'inline-block',
                }}>
                  TUOI MOI MOI NGAY
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#000', margin: '12px 0 8px' }}>
                  Trai cay nhiet doi tuoi moi
                </h3>
                <p style={{ fontSize: '14px', color: '#486f21', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Giam ngay 20% cho xoai cat Hoa Loc, buoi da xanh &amp; dua luoi hom nay.
                </p>
                <Link href="/shop" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: '#4CAF18', color: '#fff', fontSize: '13px', fontWeight: 700,
                  padding: '8px 16px', borderRadius: '10px', textDecoration: 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                }}>
                  Kham pha ngay &rarr;
                </Link>
              </div>
              <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', width: '200px', height: '200px', pointerEvents: 'none' }}>
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOEU5bFU4sRC9LaOCK7h9rGA7aff-zL2pNPRU-RkRQl4Q-6-Iu3uK99lvdd9aVwbNBitKikZOy5pZXvn4jMexBOe71AmuAIFpO4unvnLY8urvpT5-BVf-ptbDMzy3vVhUu9p-uc93Pyzpb_CSe6wzmnvd27G2xtPtHN1PlRiY-0I0819pK3D9w4qYf8EJRCZwTSY6bc5tLS4FIvKO2NKnzL-VXRcUX2viYQYGSGIl5cb9hdWgtoi3f"
                  alt="Tropical fruit" fill style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }} unoptimized
                />
              </div>
            </div>
            {/* Promo 2 - Soft green */}
            <div style={{
              position: 'relative', background: '#c2f193', borderRadius: '32px',
              padding: '32px', overflow: 'hidden', minHeight: '220px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            }}>
              <div style={{ zIndex: 1, maxWidth: '240px' }}>
                <span style={{
                  background: '#fff', color: '#356b00', fontSize: '12px', fontWeight: 700,
                  padding: '4px 12px', borderRadius: '999px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  display: 'inline-block',
                }}>
                  SONG KHOE MOI NGAY
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#000', margin: '12px 0 8px' }}>
                  Bua an thuan Organic
                </h3>
                <p style={{ fontSize: '14px', color: '#2b5002', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Combo rau cu canh tac khong thuoc tru sau, an toan cho ca be.
                </p>
                <Link href="/shop" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: '#356b00', color: '#fff', fontSize: '13px', fontWeight: 700,
                  padding: '8px 16px', borderRadius: '10px', textDecoration: 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                }}>
                  Xem goi combo &rarr;
                </Link>
              </div>
              <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', width: '200px', height: '200px', pointerEvents: 'none' }}>
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpmqctM99OREDe7atbssNm12omHC81PHuq0pFNzcT2JVvlgcFA1C3hw2jfLs8SD7XmHffJhrClcC_-bzIZ6VutDck-1d_fkzDmLzDfzajl3tKsJN7z2IgNQcRo4iE8C18SnrEzE9x9eQ9rsQ2FHf7lU2BCTQFkucmv2a1HTot9trP4sCToz8HgrYUlQjC0ytyzM-5PrKgs52i7V-LEzOimdwGG25YAFi54cA3tsI6Lm_LlhTCpnTbj"
                  alt="Organic veggies" fill style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }} unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== 4. BEST SELLERS ===== */}
        <section style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '16px 40px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6CC51D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                LỰA CHỌN HÀNG ĐẦU
              </div>
            </div>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '4px', background: '#F4F5F9', padding: '4px', borderRadius: '12px', overflow: 'hidden' }}>
              {[{ id: 'all', label: 'Tat ca' }, { id: 'hot', label: 'Hot' }, { id: 'new', label: 'Moi' }].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '6px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: activeTab === tab.id ? 700 : 500,
                    background: activeTab === tab.id ? '#fff' : 'transparent',
                    color: activeTab === tab.id ? '#6CC51D' : '#868889',
                    border: 'none', cursor: 'pointer',
                    boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {loadingHot
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ height: '192px', background: '#F4F5F9' }} />
                    <div style={{ padding: '16px' }}>
                      <div style={{ height: '12px', background: '#EBEBEB', borderRadius: '6px', marginBottom: '8px', width: '60%' }} />
                      <div style={{ height: '14px', background: '#EBEBEB', borderRadius: '6px', marginBottom: '8px', width: '80%' }} />
                      <div style={{ height: '14px', background: '#EBEBEB', borderRadius: '6px', width: '40%' }} />
                    </div>
                  </div>
                ))
              : (Array.isArray(hotProducts) && hotProducts.length > 0 ? hotProducts : [
                  { id: '1', name: 'Ot chuong Sweet Palermo huu co Da Lat', price: 42000, originalPrice: 50000, slug: 'ot-chuong', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIKv9cqakg7WII4D3r97OEJUTGGiUbKq-iJMfXSejiv7cK5mvgyXdBRbPW4YqUVqkxlflXnD8v934oQroWkvk9hd7MsomfEhqThiWHKZp0uXY-4OPDPNAnibjXvliFCTraOit0-wi_NMdlRS3DWNnNKTdsJ9LnXK9obbvmZi7g3h9aW-gaVCI-HJxlPH488whpshCr8L2_xKul__EsA9zQ665RXhgbU048TZdrFt7s9c4r66dkBLC_', isHot: true, origin: 'Da Lat', unit: 'Tui 500g' },
                  { id: '2', name: 'Ca hoi Nauy Fillet tuoi cat khuc trong ngay', price: 185000, originalPrice: 210000, slug: 'ca-hoi-nauy', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy_bZ3VZlDZEwpdP9CUtk-gpWZqHd9lnl1wUBSvDd5I5KmPdXyaKlgupKym5bbDZHtnHOR8HdG5muJJS36GhJEWjuenpWg4XwtzDpP1YYFwR3wKob2AFaB36M2DbnmGO28hXp8S3ve7U5t6hpLn-V0GouCJRJenW23_9XtHH52yO1fy9TrHxFmkzKOp7yrVjBafJ1fudQ9GuzM_nbd-fcTzR7uidJJIxrgshySTzJlFHV9uqzVLTjv', isHot: false, origin: 'Nauy', unit: 'Khay 300g' },
                  { id: '3', name: 'Mang tay xanh huu co gion ngot tu nhien', price: 48000, originalPrice: 60000, slug: 'mang-tay', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoWMF1HKvb_CT2XthzAnNsa-mAOo9WQl_6OnmBA01LJ-rTtSka_WVGEJklO4Zh7t1rx4odd4W8TENeMNV_L9C92ZANDeTagUp5zhWOr_4iUYmGCdr4gri48kYer207vpGOU_5sPCwEnpGSbm1P7oKfN6EbnxEA03BTTn91RP1QM4RRCELlAycRRHYS1VhA5410DTV4SXzKQxqLEA6g5pV3GA87u-nKmRgZ9fCCdbFXCFbJHw9eA05t', isHot: false, origin: 'Bac Ha', unit: 'Bo 400g' },
                  { id: '4', name: 'Viet quat tuoi nhap khau huu co Chile', price: 69000, originalPrice: 85000, slug: 'viet-quat', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJfIXD3VMU8_mXUTgFXs1BrbQmvTgaer3iS2Fd3pPxFuuaiVrDcxbVyENCF9HWDJ-4VpzDCTTbbdOnHLTlPPoXZmAohZOQ-ioyAX5KtX1hAoKo4vTtKi_kwWM1vhbziO07loly21AccB8kx5x35hIFmc1EAxD0qbpKuVi3edYDJNQkbAGeOPQO88bIrSmVsz6kREyn_xt7D5I_1Obv8x1ucrcbSynTd9SlSRQkMFTEXY46u8_IwJfh', isHot: false, origin: 'Chile', unit: 'Hop 125g' },
                ]).slice(0, 8).map((product: any) => (
                  <div key={product.id} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {/* Image */}
                    <div style={{ width: '100%', height: '192px', background: '#F4F5F9', position: 'relative', overflow: 'hidden' }}>
                      {product.isHot && (
                        <span style={{
                          position: 'absolute', top: '8px', left: '8px', zIndex: 1,
                          background: '#EBFFD7', color: '#356b00', fontSize: '11px', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '999px',
                        }}>
                          Bán chạy
                        </span>
                      )}
                      {product.thumbnailUrl ? (
                        <Image src={product.thumbnailUrl} alt={product.title} fill style={{ objectFit: 'cover', transition: 'transform 0.3s' }} unoptimized />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '48px' }}>
                          &#128722;
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {product.category?.name && (
                        <span style={{ fontSize: '12px', color: '#868889' }}>{product.category.name}{product.unit ? ` • ${product.unit}` : ''}</span>
                      )}
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#000', margin: 0, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        <Link href={`/shop/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>{product.title}</Link>
                      </h3>
                      {product.avgRating > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span style={{ fontSize: '13px', color: '#FFB800' }}>&#9733;</span>
                          <span style={{ fontSize: '12px', color: '#868889' }}>{product.avgRating.toFixed(1)} ({product.reviewCount})</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#000' }}>{fmt(product.price)}</span>
                        {(() => {
                          const orig = calcOriginalPrice(product.price, product.discountRate);
                          return orig ? <span style={{ fontSize: '12px', color: '#868889', textDecoration: 'line-through' }}>{fmt(orig)}</span> : null;
                        })()}
                        {parseFloat(product.discountRate) > 0 && (
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>
                            -{Math.round(parseFloat(product.discountRate) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Add to cart */}
                    <div style={{ padding: '0 16px 16px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                        style={{
                          background: '#4CAF18', color: '#fff', width: '40px', height: '40px',
                          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: 'none', cursor: 'pointer', fontSize: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                          transition: 'background 0.2s',
                        }}
                        title="Them vao gio hang"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/shop" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '1.5px solid #EBEBEB', color: '#6CC51D', fontWeight: 600, fontSize: '14px',
              padding: '12px 32px', borderRadius: '12px', textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              Xem tat ca san pham &rarr;
            </Link>
          </div>
        </section>

        {/* ===== 5. CUSTOMER REVIEWS ===== */}
        <section style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '16px 40px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6CC51D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                KHACH HANG TIN TUONG
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#000', margin: 0 }}>Hon 50,000+ bua an ngon moi thang</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#6CC51D' }}>4.9 / 5</span>
              <span style={{ color: '#6CC51D', fontSize: '18px' }}>&#9733; &#9733; &#9733; &#9733; &#9733;</span>
              <span style={{ fontSize: '12px', color: '#868889' }}>(Google Reviews)</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#6CC51D', fontSize: '18px', marginBottom: '12px' }}>
                    &#9733; &#9733; &#9733; &#9733; &#9733;
                  </div>
                  <p style={{ fontSize: '14px', color: '#000', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>{r.quote}</p>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #EBEBEB' }}>
                  <Image src={r.avatar} alt={r.name} width={44} height={44} style={{ borderRadius: '50%', objectFit: 'cover' }} unoptimized />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#000' }}>{r.name}</div>
                    <div style={{ fontSize: '12px', color: '#868889' }}>{r.location} &bull; {r.tier}</div>
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
        <div style={{
          position: 'fixed', bottom: '24px', left: '24px', zIndex: 9999,
          background: '#fff', borderRadius: '999px', padding: '12px 20px 12px 12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '12px',
          maxWidth: '320px', transition: 'all 0.5s',
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EBFFD7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
            &#128722;
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {toast.name} vua dat {toast.item}
            </div>
            <div style={{ fontSize: '11px', color: '#868889' }}>Cach day 2 phut &bull; {toast.district}</div>
          </div>
          <button onClick={() => setShowToast(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#868889', fontSize: '16px', padding: '2px', flexShrink: 0 }}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
