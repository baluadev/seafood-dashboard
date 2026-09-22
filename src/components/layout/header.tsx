'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';

/* ── Figma SVG icons (inline, pixel-perfect) ── */
const SearchIcon = () => (
  <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.8333 15L12.5833 9.75C12.1667 10.0833 11.6875 10.3472 11.1458 10.5417C10.6042 10.7361 10.0278 10.8333 9.41667 10.8333C7.90278 10.8333 6.62153 10.309 5.57292 9.26042C4.52431 8.21181 4 6.93056 4 5.41667C4 3.90278 4.52431 2.62153 5.57292 1.57292C6.62153 0.524305 7.90278 0 9.41667 0C10.9306 0 12.2118 0.524305 13.2604 1.57292C14.309 2.62153 14.8333 3.90278 14.8333 5.41667C14.8333 6.02778 14.7361 6.60417 14.5417 7.14583C14.3472 7.6875 14.0833 8.16667 13.75 8.58333L19 13.8333L17.8333 15ZM9.41667 9.16667C10.4583 9.16667 11.3438 8.80208 12.0729 8.07292C12.8021 7.34375 13.1667 6.45833 13.1667 5.41667C13.1667 4.375 12.8021 3.48958 12.0729 2.76042C11.3438 2.03125 10.4583 1.66667 9.41667 1.66667C8.375 1.66667 7.48958 2.03125 6.76042 2.76042C6.03125 3.48958 5.66667 4.375 5.66667 5.41667C5.66667 6.45833 6.03125 7.34375 6.76042 8.07292C7.48958 8.80208 8.375 9.16667 9.41667 9.16667Z" fill="#868889"/>
  </svg>
);

const WishlistIcon = () => (
  <svg width="20" height="19" viewBox="0 0 20 18.35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 18.35L8.55 17.05C6.86667 15.5333 5.475 14.225 4.375 13.125C3.275 12.025 2.4 11.0375 1.75 10.1625C1.1 9.2875 0.645833 8.48333 0.3875 7.75C0.129167 7.01667 0 6.26667 0 5.5C0 3.93333 0.525 2.625 1.575 1.575C2.625 0.525 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C16.0667 0 17.375 0.525 18.425 1.575C19.475 2.625 20 3.93333 20 5.5C20 6.26667 19.8708 7.01667 19.6125 7.75C19.3542 8.48333 18.9 9.2875 18.25 10.1625C17.6 11.0375 16.725 12.025 15.625 13.125C14.525 14.225 13.1333 15.5333 11.45 17.05L10 18.35ZM10 15.65C11.6 14.2167 12.9167 12.9875 13.95 11.9625C14.9833 10.9375 15.8 10.0458 16.4 9.2875C17 8.52917 17.4167 7.85417 17.65 7.2625C17.8833 6.67083 18 6.08333 18 5.5C18 4.5 17.6667 3.66667 17 3C16.3333 2.33333 15.5 2 14.5 2C13.7167 2 12.9917 2.22083 12.325 2.6625C11.6583 3.10417 11.2 3.66667 10.95 4.35H9.05C8.8 3.66667 8.34167 3.10417 7.675 2.6625C7.00833 2.22083 6.28333 2 5.5 2C4.5 2 3.66667 2.33333 3 3C2.33333 3.66667 2 4.5 2 5.5C2 6.08333 2.11667 6.67083 2.35 7.2625C2.58333 7.85417 3 8.52917 3.6 9.2875C4.2 10.0458 5.01667 10.9375 6.05 11.9625C7.08333 12.9875 8.4 14.2167 10 15.65Z" fill="#191C1D"/>
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="19" viewBox="0 0 21.9758 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.51288 19C4.06288 19 3.66288 18.8625 3.31288 18.5875C2.96288 18.3125 2.72121 17.9583 2.58788 17.525L0.0378788 8.275C-0.0454545 7.95833 0.00871213 7.66667 0.200379 7.4C0.392045 7.13333 0.654545 7 0.987879 7H5.73788L10.1379 0.45C10.2212 0.316667 10.3379 0.208333 10.4879 0.125C10.6379 0.0416667 10.7962 0 10.9629 0C11.1295 0 11.2879 0.0416667 11.4379 0.125C11.5879 0.208333 11.7045 0.316667 11.7879 0.45L16.1879 7H20.9879C21.3212 7 21.5837 7.13333 21.7754 7.4C21.967 7.66667 22.0212 7.95833 21.9379 8.275L19.3879 17.525C19.2545 17.9583 19.0129 18.3125 18.6629 18.5875C18.3129 18.8625 17.9129 19 17.4629 19H4.51288ZM4.48788 17H17.4879L19.6879 9H2.28788L4.48788 17ZM10.9879 15C11.5379 15 12.0087 14.8042 12.4004 14.4125C12.792 14.0208 12.9879 13.55 12.9879 13C12.9879 12.45 12.792 11.9792 12.4004 11.5875C12.0087 11.1958 11.5379 11 10.9879 11C10.4379 11 9.96705 11.1958 9.57538 11.5875C9.18371 11.9792 8.98788 12.45 8.98788 13C8.98788 13.55 9.18371 14.0208 9.57538 14.4125C9.96705 14.8042 10.4379 15 10.9879 15ZM8.16288 7H13.7879L10.9629 2.8L8.16288 7Z" fill="#356B00"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 13.3333 13.3333" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 6.66667C5.75 6.66667 4.96528 6.34028 4.3125 5.6875C3.65972 5.03472 3.33333 4.25 3.33333 3.33333C3.33333 2.41667 3.65972 1.63194 4.3125 0.979167C4.96528 0.326389 5.75 0 6.66667 0C7.58333 0 8.36806 0.326389 9.02083 0.979167C9.67361 1.63194 10 2.41667 10 3.33333C10 4.25 9.67361 5.03472 9.02083 5.6875C8.36806 6.34028 7.58333 6.66667 6.66667 6.66667ZM0 13.3333V11C0 10.5278 0.121528 10.0938 0.364583 9.69792C0.607639 9.30208 0.930556 9 1.33333 8.79167C2.19444 8.36111 3.06944 8.03819 3.95833 7.82292C4.84722 7.60764 5.75 7.5 6.66667 7.5C7.58333 7.5 8.48611 7.60764 9.375 7.82292C10.2639 8.03819 11.1389 8.36111 12 8.79167C12.4028 9 12.7257 9.30208 12.9688 9.69792C13.2118 10.0938 13.3333 10.5278 13.3333 11V13.3333H0ZM1.66667 11.6667H11.6667V11C11.6667 10.8472 11.6285 10.7083 11.5521 10.5833C11.4757 10.4583 11.375 10.3611 11.25 10.2917C10.5 9.91667 9.74306 9.63542 8.97917 9.44792C8.21528 9.26042 7.44444 9.16667 6.66667 9.16667C5.88889 9.16667 5.11806 9.26042 4.35417 9.44792C3.59028 9.63542 2.83333 9.91667 2.08333 10.2917C1.95833 10.3611 1.85764 10.4583 1.78125 10.5833C1.70486 10.7083 1.66667 10.8472 1.66667 11V11.6667ZM6.66667 5C7.125 5 7.51736 4.83681 7.84375 4.51042C8.17014 4.18403 8.33333 3.79167 8.33333 3.33333C8.33333 2.875 8.17014 2.48264 7.84375 2.15625C7.51736 1.82986 7.125 1.66667 6.66667 1.66667C6.20833 1.66667 5.81597 1.82986 5.48958 2.15625C5.16319 2.48264 5 2.875 5 3.33333C5 3.79167 5.16319 4.18403 5.48958 4.51042C5.81597 4.83681 6.20833 5 6.66667 5Z" fill="#356B00"/>
  </svg>
);

export function Header() {
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
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      fontFamily: 'Poppins, sans-serif',
    }}>
      {/* ── Main bar 80px ── */}
      <div style={{
        width: '100%', maxWidth: '1280px', margin: '0 auto',
        padding: '0 40px', height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
      }}>

        {/* 1. Logo — dạng dọc (icon + text), width ~72px */}
        <Link href="/" style={{ flexShrink: 0, textDecoration: 'none', display: 'block', width: '72px' }}>
          <Image
            src="/logo.png"
            alt="Tạp hóa SIN"
            width={72}
            height={48}
            style={{ objectFit: 'contain', display: 'block' }}
            priority
          />
        </Link>

        {/* 2. Search bar — flex:1, maxWidth 672px */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '672px', minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#F4F5F9', borderRadius: '8px', padding: '4px 12px',
          }}>
            <SearchIcon />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '14px', color: '#191c1d', fontFamily: 'Poppins, sans-serif',
                padding: '5px 0',
              }}
              placeholder="Tìm kiếm thực phẩm tươi ngon, rau củ hữu cơ, trái cây sạch..."
            />
          </div>
        </form>

        {/* 3. Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>

          {/* Wishlist icon với badge */}
          <Link href="/wishlist" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '12px', textDecoration: 'none' }}>
            <WishlistIcon />
            {/* badge (tùy chọn — để tĩnh hoặc kết nối wishlist API sau) */}
          </Link>

          {/* Cart pill: icon + giá */}
          <Link href="/cart" style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: '#F4F5F9', padding: '8px 12px 8px 8px',
            borderRadius: '12px', textDecoration: 'none', position: 'relative',
          }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CartIcon />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#6CC51D', color: '#fff', fontSize: '10px', fontWeight: 600,
                  borderRadius: '50%', width: '16px', height: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cartCount}
                </span>
              )}
            </div>
            {cartTotal > 0 ? (
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d', whiteSpace: 'nowrap' }}>
                {new Intl.NumberFormat('vi-VN').format(cartTotal)}₫
              </span>
            ) : (
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d' }}>Giỏ hàng</span>
            )}
          </Link>

          {/* User */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                }}
              >
                {/* Avatar circle — Figma: #EBFFD7 bg, border, user icon */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: '#EBFFD7', border: '1px solid #e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <UserIcon />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '10px', color: '#868889', lineHeight: '12.5px', fontWeight: 500 }}>Xin chào</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#000', lineHeight: '15px', whiteSpace: 'nowrap' }}>
                    {user?.fullName?.split(' ').pop() ?? 'Bạn'}
                  </div>
                </div>
              </button>
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: '8px',
                  background: '#fff', border: '1px solid #EBEBEB', borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: '180px', overflow: 'hidden', zIndex: 200,
                }}>
                  <Link href="/orders" style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '12px 16px', fontSize: '14px', color: '#000', textDecoration: 'none',
                  }} onClick={() => setUserMenuOpen(false)}>
                    📦 Đơn hàng của tôi
                  </Link>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '12px 16px', fontSize: '14px', color: '#ef4444',
                    background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                  }}
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" style={{
              background: '#6CC51D', color: '#fff', fontWeight: 600, fontSize: '14px',
              padding: '10px 20px', borderRadius: '12px', textDecoration: 'none',
            }}>
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
