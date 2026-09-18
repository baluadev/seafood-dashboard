'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const { data: cart, isLoading } = useCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '4rem 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Vui lòng đăng nhập</h2>
          <p style={{ color: 'var(--gray-500)' }}>Bạn cần đăng nhập để xem giỏ hàng</p>
          <Link href="/auth/login" className="btn btn-primary">Đăng nhập ngay</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>🛒 Giỏ hàng của tôi</h1>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : !cart?.items?.length ? (
          <div style={{ textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '4rem' }}>🛒</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Giỏ hàng trống</h2>
            <p style={{ color: 'var(--gray-500)' }}>Hãy thêm sản phẩm vào giỏ hàng!</p>
            <Link href="/shop" className="btn btn-primary">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.items.map((item: any) => {
                const unitPrice = Math.round(Number(item.product.price) * (1 - Number(item.product.discountRate)));
                return (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--gray-50)' }}>
                      {item.product.thumbnailUrl ? <Image src={item.product.thumbnailUrl} alt={item.product.title} fill style={{ objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🦐</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/shop/${item.product.slug}`} style={{ fontWeight: 600, fontSize: '0.9375rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.product.title}</Link>
                      <p style={{ color: 'var(--accent)', fontWeight: 700, marginTop: '0.25rem' }}>{formatPrice(unitPrice)}/{item.product.unit}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: '1.125rem', padding: '0.25rem 0.5rem' }} onClick={() => { if (item.quantity > 1) updateItem({ itemId: item.id, quantity: item.quantity - 1 }); else removeItem(item.id); }}>−</button>
                      <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: '1.125rem', padding: '0.25rem 0.5rem' }} onClick={() => updateItem({ itemId: item.id, quantity: item.quantity + 1 })}>+</button>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontWeight: 700 }}>{formatPrice(unitPrice * item.quantity)}</p>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', marginTop: '0.25rem' }} onClick={() => removeItem(item.id)}>Xóa</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', padding: '1.5rem', position: 'sticky', top: '80px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1.25rem' }}>Tóm tắt đơn hàng</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
                  <span style={{ color: 'var(--gray-600)' }}>Tạm tính ({cart.totalItems} sp)</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
                  <span style={{ color: 'var(--gray-600)' }}>Phí vận chuyển</span>
                  <span>{formatPrice(30000)}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.125rem' }}>
                  <span>Tổng cộng</span>
                  <span style={{ color: 'var(--accent)' }}>{formatPrice(cart.totalPrice + 30000)}</span>
                </div>
              </div>
              <button className="btn btn-accent btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={() => router.push('/checkout')}>
                Đặt hàng →
              </button>
              <Link href="/shop" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
