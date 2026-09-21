'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '64px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <Image src="/logo.jpg" alt="Tạp hóa nhà SIN" width={120} height={48} style={{ objectFit: 'contain' }} priority />
        </Link>

        {/* Desktop Nav — hidden on mobile */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
          <Link href="/" className="btn btn-ghost btn-sm">Trang chủ</Link>
          <Link href="/shop" className="btn btn-ghost btn-sm">Sản phẩm</Link>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }} className="hide-on-mobile">
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
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ gap: '0.375rem' }}
              >
                <span style={{ fontSize: '1rem' }}>👤</span>
                <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.fullName?.split(' ').pop()}
                </span>
              </button>
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem',
                  background: 'white', border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  minWidth: '160px', overflow: 'hidden', zIndex: 200,
                }}>
                  <Link href="/orders" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0 }} onClick={() => setUserMenuOpen(false)}>
                    📦 Đơn hàng của tôi
                  </Link>
                  <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, color: 'var(--error)' }} onClick={() => { logout(); setUserMenuOpen(false); }}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary btn-sm">Đăng nhập</Link>
          )}
        </div>

        {/* Mobile right side: cart + hamburger */}
        <div className="show-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
          <Link href="/cart" className="btn btn-ghost btn-sm" style={{ position: 'relative' }}>
            <span style={{ fontSize: '1.25rem' }}>🛒</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--accent)', color: 'white',
                fontSize: '0.6875rem', fontWeight: 700,
                borderRadius: '999px', minWidth: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
              }}>{cartCount}</span>
            )}
          </Link>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            style={{ fontSize: '1.25rem', padding: '0.5rem' }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          <Link href="/" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => setMobileOpen(false)}>
            🏠 Trang chủ
          </Link>
          <Link href="/shop" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => setMobileOpen(false)}>
            🦐 Sản phẩm
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/orders" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => setMobileOpen(false)}>
                📦 Đơn hàng của tôi
              </Link>
              <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--error)' }}
                onClick={() => { logout(); setMobileOpen(false); }}>
                🚪 Đăng xuất ({user?.fullName?.split(' ').pop()})
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
              Đăng nhập
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
