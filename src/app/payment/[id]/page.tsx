'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ordersApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:   { label: '⏳ Chờ xác nhận',  bg: '#fef9c3', color: '#854d0e' },
  CONFIRMED: { label: '✅ Đã xác nhận',   bg: '#dbeafe', color: '#1d4ed8' },
  SHIPPING:  { label: '🚚 Đang giao',     bg: '#e0f2fe', color: '#0369a1' },
  COMPLETED: { label: '🎉 Hoàn thành',    bg: '#dcfce7', color: '#15803d' },
  CANCELLED: { label: '❌ Đã hủy',        bg: '#fee2e2', color: '#dc2626' },
};

export default function PaymentDetailPage() {
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [repaying, setRepaying] = useState(false);
  const [repayError, setRepayError] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', params.id],
    queryFn: () => ordersApi.getById(params.id as string),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
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
  }

  const order = data?.order;

  async function handleRepay() {
    if (!order) return;
    setRepaying(true);
    setRepayError('');
    try {
      const result = await ordersApi.repay(order.id);
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      }
    } catch (err: any) {
      setRepayError(err?.response?.data?.message || 'Không thể tạo link thanh toán, vui lòng thử lại');
    } finally {
      setRepaying(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, width: '100%', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/orders" style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>
            ← Quay lại đơn hàng
          </Link>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : error || !order ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
            <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Không tìm thấy đơn hàng</h2>
            <Link href="/orders" className="btn btn-primary">Xem đơn hàng của tôi</Link>
          </div>
        ) : (
          <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header card */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
                    {order.orderNumber}
                  </h1>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
                    Đặt lúc {formatDate(order.createdAt)}
                  </p>
                </div>
                <span style={{
                  padding: '0.375rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: STATUS_MAP[order.status]?.bg || '#f1f5f9',
                  color: STATUS_MAP[order.status]?.color || '#334155',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}>
                  {STATUS_MAP[order.status]?.label || order.status}
                </span>
              </div>

              {/* Repay CTA cho đơn PENDING */}
              {order.status === 'PENDING' && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--gray-100)' }}>
                  {repayError && <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>{repayError}</div>}
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
                    💳 Đơn hàng chưa được thanh toán. Nhấn bên dưới để tiến hành thanh toán.
                  </p>
                  <button className="btn btn-accent" onClick={handleRepay} disabled={repaying} style={{ justifyContent: 'center' }}>
                    {repaying ? 'Đang tạo link...' : '💳 Thanh toán ngay'}
                  </button>
                </div>
              )}

              {/* Transaction ID nếu đã thanh toán */}
              {order.transactionId && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  ✅ Mã giao dịch: <span style={{ fontFamily: 'monospace', color: 'var(--gray-700)' }}>{order.transactionId}</span>
                </div>
              )}
            </div>

            {/* Order items */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--gray-100)', fontWeight: 700 }}>📦 Sản phẩm</div>
              {order.items?.map((item: any) => (
                <div key={item.id} style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gray-50)', gap: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{item.product?.title}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
                      {formatPrice(Number(item.unitPrice))} × {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                    {formatPrice(Number(item.subtotal))}
                  </span>
                </div>
              ))}
              <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  <span>Tạm tính</span><span>{formatPrice(Number(order.subtotal))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  <span>Phí vận chuyển</span><span>{formatPrice(Number(order.shippingFee))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.0625rem', color: 'var(--accent)', paddingTop: '0.5rem', borderTop: '1px solid var(--gray-100)' }}>
                  <span>Tổng cộng</span><span>{formatPrice(Number(order.totalAmount))}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            {order.shippingAddress && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>📍 Địa chỉ giao hàng</p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--gray-700)' }}>
                  {order.shippingAddress.fullName} — {order.shippingAddress.phone}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                  {order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}
                </p>
              </div>
            )}

            {/* Note */}
            {order.note && (
              <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                📝 <strong>Ghi chú:</strong> {order.note}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
