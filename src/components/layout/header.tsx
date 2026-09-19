'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: cart } = useCart();
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartCount = cart?.totalItems ?? 0;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--gray-100)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', height: '64px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ fontSize: '1.5rem' }}>🌊</span>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--gray-900)' }}>
            Fresh<span style={{ color: 'var(--primary)' }}> Sea</span>
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
          <Link href="/" className="btn btn-ghost btn-sm">Trang chủ</Link>
          <Link href="/shop" className="btn btn-ghost btn-sm">Sản phẩm</Link>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Cart */}
          <Link href="/cart" className="btn btn-ghost btn-sm" style={{ position: 'relative' }}>
            <span style={{ fontSize: '1.25rem' }}>🛒</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--accent)',
                color: 'white', fontSize: '0.6875rem', fontWeight: 700,
                borderRadius: '999px', minWidth: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
              }}>{cartCount}</span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ gap: '0.375rem' }}
              >
                <span style={{ fontSize: '1rem' }}>👤</span>
                <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.fullName?.split(' ').pop()}
                </span>
              </button>
              {menuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem',
                  background: 'white', border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  minWidth: '160px', overflow: 'hidden', zIndex: 200,
                }}>
                  <Link href="/orders" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0 }} onClick={() => setMenuOpen(false)}>
                    📦 Đơn hàng của tôi
                  </Link>
                  <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, color: 'var(--error)' }} onClick={() => { logout(); setMenuOpen(false); }}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary btn-sm">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
}
