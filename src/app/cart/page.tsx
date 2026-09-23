'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/use-cart';
import { useProducts } from '@/hooks/use-products';
import { ProductCard } from '@/components/product-card';

/* ── SVG icons ── */
const HomeIcon = () => (
  <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
    <path d="M1 4.5L5.5 1L10 4.5V11H7V7.5H4V11H1V4.5Z" stroke="#868889" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="4" height="7" viewBox="0 0 4 7" fill="none">
    <path d="M1 0.5L3.5 3.5L1 6.5" stroke="#868889" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none">
    <path d="M1 3.5H13M5 3.5V2.5C5 1.95 5.45 1.5 6 1.5H8C8.55 1.5 9 1.95 9 2.5V3.5M5.5 6.5V11.5M8.5 6.5V11.5M2 3.5L2.8 12.5C2.85 13.05 3.3 13.5 3.85 13.5H10.15C10.7 13.5 11.15 13.05 11.2 12.5L12 3.5H2Z" stroke="#868889" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
    <path d="M7.5 12.5S1.5 8.5 1.5 4.5C1.5 2.84 2.84 1.5 4.5 1.5C5.5 1.5 6.38 1.97 7 2.71C7.62 1.97 8.5 1.5 9.5 1.5C11.16 1.5 12.5 2.84 12.5 4.5C12.5 8.5 7.5 12.5 7.5 12.5Z" stroke="#868889" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
);
const DeleteSelectedIcon = () => (
  <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
    <path d="M1 5.5H10M10 5.5L7 2.5M10 5.5L7 8.5" stroke="#868889" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 1.5V9.5" stroke="#ba1a1a" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const VoucherIcon = () => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 1H13V4C12.17 4 11.5 4.67 11.5 5.5S12.17 7 13 7V10H1V7C1.83 7 2.5 6.33 2.5 5.5S1.83 4 1 4V1Z" stroke="#6CC51D" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M5.5 1V10" stroke="#6CC51D" strokeWidth="1" strokeDasharray="1.5 1.5"/>
  </svg>
);
const ShipIcon = () => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M0.5 6.5H10V1H0.5V6.5Z" stroke="#6CC51D" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M10 2.5H12L13.5 5V6.5H10V2.5Z" stroke="#6CC51D" strokeWidth="1.2" strokeLinejoin="round"/>
    <circle cx="3" cy="8" r="1.2" stroke="#6CC51D" strokeWidth="1.2"/>
    <circle cx="11" cy="8" r="1.2" stroke="#6CC51D" strokeWidth="1.2"/>
  </svg>
);
const OrderSumIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="12" height="12" rx="2" stroke="#191c1d" strokeWidth="1.2"/>
    <path d="M4 5H10M4 7H10M4 9H7" stroke="#191c1d" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const NoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 2H12V10L9 13H2V2Z" stroke="#868889" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M9 10V13L12 10H9Z" fill="#868889"/>
    <path d="M4 5H10M4 7H8" stroke="#868889" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* ── Helpers ── */
function fmtPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

/* ── Checkbox ── */
function GreenCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{
      width: '20px', height: '20px', borderRadius: '2.5px', flexShrink: 0,
      background: checked ? '#356b00' : '#fff',
      border: `1.5px solid ${checked ? '#356b00' : '#D0D5DD'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {checked && <CheckIcon />}
    </button>
  );
}

/* ── Cart Item Row ── */
function CartItemRow({
  item, checked, onToggle, onQtyChange, onRemove,
}: {
  item: any;
  checked: boolean;
  onToggle: () => void;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}) {
  const { mutate: updateQty, isPending: updating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: removing } = useRemoveCartItem();
  const price = Number(item.product?.price ?? 0);
  const discount = Number(item.product?.discountRate ?? 0);
  const salePrice = discount > 0 ? Math.round(price * (1 - discount)) : price;
  const lineTotal = salePrice * item.quantity;

  function handleQty(delta: number) {
    const newQty = Math.max(1, item.quantity + delta);
    updateQty({ itemId: item.id, quantity: newQty }, { onSuccess: () => onQtyChange(newQty) });
  }

  return (
    <div style={{
      background: '#fff', borderRadius: '8px',
      boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px', gap: '12px',
    }}>
      {/* Left: checkbox + image + info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <GreenCheckbox checked={checked} onChange={onToggle} />

        {/* Product image */}
        <div style={{ position: 'relative', width: '96px', height: '96px', borderRadius: '4px', background: '#F4F5F9', overflow: 'hidden', flexShrink: 0 }}>
          {item.product?.thumbnailUrl && (
            <Image src={item.product.thumbnailUrl} alt={item.product.title} fill style={{ objectFit: 'cover' }} unoptimized />
          )}
          {/* Badge: category/VietGAP */}
          <div style={{
            position: 'absolute', top: '4px', left: '4px',
            background: '#356b00', borderRadius: '12px', padding: '2px 6px',
            boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>
              {item.product?.category?.name ?? 'Fresh'}
            </span>
          </div>
        </div>

        {/* Product info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              background: '#EBFFD7', color: '#356b00', fontSize: '10px', fontWeight: 600,
              padding: '2px 4px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '2px',
            }}>
              ⚡ Giao trong 2h
            </span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889' }}>
              {item.product?.unit ? `${item.product.unit}` : ''}
            </span>
          </div>

          {/* Title */}
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#191c1d', lineHeight: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
            {item.product?.title}
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#356b00' }}>{fmtPrice(salePrice)}</span>
            {discount > 0 && (
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889', textDecoration: 'line-through' }}>{fmtPrice(price)}</span>
            )}
            {discount > 0 && (
              <span style={{ background: '#FFDAD6', color: '#ba1a1a', fontSize: '10px', fontWeight: 700, padding: '1px 4px', borderRadius: '2px' }}>
                -{Math.round(discount * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: qty selector + line total + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>
        {/* Qty selector */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#F4F5F9', borderRadius: '8px', padding: '4px' }}>
          <button onClick={() => handleQty(-1)} disabled={updating || item.quantity <= 1} style={{
            width: '32px', height: '32px', background: '#fff', border: 'none', borderRadius: '4px',
            cursor: 'pointer', fontSize: '16px', fontWeight: 700, color: '#191c1d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>−</button>
          <div style={{ width: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#191c1d' }}>
            {item.quantity}
          </div>
          <button onClick={() => handleQty(+1)} disabled={updating} style={{
            width: '32px', height: '32px', background: '#fff', border: 'none', borderRadius: '4px',
            cursor: 'pointer', fontSize: '16px', fontWeight: 700, color: '#191c1d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>+</button>
        </div>

        {/* Line total */}
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#191c1d', minWidth: '80px', textAlign: 'right' }}>
          {fmtPrice(lineTotal)}
        </span>

        {/* Action icons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button title="Lưu yêu thích" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: 0.6, transition: 'opacity 0.15s' }}>
            <HeartIcon />
          </button>
          <button
            title="Xóa"
            onClick={() => removeItem(item.id)}
            disabled={removing}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: removing ? 0.4 : 0.6, transition: 'opacity 0.15s' }}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  Cart Page                                                      */
/* ═══════════════════════════════════════════════════════════════ */
export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const { mutate: removeItem } = useRemoveCartItem();

  const items: any[] = cart?.items ?? [];
  const [checked, setChecked] = useState<Set<string>>(() => new Set(items.map((i: any) => i.id)));
  const [voucherCode, setVoucherCode] = useState('SIN30');
  const [note, setNote] = useState('');

  /* Sync checked when items load */
  const allIds = new Set(items.map((i: any) => i.id));
  const allChecked = allIds.size > 0 && [...allIds].every(id => checked.has(id));

  function toggleAll() {
    if (allChecked) setChecked(new Set());
    else setChecked(new Set(allIds));
  }
  function toggleOne(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function deleteSelected() {
    checked.forEach(id => removeItem(id));
    setChecked(new Set());
  }

  /* Price calc */
  const selectedItems = items.filter((i: any) => checked.has(i.id));
  const subtotal = selectedItems.reduce((sum: number, i: any) => {
    const price = Number(i.product?.price ?? 0);
    const discount = Number(i.product?.discountRate ?? 0);
    const salePrice = discount > 0 ? Math.round(price * (1 - discount)) : price;
    return sum + salePrice * i.quantity;
  }, 0);
  const originalTotal = selectedItems.reduce((sum: number, i: any) => sum + Number(i.product?.price ?? 0) * i.quantity, 0);
  const discountAmt = originalTotal - subtotal;
  const voucherAmt = voucherCode === 'SIN30' ? 30000 : 0;
  const shippingFee = subtotal >= 150000 ? 0 : 25000;
  const total = Math.max(0, subtotal - voucherAmt + shippingFee);
  const savings = discountAmt + voucherAmt + (shippingFee === 0 && subtotal > 0 ? 25000 : 0);

  /* Related products */
  const { data: suggestRes } = useProducts({ limit: 4 });
  const suggestions = suggestRes?.data ?? [];

  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '800px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '120px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );

  if (!items.length) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA', fontFamily: 'Roboto, sans-serif' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', paddingTop: '80px' }}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#191c1d' }}>Giỏ hàng của bạn đang trống</h2>
        <p style={{ color: '#868889', fontSize: '14px' }}>Hãy thêm sản phẩm để bắt đầu mua sắm</p>
        <Link href="/shop" style={{ background: '#6CC51D', color: '#fff', padding: '12px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
          Khám phá sản phẩm →
        </Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA', fontFamily: 'Roboto, sans-serif' }}>
      <Header />
      <div style={{ paddingTop: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* ── Breadcrumb ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
              <HomeIcon />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889' }}>Trang chủ</span>
            </Link>
            <ChevronRightIcon />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#191c1d' }}>Giỏ hàng của bạn</span>
          </nav>

          {/* ── Main 8+4 grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

            {/* ════ LEFT COLUMN ════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Select all bar */}
              <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GreenCheckbox checked={allChecked} onChange={toggleAll} />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#191c1d' }}>
                    Chọn tất cả ({items.length} sản phẩm)
                  </span>
                </div>
                <button
                  onClick={deleteSelected}
                  disabled={checked.size === 0}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: 'none', border: 'none', cursor: checked.size > 0 ? 'pointer' : 'not-allowed',
                    opacity: checked.size > 0 ? 1 : 0.4, transition: 'opacity 0.15s',
                  }}
                >
                  <DeleteSelectedIcon />
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889' }}>Xóa đã chọn</span>
                </button>
              </div>

              {/* Cart items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item: any) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    checked={checked.has(item.id)}
                    onToggle={() => toggleOne(item.id)}
                    onQtyChange={() => {}}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>

              {/* Note textarea */}
              <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <NoteIcon />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#191c1d' }}>Ghi chú cho đơn hàng &amp; Shipper</span>
                </div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, bơ chín vừa ăn để ăn liền, gọi trước khi đến..."
                  rows={3}
                  style={{
                    width: '100%', border: '1.5px solid #EBEBEB', borderRadius: '8px',
                    padding: '10px 12px', fontSize: '13px', color: '#191c1d',
                    fontFamily: 'Roboto, sans-serif', lineHeight: '20px',
                    resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* ════ RIGHT COLUMN ════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'sticky', top: '96px' }}>

              {/* Voucher box */}
              <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <VoucherIcon />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#191c1d' }}>Mã ưu đãi / Khuyến mãi</span>
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#6CC51D', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🏷 Chọn mã khác (3)
                  </button>
                </div>

                {/* Voucher input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#F8F9FA', border: '1.5px solid #EBEBEB', borderRadius: '8px', padding: '0 12px', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>🎟</span>
                    <input
                      value={voucherCode}
                      onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã giảm giá"
                      style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: '14px', fontWeight: 700, color: '#191c1d', fontFamily: 'Roboto, sans-serif' }}
                    />
                  </div>
                  <button style={{ padding: '10px 16px', background: '#6CC51D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'Roboto, sans-serif' }}>
                    Áp dụng
                  </button>
                </div>

                {/* Quick voucher pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { code: 'SIN30', label: 'SIN30 -30k' },
                    { code: 'FREESHIP', label: 'FREESHIP' },
                    { code: 'SINMEMBER10', label: 'SINMEMBER10' },
                  ].map(v => (
                    <button
                      key={v.code}
                      onClick={() => setVoucherCode(v.code)}
                      style={{
                        padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                        border: `1.5px solid ${voucherCode === v.code ? '#6CC51D' : '#EBEBEB'}`,
                        background: voucherCode === v.code ? '#EBFFD7' : '#fff',
                        color: voucherCode === v.code ? '#356b00' : '#868889',
                        cursor: 'pointer', fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order summary */}
              <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                  <OrderSumIcon />
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#191c1d' }}>Tóm tắt đơn hàng</span>
                </div>

                {[
                  { label: `Tạm tính (${selectedItems.length} món):`, value: fmtPrice(subtotal), color: '#191c1d' },
                  { label: '🏷 Giảm giá khuyến mãi:', value: discountAmt > 0 ? `-${fmtPrice(discountAmt)}` : '0₫', color: '#6CC51D' },
                  { label: '🎟 Mã voucher (SIN30):', value: voucherAmt > 0 ? `-${fmtPrice(voucherAmt)}` : '0₫', color: '#6CC51D' },
                  {
                    label: '🚚 Phí vận chuyển:',
                    value: shippingFee === 0 ? <><s style={{ color: '#868889', fontSize: '12px' }}>25.000₫</s> <span style={{ color: '#6CC51D', fontWeight: 700 }}>0₫ (Miễn phí)</span></> : fmtPrice(shippingFee),
                    color: '#191c1d',
                  },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '13px' }}>
                    <span style={{ color: '#868889', fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontWeight: 700, color: row.color as string }}>{row.value}</span>
                  </div>
                ))}

                <div style={{ borderTop: '1px dashed #EBEBEB', paddingTop: '12px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#191c1d' }}>Tổng thanh toán:</span>
                    <span style={{ fontSize: '22px', fontWeight: 700, color: '#356b00' }}>{fmtPrice(total)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#868889', marginBottom: '16px' }}>
                    <span>Đã bao gồm VAT nếu có</span>
                    {savings > 0 && <span style={{ color: '#6CC51D', fontWeight: 600 }}>Tiết kiệm {fmtPrice(savings)}</span>}
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    disabled={selectedItems.length === 0}
                    style={{
                      width: '100%', padding: '14px', background: selectedItems.length > 0 ? '#6CC51D' : '#D0D5DD',
                      color: '#fff', border: 'none', borderRadius: '12px',
                      fontSize: '15px', fontWeight: 700, cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed',
                      fontFamily: 'Roboto, sans-serif', transition: 'background 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                  >
                    Tiến hành đặt hàng ngay →
                  </button>
                </div>

                {/* Payment methods */}
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#868889', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Phương thức thanh toán chấp nhận
                  </div>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['MoMo', 'ZaloPay', 'VietQR', 'Visa / Master', 'COD'].map(pm => (
                      <span key={pm} style={{ padding: '3px 8px', background: '#F8F9FA', border: '1px solid #EBEBEB', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#191c1d' }}>
                        {pm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Gợi ý mua kèm ── */}
          {suggestions.length > 0 && (
            <section style={{ paddingTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '24px', background: '#6CC51D', borderRadius: '2px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#000', margin: 0 }}>
                    Gợi ý mua kèm – Tiện tay bỏ giỏ
                  </h2>
                </div>
                <Link href="/shop" style={{ fontSize: '13px', fontWeight: 600, color: '#6CC51D', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Xem tất cả ưu đãi &rsaquo;
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {suggestions.slice(0, 4).map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
