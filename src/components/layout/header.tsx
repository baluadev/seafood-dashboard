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
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <div style={{
        width: '100%', padding: '0 40px', height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
          <Image src="/logo.jpg" alt="Tap hoa nha SIN" width={140} height={46} style={{ objectFit: 'contain' }} priority />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '600px', display: 'flex' }}>
          <div style={{
            display: 'flex', alignItems: 'center', width: '100%',
            background: '#F4F5F9', borderRadius: '12px', padding: '10px 16px', gap: '8px',
          }}>
            <span style={{ color: '#868889', fontSize: '18px' }}>&#128269;</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontSize: '14px', color: '#000', fontFamily: 'Poppins, sans-serif',
              }}
              placeholder="Tim kiem thuc pham tuoi ngon, rau cu huu co..."
            />
          </div>
        </form>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* Cart */}
          <Link href="/cart" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#F4F5F9', padding: '8px 14px', borderRadius: '999px',
            textDecoration: 'none', position: 'relative', transition: 'background 0.2s',
          }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '22px' }}>&#128722;</span>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: '#6CC51D', color: '#fff', fontSize: '10px', fontWeight: 700,
                  borderRadius: '50%', width: '16px', height: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cartCount}
                </span>
              )}
            </div>
            {cartTotal > 0 && (
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#000' }}>
                {new Intl.NumberFormat('vi-VN').format(cartTotal)}d
              </span>
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
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#EBFFD7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #EBEBEB', fontSize: '18px', flexShrink: 0,
                }}>
                  &#128100;
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#868889', lineHeight: 1.2 }}>Xin chao</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#000', lineHeight: 1.2 }}>
                    {user?.fullName?.split(' ').pop()}
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
                    &#128230; Don hang cua toi
                  </Link>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '12px 16px', fontSize: '14px', color: '#ef4444',
                    background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                  }}
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                  >
                    &#128682; Dang xuat
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" style={{
              background: '#6CC51D', color: '#fff', fontWeight: 600, fontSize: '14px',
              padding: '10px 20px', borderRadius: '12px', textDecoration: 'none',
              transition: 'background 0.2s',
            }}>
              Dang nhap
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid #EBEBEB', background: '#fff', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#F4F5F9', borderRadius: '12px', padding: '8px 12px', gap: '8px' }}>
            <span>&#128269;</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}
              placeholder="Tim kiem..."
            />
          </form>
          <Link href="/" style={{ fontSize: '15px', fontWeight: 500, padding: '8px 0', color: '#000', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>&#127968; Trang chu</Link>
          <Link href="/shop" style={{ fontSize: '15px', fontWeight: 500, padding: '8px 0', color: '#000', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>&#128722; San pham</Link>
          {isAuthenticated ? (
            <>
              <Link href="/orders" style={{ fontSize: '15px', fontWeight: 500, padding: '8px 0', color: '#000', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>&#128230; Don hang</Link>
              <button style={{ fontSize: '15px', fontWeight: 500, padding: '8px 0', color: '#ef4444', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }} onClick={() => { logout(); setMobileOpen(false); }}>&#128682; Dang xuat</button>
            </>
          ) : (
            <Link href="/auth/login" style={{ background: '#6CC51D', color: '#fff', textAlign: 'center', fontWeight: 600, padding: '12px', borderRadius: '12px', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Dang nhap</Link>
          )}
        </div>
      )}
    </header>
  );
}
