'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ordersApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

function formatDate(d: string) {
  const dt = new Date(d);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(dt.getHours())}:${pad(dt.getMinutes())} ${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`;
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; border: string }> = {
  PENDING:   { label: '⏳ Chờ xác nhận', bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
  CONFIRMED: { label: '✅ Đã xác nhận',  bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
  SHIPPING:  { label: '🚚 Đang giao',    bg: '#e0f2fe', color: '#0369a1', border: '#7dd3fc' },
  COMPLETED: { label: '🎉 Hoàn thành',   bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  CANCELLED: { label: '❌ Đã hủy',       bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: ordersApi.getMyOrders,
    enabled: isAuthenticated,
  });

  /* Not logged in */
  if (!isAuthenticated) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Roboto, sans-serif' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '80px 16px', textAlign: 'center', paddingTop: 'calc(var(--header-h) + 40px)' }}>
        <div style={{ fontSize: '4rem' }}>🔒</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#191c1d', margin: 0 }}>Vui lòng đăng nhập để xem đơn hàng</h2>
        <p style={{ color: '#868889', fontSize: '14px', margin: 0 }}>Đăng nhập để theo dõi đơn hàng và lịch sử mua sắm</p>
        <Link href="/auth/login" style={{ background: '#6CC51D', color: '#fff', padding: '12px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
          Đăng nhập ngay →
        </Link>
      </main>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA', fontFamily: 'Roboto, sans-serif' }}>
      <Header />
      <main style={{ flex: 1, paddingTop: 'var(--header-h)' }}>
        <div className="page-wrap" style={{ paddingTop: '16px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Page title */}
          <h1 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, color: '#191c1d', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📦</span> Đơn hàng của tôi
          </h1>

          {/* Loading skeleton */}
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ height: '130px', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !orders?.length && (
            <div style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: '#fff', borderRadius: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '4rem' }}>📭</div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#191c1d', margin: 0 }}>Chưa có đơn hàng nào</h2>
              <p style={{ color: '#868889', fontSize: '14px', margin: 0 }}>Hãy chọn sản phẩm yêu thích và đặt hàng ngay!</p>
              <Link href="/shop" style={{ background: '#6CC51D', color: '#fff', padding: '12px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                Bắt đầu mua sắm →
              </Link>
            </div>
          )}

          {/* Order list */}
          {!isLoading && orders?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map((order: any) => {
                const status = STATUS_MAP[order.status] ?? STATUS_MAP.PENDING;
                return (
                  <div key={order.id} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

                    {/* ── Order header ── */}
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #F4F5F9' }}>
                      {/* Row 1: order number + date */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 700, color: '#356b00', fontFamily: 'monospace', fontSize: '14px', letterSpacing: '-0.3px' }}>
                          {order.orderNumber}
                        </span>
                        <span style={{ color: '#868889', fontSize: '12px', flexShrink: 0 }}>{formatDate(order.createdAt)}</span>
                      </div>
                      {/* Row 2: status badge + button */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          padding: '4px 10px', borderRadius: '20px',
                          background: status.bg, color: status.color,
                          border: `1px solid ${status.border}`,
                          fontSize: '12px', fontWeight: 600,
                        }}>
                          {status.label}
                        </span>
                        <Link href={`/payment/${order.id}`} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '7px 14px', borderRadius: '8px',
                          border: '1.5px solid #6CC51D', color: '#356b00',
                          fontSize: '12px', fontWeight: 700, textDecoration: 'none',
                          background: '#fff', flexShrink: 0,
                        }}>
                          Xem chi tiết →
                        </Link>
                      </div>
                    </div>

                    {/* ── Order items ── */}
                    <div style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {order.items?.slice(0, 3).map((item: any) => (
                          <span key={item.id} style={{
                            fontSize: '12px', background: '#F4F5F9', borderRadius: '6px',
                            padding: '4px 8px', color: '#191c1d', maxWidth: '100%',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {item.product?.title} × {item.quantity}
                          </span>
                        ))}
                        {order.items?.length > 3 && (
                          <span style={{ fontSize: '12px', color: '#868889', padding: '4px 0' }}>
                            +{order.items.length - 3} sp khác
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#868889' }}>{order.items?.length} sản phẩm</span>
                        <span style={{ fontWeight: 800, fontSize: '16px', color: '#356b00' }}>
                          {formatPrice(Number(order.totalAmount))}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
