'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ordersApi } from '@/lib/api-services';
import { useCart } from '@/hooks/use-cart';

function fmtPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

const SHIPPING_FEE = 30000;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PAY2S' | 'COD'>('PAY2S');
  const [form, setForm] = useState({
    fullName: '', phone: '', address: '', ward: '', district: '', province: '', note: '',
  });

  const items = cart?.items ?? [];
  const subtotal = cart?.totalPrice ?? 0;
  const total = subtotal + SHIPPING_FEE;
  const totalItems = items.reduce((acc: number, i: any) => acc + i.quantity, 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload: any = {
        shippingAddress: {
          fullName: form.fullName, phone: form.phone, address: form.address,
          ward: form.ward, district: form.district, province: form.province,
        },
        paymentMethod,
        note: form.note || undefined,
      };
      if (paymentMethod === 'COD') payload.paymentMethod = 'COD';

      const { order, paymentUrl } = await ordersApi.create(payload);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f5f9', fontFamily: 'Roboto, sans-serif' }}>
      <Header />

      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '88px 40px 40px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889' }}>🏠 Trang chủ</span>
          </Link>
          <span style={{ fontSize: '10px', color: '#868889' }}>›</span>
          <Link href="/cart" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889' }}>Giỏ hàng</span>
          </Link>
          <span style={{ fontSize: '10px', color: '#868889' }}>›</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d' }}>Thanh toán & Đặt hàng</span>
        </nav>

        {/* Page title */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: 700, color: '#191c1d', letterSpacing: '-0.75px', lineHeight: '38px' }}>
            Thông tin thanh toán & Giao hàng
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#868889', lineHeight: '20px' }}>
            Vui lòng kiểm tra kỹ thông tin người nhận để đảm bảo kiện hàng được trao tận tay tươi ngon nhất.
          </p>
        </div>

        {/* 2-column layout */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>

            {/* ─── LEFT COLUMN ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Section 1: Recipient Info */}
              <div style={{
                background: '#fff', borderRadius: '8px', padding: '24px',
                boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: '16px',
              }}>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '12px', background: '#ebffd7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#356b00' }}>1</span>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#191c1d' }}>Thông tin người nhận</span>
                </div>

                {/* Row 1: Họ tên + Số điện thoại */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'flex', gap: '4px', marginBottom: '4px', fontSize: '12px', fontWeight: 600, color: '#191c1d' }}>
                      Họ và tên <span style={{ color: '#ba1a1a' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        name="fullName" required value={form.fullName} onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        style={{
                          width: '100%', padding: '12px 40px 12px 16px', background: '#f4f5f9',
                          border: 'none', borderRadius: '8px', fontSize: '14px', color: '#000',
                          outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#868889' }}>👤</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'flex', gap: '4px', marginBottom: '4px', fontSize: '12px', fontWeight: 600, color: '#191c1d' }}>
                      Số điện thoại <span style={{ color: '#ba1a1a' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        name="phone" required value={form.phone} onChange={handleChange}
                        placeholder="0912 345 678" type="tel"
                        style={{
                          width: '100%', padding: '12px 40px 12px 16px', background: '#f4f5f9',
                          border: 'none', borderRadius: '8px', fontSize: '14px', color: '#000',
                          outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#868889' }}>📞</span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Địa chỉ */}
                <div>
                  <label style={{ display: 'flex', gap: '4px', marginBottom: '4px', fontSize: '12px', fontWeight: 600, color: '#191c1d' }}>
                    Địa chỉ <span style={{ color: '#ba1a1a' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="address" required value={form.address} onChange={handleChange}
                      placeholder="123 Đường ABC"
                      style={{
                        width: '100%', padding: '12px 40px 12px 16px', background: '#f4f5f9',
                        border: 'none', borderRadius: '8px', fontSize: '14px', color: '#000',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#868889' }}>🏠</span>
                  </div>
                </div>

                {/* Row 3: Phường/Xã, Quận/Huyện, Tỉnh/Thành phố */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  {[
                    { name: 'ward', label: 'Phường/Xã', placeholder: 'Phường 1' },
                    { name: 'district', label: 'Quận/Huyện', placeholder: 'Quận 1' },
                    { name: 'province', label: 'Tỉnh/Thành phố', placeholder: 'TP. Hồ Chí Minh' },
                  ].map((f) => (
                    <div key={f.name}>
                      <label style={{ display: 'flex', gap: '4px', marginBottom: '4px', fontSize: '12px', fontWeight: 600, color: '#191c1d' }}>
                        {f.label} <span style={{ color: '#ba1a1a' }}>*</span>
                      </label>
                      <input
                        name={f.name} required value={(form as any)[f.name]} onChange={handleChange}
                        placeholder={f.placeholder}
                        style={{
                          width: '100%', padding: '12px 16px', background: '#f4f5f9',
                          border: 'none', borderRadius: '8px', fontSize: '14px', color: '#000',
                          outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Row 4: Ghi chú */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d' }}>Ghi chú (không bắt buộc)</label>
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#868889' }}>Tùy chọn</span>
                  </div>
                  <textarea
                    name="note" value={form.note} onChange={handleChange}
                    placeholder="Giao buổi sáng, gọi trước khi giao..."
                    rows={4}
                    style={{
                      width: '100%', padding: '12px 16px', background: '#f4f5f9',
                      border: 'none', borderRadius: '8px', fontSize: '14px', color: '#191c1d',
                      outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                      minHeight: '96px', fontFamily: 'Roboto, sans-serif',
                    }}
                  />
                </div>
              </div>

              {/* Section 2: Payment Method */}
              <div style={{
                background: '#fff', borderRadius: '8px', padding: '24px',
                boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '12px', background: '#ebffd7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#356b00' }}>2</span>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#191c1d' }}>Hình thức thanh toán</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 500, background: '#ebffd7', color: '#356b00', padding: '2px 8px', borderRadius: '12px' }}>
                    Bảo mật bởi Pay2S
                  </span>
                </div>

                {/* Payment options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Pay2S */}
                  <label
                    style={{
                      display: 'flex', gap: '12px', alignItems: 'center', padding: '12px',
                      borderRadius: '8px', cursor: 'pointer',
                      background: paymentMethod === 'PAY2S' ? '#ebffd7' : '#f4f5f9',
                      boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
                      transition: 'background 0.15s',
                    }}
                  >
                    <input type="radio" name="payment" value="PAY2S" checked={paymentMethod === 'PAY2S'}
                      onChange={() => setPaymentMethod('PAY2S')} style={{ display: 'none' }} />
                    {/* Custom radio */}
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                      border: `1.5px solid ${paymentMethod === 'PAY2S' ? '#356b00' : '#767676'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff',
                    }}>
                      {paymentMethod === 'PAY2S' && (
                        <div style={{ width: '9.6px', height: '9.6px', borderRadius: '50%', background: '#356b00' }} />
                      )}
                    </div>
                    {/* Icon + text */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
                      <div style={{
                        width: '40px', height: '40px', background: '#fff', borderRadius: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0px 1px 1px rgba(0,0,0,0.05)', flexShrink: 0, fontSize: '20px',
                      }}>
                        💳
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#191c1d', lineHeight: '16px' }}>
                          Cổng Pay2S (VietQR /<br />MoMo)
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: 500, color: '#486f21', lineHeight: '14px' }}>
                          Tự động duyệt ngay 30s
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#486f21', background: '#c2f193', padding: '2px 8px', borderRadius: '12px', flexShrink: 0 }}>
                      Khuyên dùng
                    </span>
                  </label>

                  {/* COD */}
                  <label
                    style={{
                      display: 'flex', gap: '12px', alignItems: 'center', padding: '15px 12px',
                      borderRadius: '8px', cursor: 'pointer',
                      background: paymentMethod === 'COD' ? '#ebffd7' : '#f4f5f9',
                      boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
                      transition: 'background 0.15s',
                    }}
                  >
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')} style={{ display: 'none' }} />
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                      border: `1.5px solid ${paymentMethod === 'COD' ? '#356b00' : '#767676'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff',
                    }}>
                      {paymentMethod === 'COD' && (
                        <div style={{ width: '9.6px', height: '9.6px', borderRadius: '50%', background: '#356b00' }} />
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
                      <div style={{
                        width: '40px', height: '40px', background: '#fff', borderRadius: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0px 1px 1px rgba(0,0,0,0.05)', flexShrink: 0, fontSize: '20px',
                      }}>
                        🚚
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#191c1d', lineHeight: '16px' }}>
                          Thanh toán khi nhận (COD)
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: 500, color: '#868889', lineHeight: '14px' }}>
                          Kiểm hàng trước khi thanh toán
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {error && (
                  <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
                    ⚠️ {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '16px 32px', background: loading ? '#a8d978' : '#6CC51D',
                    color: '#fff', border: 'none', borderRadius: '8px', fontSize: '20px', fontWeight: 700,
                    letterSpacing: '0.5px', cursor: loading ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
                    transition: 'background 0.2s',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>✅</span>
                  {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '10px', color: '#868889', margin: 0, lineHeight: '14px' }}>
                  🔒 Bằng việc bấm xác nhận, bạn đồng ý với Điều khoản mua sắm và Chính sách quyền riêng tư của Tạp hóa SIN
                </p>
              </div>

              {/* Bottom Feature row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', paddingBottom: '8px' }}>
                {[
                  { icon: '🕐', title: 'Giao hẹn giờ linh hoạt', desc: 'Lựa chọn khung giờ nhận thuận tiện, bảo đảm độ tươi sống của rau củ và thịt cá.' },
                  { icon: '📋', title: 'Đồng kiểm khi nhận hàng', desc: 'Quý khách được mở kiểm tra số lượng và hạn sử dụng trước khi thanh toán.' },
                  { icon: '🎁', title: 'Tích lũy SIN-Points', desc: 'Nhận ngay 4.500 điểm thành viên sau khi đơn hàng giao thành công.' },
                ].map((f) => (
                  <div key={f.title} style={{
                    background: '#fff', borderRadius: '8px', padding: '16px',
                    boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
                    display: 'flex', flexDirection: 'column', gap: '8px',
                  }}>
                    <span style={{ fontSize: '24px' }}>{f.icon}</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#191c1d', lineHeight: '18px' }}>{f.title}</div>
                    <div style={{ fontSize: '12px', color: '#868889', lineHeight: '16px' }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── RIGHT COLUMN: Order Summary ─── */}
            <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Order Summary Card */}
              <div style={{
                background: '#fff', borderRadius: '8px', padding: '24px',
                boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: '16px',
              }}>
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#191c1d' }}>Đơn hàng của bạn</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#356b00', background: '#ebffd7', padding: '2px 8px', borderRadius: '12px' }}>
                    {items.length} sản phẩm ({totalItems} món)
                  </span>
                </div>

                {/* Product list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map((item: any) => {
                    const origPrice = Number(item.product.price);
                    const discount = Number(item.product.discountRate);
                    const salePrice = discount > 0 ? Math.round(origPrice * (1 - discount)) : origPrice;
                    const lineTotal = salePrice * item.quantity;
                    const origLineTotal = origPrice * item.quantity;
                    return (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBlock: '4px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{
                            width: '56px', height: '56px', borderRadius: '8px', background: '#f4f5f9',
                            flexShrink: 0, overflow: 'hidden', position: 'relative',
                          }}>
                            {item.product.thumbnailUrl ? (
                              <Image src={item.product.thumbnailUrl} alt={item.product.title}
                                fill style={{ objectFit: 'cover' }} unoptimized />
                            ) : <span style={{ fontSize: '24px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>🛒</span>}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#191c1d', lineHeight: '18px', maxWidth: '160px' }}>
                              {item.product.title}
                            </div>
                            <div style={{ fontSize: '11px', color: '#868889', lineHeight: '16px' }}>
                              {item.product.unit} × {item.quantity} · Kho: Hồ Chí Minh
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#191c1d' }}>{fmtPrice(lineTotal)}</div>
                          {discount > 0 && (
                            <div style={{ fontSize: '11px', color: '#868889', textDecoration: 'line-through' }}>{fmtPrice(origLineTotal)}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {items.length === 0 && (
                    <p style={{ fontSize: '13px', color: '#868889', textAlign: 'center', padding: '16px 0' }}>Giỏ hàng trống</p>
                  )}
                </div>

                {/* Coupon input */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🏷️</span>
                    <input
                      placeholder="Nhập mã giảm giá..."
                      style={{
                        width: '100%', padding: '10px 12px 10px 36px', background: '#f4f5f9',
                        border: 'none', borderRadius: '8px', fontSize: '13px', color: '#191c1d',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    style={{
                      padding: '10px 14px', background: '#191c1d', color: '#fff',
                      border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Price summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f4f5f9', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#191c1d' }}>
                    <span>Tạm tính hàng</span>
                    <span style={{ fontWeight: 600 }}>{fmtPrice(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#191c1d', alignItems: 'center' }}>
                    <span>Phí vận chuyển <span style={{ fontSize: '12px', color: '#868889' }}>ⓘ</span></span>
                    <span style={{ fontWeight: 600 }}>{fmtPrice(SHIPPING_FEE)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#191c1d' }}>Tổng cộng</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '22px', fontWeight: 700, color: '#f57c00' }}>{fmtPrice(total)}</div>
                      <div style={{ fontSize: '10px', color: '#868889' }}>(Đã bao gồm VAT 8%)</div>
                    </div>
                  </div>
                </div>

                {/* Pay2S info banner */}
                <div style={{ background: '#ebffd7', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>💳</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#191c1d', marginBottom: '4px' }}>
                      Thanh toán tự động qua cổng Pay2S
                    </div>
                    <div style={{ fontSize: '11px', color: '#486f21', lineHeight: '16px' }}>
                      Chuyển khoản VietQR hoặc Ví MoMo, hệ thống tự động gạch nợ trong vòng 1 phút không cần chờ đợi.
                    </div>
                  </div>
                </div>

                {/* Fresh guarantee */}
                <div style={{ background: '#f4f5f9', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>🌿</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#191c1d' }}>Tươi ngon hoặc Hoàn tiền</div>
                    <div style={{ fontSize: '11px', color: '#868889', lineHeight: '16px' }}>Nhận hàng tươi sạch, đạt kiểm định an toàn VSTP.</div>
                  </div>
                </div>
              </div>

              {/* Hotline */}
              <div style={{
                background: '#fff', borderRadius: '8px', padding: '16px 24px',
                boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#868889', marginBottom: '2px' }}>Hỗ trợ giao hàng khẩn cấp:</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#6CC51D' }}>📞 1900 8888 (Miễn phí)</div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#356b00', background: '#ebffd7', padding: '4px 10px', borderRadius: '8px' }}>24/7</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
