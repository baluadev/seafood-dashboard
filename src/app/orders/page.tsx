'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ordersApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:   { label: '⏳ Chờ xác nhận', bg: '#fef9c3', color: '#854d0e' },
  CONFIRMED: { label: '✅ Đã xác nhận',  bg: '#dbeafe', color: '#1d4ed8' },
  SHIPPING:  { label: '🚚 Đang giao',    bg: '#e0f2fe', color: '#0369a1' },
  COMPLETED: { label: '🎉 Hoàn thành',   bg: '#dcfce7', color: '#15803d' },
  CANCELLED: { label: '❌ Đã hủy',       bg: '#fee2e2', color: '#dc2626' },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: ordersApi.getMyOrders,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Vui lòng đăng nhập</h2>
        <Link href="/auth/login" className="btn btn-primary">Đăng nhập ngay</Link>
      </main>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '2rem 0', width: '100%' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>📦 Đơn hàng của tôi</h1>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : !orders?.length ? (
          <div style={{ textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '4rem' }}>📭</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Chưa có đơn hàng nào</h2>
            <Link href="/shop" className="btn btn-primary">Bắt đầu mua sắm →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order: any) => {
              const status = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
              return (
                <div key={order.id} style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                  {/* Order header */}
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.9375rem' }}>{order.orderNumber}</span>
                      <span style={{ color: 'var(--gray-400)', fontSize: '0.8125rem', marginLeft: '0.75rem' }}>{formatDate(order.createdAt)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: status.bg, color: status.color, fontSize: '0.8125rem', fontWeight: 600 }}>
                        {status.label}
                      </span>
                      <Link href={`/payment/${order.id}`} className="btn btn-outline btn-sm">
                        Xem chi tiết →
                      </Link>
                    </div>
                  </div>

                  {/* Order items preview */}
                  <div style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {order.items?.slice(0, 3).map((item: any) => (
                        <span key={item.id} style={{ fontSize: '0.8125rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.625rem', color: 'var(--gray-600)' }}>
                          {item.product?.title} × {item.quantity}
                        </span>
                      ))}
                      {order.items?.length > 3 && <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>+{order.items.length - 3} sp khác</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{order.items?.length} sản phẩm</span>
                      <span style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--accent)' }}>{formatPrice(Number(order.totalAmount))}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
