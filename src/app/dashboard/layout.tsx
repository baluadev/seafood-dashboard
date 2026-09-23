'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

const NAV_ITEMS = [
  { icon: '📦', label: 'Sản phẩm', href: '/dashboard/products' },
  { icon: '🏷️', label: 'Danh mục', href: '/dashboard/categories' },
  { icon: '🖼️', label: 'Sliders', href: '/dashboard/sliders' },
  { icon: '🎯', label: 'Promotions', href: '/dashboard/promotions' },
  { icon: '📋', label: 'Đơn hàng', href: '/dashboard/orders' },
  { icon: '👥', label: 'Người dùng', href: '/dashboard/users' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA', fontFamily: 'Roboto, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', background: '#fff', borderRight: '1px solid #EBEBEB',
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #EBEBEB' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#356b00' }}>Tạp hóa SIN</div>
            <div style={{ fontSize: '11px', color: '#868889', marginTop: '2px' }}>Bảng quản trị</div>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(item => {
            const isActive = pathname.startsWith(item.href);
            const needsAdmin = true; // all dashboard pages need admin

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px', textDecoration: 'none',
                  background: isActive ? '#EBFFD7' : 'transparent',
                  color: isActive ? '#356b00' : '#868889',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '14px', transition: 'all 0.15s',
                  opacity: (!isAdmin && needsAdmin) ? 0.4 : 1,
                  pointerEvents: (!isAdmin && needsAdmin) ? 'none' : 'auto',
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.label}
                {isActive && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#6CC51D' }} />}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #EBEBEB' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#191c1d' }}>{user?.fullName}</div>
          <div style={{ fontSize: '11px', color: '#868889', marginTop: '2px' }}>{user?.email}</div>
          <div style={{ marginTop: '6px', display: 'inline-block', padding: '2px 8px', borderRadius: '99px', background: user?.role === 'ADMIN' ? '#EBFFD7' : '#F4F5F9', fontSize: '10px', fontWeight: 700, color: user?.role === 'ADMIN' ? '#356b00' : '#868889' }}>
            {user?.role}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #EBEBEB', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ fontSize: '14px', color: '#868889' }}>
            <Link href="/" style={{ color: '#6CC51D', textDecoration: 'none' }}>← Về trang chủ</Link>
          </div>
          {!isAdmin && (
            <div style={{ fontSize: '12px', color: '#ba1a1a', fontWeight: 600, background: '#FFDAD6', padding: '4px 12px', borderRadius: '99px' }}>
              ⚠️ Chỉ ADMIN mới có thể thêm/sửa/xóa
            </div>
          )}
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '32px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
