'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCategories, useProducts } from '@/hooks/use-products';
import { useAddToCart } from '@/hooks/use-cart';
import { useState, useEffect } from 'react';

/* --- Live Toast ------ */
const TOASTS = [
  { name: 'Chị Lan', item: 'Bơ sáp Đắk Lắk', district: 'Hoàn Kiếm' },
  { name: 'Anh Minh', item: 'Cá hồi Nauy fillet', district: 'Cầu Giấy' },
  { name: 'Chị Hoa', item: 'Rau củ hữu cơ Đà Lạt', district: 'Đống Đa' },
  { name: 'Anh Tuấn', item: 'Thịt bò Úc Wagyu', district: 'Tây Hồ' },
];

/* --- Static reviews -- */
const REVIEWS = [
  { name: 'Chị Thảo Nguyên', location: 'Cầu Giấy, Hà Nội', tier: 'Khách hàng Platinum', quote: '"Từ ngày đặt hàng trên Tạp hóa SIN, mình tiết kiệm được 2 tiếng đi siêu thị mỗi chiều. Rau củ tươi roi rói, đóng gói cẩn thận bằng túi giấy thân thiện môi trường."', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqCOLrVurfjdKDLkYcg8dReBtADprMjsql99FZEbTqRhKKePQY6uqBfG5jSbQiYvzCKCiV7oEyuk9M19yBZ8YaLqCgFLtcdLmPcyOpVUEuxj2AoOF6Rg2m0EyX5yzoCud38A7KTT6VKOjkPAaXbsjVvrxQ9yG4sbF8MRUYktsdjO99zY9ETD6mEQtE0hmPWpttizOkIJKpWv-UNZXBZGxT_4Ab4EgEaNBs6-' },
  { name: 'Anh Hoàng Long', location: 'Quận 2, TP. HCM', tier: 'Khách hàng thân thiết', quote: '"Giao hàng siêu tốc đúng 1 tiếng 20 phút là tới nơi! Thịt bò và cá hồi rất tươi, còn nguyên túi đá gel lạnh buốt. Chính sách hoàn tiền nếu dập nát làm mình cực kỳ yên tâm."', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoi5DT6TYECs73P1coGijNHpLlnYdmg5n0rqEaLzykJpiXFYkQC4NdHjUP8FdFQY0eetGZ84TtPDZoEVgFwjTj4_8a8ai-uNZTupoOifqn_hfkYy0f-8-Ia727dx2izUV8SM1RnXl0y8hbFkYro-wC7HlHuKNUrpePug070rUA_s4iRYyTPevCf1DZuBxIIIhHHqGlVN1XMIobNIU3o4jfoc2nEBWveD0u8KskiuHGgDEVSRJRGNwh' },
  { name: 'Chị Minh Trang', location: 'Bình Thạnh, TP. HCM', tier: 'Thành viên VIP', quote: '"Gia đình có bé nhỏ nên mình rất khắt khe về nguồn gốc thực phẩm. Nhờ Tạp hóa SIN có thông tin rõ ràng nên mình hoàn toàn tin cậy nấu ăn cho cả nhà."', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_knXDFBI8RKJVi58E_dwSKYAZmJDVXA-RBw5w_xQF5F88S40QM7T_V7FtvVJTNSskRn3gG-UFHkXkZMqKX7gOftJiWjUOP3daGAsOTTpH7NoJc_x9pQcmU9XdDC8arogLgr58RBalyokzGTIiTpULhpfyv_d5tVfdZDdI7FK3IL-6ZvCMzdgTSkQ9p8X1nr-pun359HlUJSk4utLhQ3c79OtisUuQEn9VdtmKujJoSdCOrcZ5VOaA' },
];

/* --- Category icons map ---- */
const CAT_ICONS: Record<string, string> = {
  default: 'category',
  'rau': 'eco',
  'thit': 'set_meal',
  'hai san': 'phishing',
  'trai cay': 'nutrition',
  'sua': 'egg',
  'do uong': 'local_cafe',
  'banh': 'bakery_dining',
  'gia vi': 'kitchen',
};

function getCatIcon(name: string) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(CAT_ICONS)) {
    if (key !== 'default' && lower.includes(key)) return CAT_ICONS[key];
  }
  return CAT_ICONS.default;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}

export default function HomePage() {
  const { data: categories, isLoading: loadingCats } = useCategories();
  const { data: hotProducts, isLoading: loadingHot } = useProducts({ isHot: true, limit: 8 });
  const { mutate: addToCart } = useAddToCart();
  const [activeTab, setActiveTab] = useState('all');
  const [toast, setToast] = useState(TOASTS[0]);
  const [showToast, setShowToast] = useState(true);

  // Rotate live toast
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % TOASTS.length;
      setToast(TOASTS[idx]);
      setShowToast(true);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart({ productId: product.id, quantity: 1 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Header />

      <main className="flex-1 w-full">

        {/* -- 1. HERO BANNER ------ */}
        <section className="w-full px-[2.5rem] py-[1.5rem] pt-[5rem]">
          <div className="relative w-full rounded-[2rem] bg-white overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px]">
              {/* Text */}
              <div className="lg:col-span-7 p-[2rem] z-10 flex flex-col items-start justify-center">
                <div className="inline-flex items-center gap-2 bg-[#EBFFD7] text-[#356b00] px-4 py-1 rounded-full w-max shadow-sm mb-4">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="text-xs font-bold uppercase tracking-wide">Ưu đãi khách hàng mới</span>
                </div>
                <h1 className="text-[2.2rem] font-bold text-black leading-tight tracking-tight">
                  Mua sắm tiện lợi,{' '}
                  <br />
                  <span className="text-[#6CC51D]">giao tận nhà</span> trong ngày
                </h1>
                <p className="text-[#868889] text-[15px] mt-4 max-w-lg leading-relaxed">
                  Thực phẩm tươi sạch, hàng hóa đa dạng — đặt hàng nhanh chóng và nhận ngay tại cửa nhà bạn.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link href="/shop" className="inline-flex items-center gap-2 bg-[#6CC51D] hover:bg-[#5ab318] text-white font-semibold text-[15px] px-6 py-3 rounded-xl shadow-md transition-all">
                    <span>Mua sắm ngay</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>
                  <Link href="/shop" className="inline-flex items-center gap-2 bg-[#EBFFD7] hover:bg-[#d9fbb5] text-[#356b00] font-semibold text-[15px] px-6 py-3 rounded-xl transition-all">
                    <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
                    <span>Xem tất cả</span>
                  </Link>
                </div>
                {/* Trust badges */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {[
                    { icon: 'local_shipping', text: 'Giao trong ngày' },
                    { icon: 'verified_user', text: 'An toàn vệ sinh' },
                    { icon: 'headset_mic', text: 'Hỗ trợ 24/7' },
                  ].map(b => (
                    <div key={b.icon} className="flex items-center gap-1.5 text-[13px] text-[#868889]">
                      <span className="material-symbols-outlined text-[#6CC51D] text-[18px]">{b.icon}</span>
                      <span>{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Image */}
              <div className="lg:col-span-5 relative bg-[#F4F5F9] flex items-center justify-center overflow-hidden min-h-[280px]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs1t-tN1UlJuMo3wSMMRuUVirvC3mmwkqqQrBIYEfYY7I82J_arlxGzbasc8Vl-UhNJQkXNtEDdrkvw9Q4BIn2B5v7DbIdYkX03ZKp5k9qsCkBFELfjtTqSUWIiYcYwXE7xDGxa0vk6Z5iqLQQeB2WTGDS7hjEnW_g50CtooyY-DfGse2Wrt7NH8Gd53eMZwWMkumG_1kt5eLQ2jKEmmq2WphjE6k2pjljwuvMxJ137zJYfxIZZNhw"
                  alt="Fresh groceries"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* -- 2. CATEGORY GRID ---- */}
        <section className="w-full px-[2.5rem] py-[1.5rem]">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6CC51D]">Danh mục thực phẩm</span>
              <h2 className="text-[1.5rem] font-bold text-black mt-1">Khám phá theo gian hàng</h2>
            </div>
            <Link href="/shop" className="text-sm text-[#6CC51D] hover:text-[#4CAF18] flex items-center gap-1 font-semibold">
              Xem tất cả
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingCats
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-[#F4F5F9] h-32 animate-pulse" />
                ))
              : (categories as any[])?.filter((c: any) => c.isActive !== false).slice(0, 6).map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    className="group bg-[#F4F5F9] hover:bg-white rounded-xl p-4 flex flex-col items-center text-center transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="w-16 h-16 rounded-full bg-white group-hover:bg-[#EBFFD7] flex items-center justify-center transition-colors shadow-sm mb-3">
                      {cat.imageUrl ? (
                        <Image src={cat.imageUrl} alt={cat.name} width={48} height={48} className="object-contain rounded-full" unoptimized />
                      ) : (
                        <span className="material-symbols-outlined text-[#6CC51D] text-[28px]">{getCatIcon(cat.name)}</span>
                      )}
                    </div>
                    <h3 className="text-[14px] font-bold text-black group-hover:text-[#4CAF18] transition-colors line-clamp-2">{cat.name}</h3>
                  </Link>
                ))}
          </div>
        </section>

        {/* -- 3. DUAL PROMO BANNERS ----- */}
        <section className="w-full px-[2.5rem] py-[1rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promo 1 */}
            <div className="relative bg-[#EBFFD7] rounded-[2rem] p-8 overflow-hidden flex flex-col justify-between min-h-[200px] shadow-sm">
              <div className="z-10 max-w-xs">
                <span className="bg-white text-[#6CC51D] text-xs font-bold px-3 py-1 rounded-full shadow-sm">TƯƠI MỚI MỖI NGÀY</span>
                <h3 className="text-[1.25rem] font-bold text-black mt-3">Trái cây tươi mỗi ngày</h3>
                <p className="text-[14px] text-[#486f21] mt-1">Đa dạng sản phẩm trái cây tươi, đảm bảo chất lượng.</p>
                <Link href="/shop" className="mt-4 inline-flex items-center gap-1 bg-[#6CC51D] hover:bg-[#4CAF18] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors">
                  Khám phá ngay
                  <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                </Link>
              </div>
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOEU5bFU4sRC9LaOCK7h9rGA7aff-zL2pNPRU-RkRQl4Q-6-Iu3uK99lvdd9aVwbNBitKikZOy5pZXvn4jMexBOe71AmuAIFpO4unvnLY8urvpT5-BVf-ptbDMzy3vVhUu9p-uc93Pyzpb_CSe6wzmnvd27G2xtPtHN1PlRiY-0I0819pK3D9w4qYf8EJRCZwTSY6bc5tLS4FIvKO2NKnzL-VXRcUX2viYQYGSGIl5cb9hdWgtoi3f"
                alt="Trái cây"
                width={200}
                height={200}
                className="absolute -bottom-4 -right-4 object-contain drop-shadow-md pointer-events-none"
                unoptimized
              />
            </div>
            {/* Promo 2 */}
            <div className="relative bg-[#c2f193] rounded-[2rem] p-8 overflow-hidden flex flex-col justify-between min-h-[200px] shadow-sm">
              <div className="z-10 max-w-xs">
                <span className="bg-white text-[#356b00] text-xs font-bold px-3 py-1 rounded-full shadow-sm">SỐNG KHỎE MỖI NGÀY</span>
                <h3 className="text-[1.25rem] font-bold text-black mt-3">Thực phẩm tươi sạch</h3>
                <p className="text-[14px] text-[#2b5002] mt-1">Rau củ tươi sạch, đảm bảo an toàn cho cả gia đình.</p>
                <Link href="/shop" className="mt-4 inline-flex items-center gap-1 bg-[#356b00] text-white hover:bg-[#2b5002] text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors">
                  Xem ngay
                  <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                </Link>
              </div>
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpmqctM99OREDe7atbssNm12omHC81PHuq0pFNzcT2JVvlgcFA1C3hw2jfLs8SD7XmHffJhrClcC_-bzIZ6VutDck-1d_fkzDmLzDfzajl3tKsJN7z2IgNQcRo4iE8C18SnrEzE9x9eQ9rsQ2FHf7lU2BCTQFkucmv2a1HTot9trP4sCToz8HgrYUlQjC0ytyzM-5PrKgs52i7V-LEzOimdwGG25YAFi54cA3tsI6Lm_LlhTCpnTbj"
                alt="Rau củ"
                width={200}
                height={200}
                className="absolute -bottom-4 -right-4 object-contain drop-shadow-md pointer-events-none"
                unoptimized
              />
            </div>
          </div>
        </section>

        {/* -- 4. BEST SELLERS ----- */}
        <section className="w-full px-[2.5rem] py-[1.5rem]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6CC51D]">Lựa chọn hàng đầu</span>
              <h2 className="text-[1.5rem] font-bold text-black mt-1">Sản phẩm bán chạy nhất</h2>
            </div>
            {/* Category tabs */}
            <div className="flex items-center gap-1 bg-[#F4F5F9] p-1 rounded-xl overflow-x-auto">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'hot', label: '🔥 Hot' },
                { id: 'new', label: '✨ Mới' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-[#6CC51D] shadow-sm font-bold'
                      : 'text-[#868889] hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingHot
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="h-52 bg-[#F4F5F9] animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-[#EBEBEB] rounded animate-pulse w-1/2" />
                      <div className="h-4 bg-[#EBEBEB] rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-[#EBEBEB] rounded animate-pulse w-1/3" />
                    </div>
                  </div>
                ))
              : (hotProducts as any[])?.slice(0, 8).map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all group flex flex-col overflow-hidden"
                  >
                    {/* Image */}
                    <div className="w-full h-48 bg-[#F4F5F9] relative overflow-hidden">
                      {product.isHot && (
                        <span className="absolute top-2 left-2 z-10 bg-[#EBFFD7] text-[#356b00] text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          🔥 Bán chạy
                        </span>
                      )}
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="material-symbols-outlined text-[#EBEBEB] text-[64px]">image</span>
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-[14px] font-bold text-black line-clamp-2 mb-2">{product.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[16px] font-bold text-black">{formatPrice(product.price)}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[12px] text-[#868889] line-through">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                      {/* Add to cart */}
                      <div className="flex items-center justify-end mt-3">
                        <button
                          onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                          className="bg-[#6CC51D] hover:bg-[#4CAF18] text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors"
                          title="Thêm vào giỏ hàng"
                        >
                          <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/shop" className="inline-flex items-center gap-2 border border-[#EBEBEB] hover:border-[#6CC51D] text-[#6CC51D] font-semibold text-[14px] px-8 py-3 rounded-xl transition-all hover:bg-[#EBFFD7]">
              Xem tất cả sản phẩm
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* -- 5. CUSTOMER REVIEWS ------- */}
        <section className="w-full px-[2.5rem] py-[1.5rem]">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6CC51D]">Khách hàng tin tưởng</span>
              <h2 className="text-[1.5rem] font-bold text-black mt-1">Hơn 10,000+ khách hàng hài lòng</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[15px] text-[#6CC51D] font-bold">4.9 / 5</span>
              <div className="flex text-[#6CC51D]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                ))}
              </div>
              <span className="text-[12px] text-[#868889]">(Google Reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[#6CC51D] mb-3">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    ))}
                  </div>
                  <p className="text-[14px] text-black italic leading-relaxed">{r.quote}</p>
                </div>
                <div className="mt-5 flex items-center gap-3 pt-4 border-t border-[#EBEBEB]">
                  <Image src={r.avatar} alt={r.name} width={44} height={44} className="rounded-full object-cover shadow-sm" unoptimized />
                  <div>
                    <h4 className="text-[14px] font-bold text-black">{r.name}</h4>
                    <span className="text-[12px] text-[#868889]">{r.location} • {r.tier}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />

      {/* -- 6. LIVE TOAST ------- */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-white rounded-full px-4 py-3 shadow-xl flex items-center gap-3 transition-all duration-500 max-w-xs">
          <div className="w-10 h-10 rounded-full bg-[#EBFFD7] flex items-center justify-center text-[#6CC51D] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[12px] font-bold text-black truncate">{toast.name} vừa đặt {toast.item}</span>
            <span className="text-[11px] text-[#868889]">Cách đây 2 phút • {toast.district}</span>
          </div>
          <button onClick={() => setShowToast(false)} className="text-[#868889] hover:text-black flex-shrink-0">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
