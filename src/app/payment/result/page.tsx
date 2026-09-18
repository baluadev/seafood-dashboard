'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

function PaymentResultContent() {
  const searchParams = useSearchParams();

  // Pay2S thường trả về các params: orderNumber, status, transactionId, message
  const orderNumber = searchParams.get('orderNumber') || searchParams.get('orderCode');
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transactionId');
  const mockPay2s = searchParams.get('mock_pay2s'); // Sandbox mock

  // Xác định thành công hay thất bại
  const isSuccess = status === 'success' || status === 'PAID' || mockPay2s === 'true';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
      }}>
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--gray-100)',
          boxShadow: 'var(--shadow-lg)',
          padding: '3rem 2.5rem',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
        }}>
          {isSuccess ? (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 0.6s ease' }}>✅</div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
                Thanh toán thành công!
              </h1>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
                Đơn hàng của bạn đã được xác nhận.
              </p>
              {orderNumber && (
                <p style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                  {orderNumber}
                </p>
              )}
              {transactionId && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: '1.5rem' }}>
                  Mã giao dịch: {transactionId}
                </p>
              )}
              {mockPay2s === 'true' && (
                <div style={{ background: '#fef9c3', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8125rem', color: '#854d0e', marginBottom: '1.5rem' }}>
                  🧪 Đây là thanh toán Sandbox (test mode)
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                <Link href="/orders" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  📦 Xem đơn hàng của tôi
                </Link>
                <Link href="/shop" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                  Tiếp tục mua sắm →
                </Link>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
                Thanh toán không thành công
              </h1>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
                Giao dịch bị hủy hoặc có lỗi xảy ra. Đơn hàng của bạn vẫn được lưu, bạn có thể thử thanh toán lại.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/orders" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  📦 Xem và thanh toán lại
                </Link>
                <Link href="/shop" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                  Quay về trang sản phẩm
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense>
      <PaymentResultContent />
    </Suspense>
  );
}
