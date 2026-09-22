'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data: cart } = useCart();
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartCount = cart?.totalItems ?? 0;
  const cartTotal = cart?.total ?? 0;
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/shop?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      <div className="w-full px-[2.5rem] h-20 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image src="/logo.jpg" alt="Tạp hóa nhà SIN" width={140} height={46} style={{ objectFit: 'contain' }} priority />
        </Link>

        {/* Search Bar — center */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
          <div className="flex items-center w-full bg-[#F4F5F9] rounded-xl px-3 py-2 gap-2">
            <span className="material-symbols-outlined text-[#868889] text-[20px] pl-1">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent text-[14px] text-black placeholder-[#868889] outline-none"
              placeholder="Tìm kiếm sản phẩm..."
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {/* Cart */}
          <Link href="/cart" className="flex items-center gap-2 bg-[#F4F5F9] hover:bg-[#EBFFD7] px-3 py-2 rounded-full transition-colors relative">
            <div className="relative flex items-center justify-center">
              <span className="material-symbols-outlined text-[#6CC51D] text-[24px]">shopping_basket</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#6CC51D] text-white text-[11px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            {cartTotal > 0 && (
              <span className="text-[13px] font-semibold text-black">
                {new Intl.NumberFormat('vi-VN').format(cartTotal)}₫
              </span>
            )}
          </Link>

          {/* User */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 cursor-pointer pl-1"
              >
                <div className="w-10 h-10 rounded-full bg-[#EBFFD7] flex items-center justify-center text-[#6CC51D] border border-[#EBEBEB] flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] text-[#868889] leading-tight">Xin chào</span>
                  <span className="text-[13px] font-semibold text-black leading-tight">{user?.fullName?.split(' ').pop()}</span>
                </div>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-[#EBEBEB] rounded-xl shadow-lg min-w-[180px] overflow-hidden z-50">
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-3 text-[14px] text-black hover:bg-[#F4F5F9] transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined text-[18px]">package_2</span>
                    Đơn hàng của tôi
                  </Link>
                  <button
                    className="flex items-center gap-2 px-4 py-3 text-[14px] text-red-500 hover:bg-[#F4F5F9] transition-colors w-full text-left"
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-[#6CC51D] hover:bg-[#4CAF18] text-white font-semibold text-[14px] px-5 py-2.5 rounded-xl transition-colors"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <Link href="/cart" className="relative p-2">
            <span className="material-symbols-outlined text-[#6CC51D] text-[26px]">shopping_basket</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#6CC51D] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-black"
          >
            <span className="material-symbols-outlined text-[26px]">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#EBEBEB] bg-white px-6 py-4 flex flex-col gap-3">
          <form onSubmit={handleSearch} className="flex items-center bg-[#F4F5F9] rounded-xl px-3 py-2 gap-2">
            <span className="material-symbols-outlined text-[#868889] text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent text-[14px] text-black placeholder-[#868889] outline-none"
              placeholder="Tìm kiếm..."
            />
          </form>
          <Link href="/" className="text-[15px] font-medium py-2" onClick={() => setMobileOpen(false)}>🏠 Trang chủ</Link>
          <Link href="/shop" className="text-[15px] font-medium py-2" onClick={() => setMobileOpen(false)}>🛍️ Sản phẩm</Link>
          {isAuthenticated ? (
            <>
              <Link href="/orders" className="text-[15px] font-medium py-2" onClick={() => setMobileOpen(false)}>📦 Đơn hàng</Link>
              <button className="text-[15px] font-medium py-2 text-red-500 text-left" onClick={() => { logout(); setMobileOpen(false); }}>🚪 Đăng xuất</button>
            </>
          ) : (
            <Link href="/auth/login" className="bg-[#6CC51D] text-white text-center font-semibold py-3 rounded-xl" onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
          )}
        </div>
      )}
    </header>
  );
}
