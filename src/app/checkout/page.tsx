'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ordersApi } from '@/lib/api-services';
import { useCart } from '@/hooks/use-cart';

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '', phone: '', address: '', ward: '', district: '', province: '', note: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { order, paymentUrl } = await ordersApi.create({
        shippingAddress: {
          fullName: form.fullName, phone: form.phone, address: form.address,
          ward: form.ward, district: form.district, province: form.province,
        },
        note: form.note || undefined,
      });
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        router.push(`/orders`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đặt hàng thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '2rem 1rem', maxWidth: '900px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>📦 Thông tin giao hàng</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && <div className="alert alert-error">{error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Họ và tên *</label>
                <input className="form-input" id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Số điện thoại *</label>
                <input className="form-input" id="phone" name="phone" required value={form.phone} onChange={handleChange} placeholder="0912 345 678" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="address">Địa chỉ *</label>
              <input className="form-input" id="address" name="address" required value={form.address} onChange={handleChange} placeholder="123 Đường ABC" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ward">Phường/Xã *</label>
                <input className="form-input" id="ward" name="ward" required value={form.ward} onChange={handleChange} placeholder="Phường 1" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="district">Quận/Huyện *</label>
                <input className="form-input" id="district" name="district" required value={form.district} onChange={handleChange} placeholder="Quận 1" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="province">Tỉnh/Thành phố *</label>
                <input className="form-input" id="province" name="province" required value={form.province} onChange={handleChange} placeholder="TP. Hồ Chí Minh" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="note">Ghi chú (không bắt buộc)</label>
              <textarea className="form-input" id="note" name="note" value={form.note} onChange={handleChange} rows={3} placeholder="Giao buổi sáng, gọi trước khi giao..." style={{ resize: 'vertical' }} />
            </div>
            <button className="btn btn-accent btn-lg" type="submit" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Đang xử lý...' : '✅ Xác nhận đặt hàng'}
            </button>
          </form>

          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', padding: '1.5rem', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Đơn hàng của bạn</h3>
            {cart?.items?.map((item: any) => {
              const price = Math.round(Number(item.product.price) * (1 - Number(item.product.discountRate)));
              return (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.625rem' }}>
                  <span style={{ color: 'var(--gray-700)' }}>{item.product.title} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(price * item.quantity)}</span>
                </div>
              );
            })}
            <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.375rem' }}>
                <span>Phí vận chuyển</span><span>{formatPrice(30000)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.0625rem', color: 'var(--accent)' }}>
                <span>Tổng cộng</span>
                <span>{formatPrice((cart?.totalPrice ?? 0) + 30000)}</span>
              </div>
            </div>
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--primary-dark)' }}>
              💳 Thanh toán tự động qua cổng Pay2S (Chuyển khoản / MoMo)
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
