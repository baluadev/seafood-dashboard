'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/* ── Types ── */
interface RecentOrder {
  id: string;
  customerName: string;
  district: string;
  createdAt: string;
  product: {
    title: string;
    slug: string;
    thumbnailUrl?: string;
  };
}

/* ── Fallback data (shown if API returns empty / fails) ── */
const FALLBACK: RecentOrder[] = [
  { id: 'f1', customerName: 'Lan', district: 'Hoàn Kiếm', createdAt: new Date(Date.now() - 2 * 60000).toISOString(), product: { title: 'Bơ sáp Đắk Lắk', slug: 'bo-sap-dak-lak' } },
  { id: 'f2', customerName: 'Minh', district: 'Cầu Giấy', createdAt: new Date(Date.now() - 5 * 60000).toISOString(), product: { title: 'Cá hồi Nauy fillet', slug: 'ca-hoi-nauy-fillet' } },
  { id: 'f3', customerName: 'Hoa', district: 'Đống Đa', createdAt: new Date(Date.now() - 8 * 60000).toISOString(), product: { title: 'Gà khô sợi tẩm', slug: 'ga-kho' } },
  { id: 'f4', customerName: 'Tuấn', district: 'Tây Hồ', createdAt: new Date(Date.now() - 12 * 60000).toISOString(), product: { title: 'Cua Biển Tươi Sống', slug: 'cua-bien-tuoi-song' } },
];

/* ── Time helper ── */
function timeAgo(isoStr: string): string {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

/* ── Cart icon ── */
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M1 1h3.5l2.3 11.5a2 2 0 0 0 2 1.5h8.4a2 2 0 0 0 2-1.7L20 6H5" stroke="#6CC51D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="20" r="1.2" fill="#6CC51D"/>
    <circle cx="17" cy="20" r="1.2" fill="#6CC51D"/>
  </svg>
);

/* ── Main component ── */
export function LivePurchaseToast() {
  const router = useRouter();
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [current, setCurrent] = useState<RecentOrder | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false); // dismissed until next cycle
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Fetch real orders, fallback to FALLBACK */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/recent-orders');
        const data: RecentOrder[] = await res.json();
        setOrders(data.length >= 2 ? data : FALLBACK);
      } catch {
        setOrders(FALLBACK);
      }
    };
    load();
    // Re-fetch every 60s
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  /* Cycle through orders */
  const showNext = useCallback(() => {
    if (orders.length === 0) return;
    const idx = indexRef.current % orders.length;
    indexRef.current += 1;
    setCurrent(orders[idx]);
    setDismissed(false);
    setVisible(true);

    // Auto-hide after 4.5s
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, 4500);
  }, [orders]);

  useEffect(() => {
    if (orders.length === 0) return;
    // First toast after 3s delay
    const first = setTimeout(showNext, 3000);
    // Then every 8s
    const interval = setInterval(showNext, 8000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [orders, showNext]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    setDismissed(true);
  };

  const handleClick = () => {
    if (!current?.product?.slug) return;
    router.push(`/shop/${current.product.slug}`);
    setVisible(false);
  };

  if (!current || dismissed) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '16px',
        zIndex: 9999,
        maxWidth: '320px',
        width: 'calc(100vw - 32px)',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
        padding: '10px 12px 10px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        transform: visible ? 'translateY(0)' : 'translateY(calc(100% + 32px))',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        userSelect: 'none',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '10px',
        background: '#EBFFD7', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative',
      }}>
        {current.product.thumbnailUrl ? (
          <Image
            src={current.product.thumbnailUrl}
            alt={current.product.title}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        ) : (
          <CartIcon />
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px', fontWeight: 600, color: '#191c1d',
          lineHeight: '1.35', overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
        }}>
          {current.customerName} vừa đặt{' '}
          <span style={{ color: '#356b00' }}>{current.product.title}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#868889', marginTop: '2px' }}>
          {timeAgo(current.createdAt)}
          {current.district ? ` • ${current.district}` : ''}
        </div>
      </div>

      {/* Close btn */}
      <button
        onClick={handleDismiss}
        style={{
          width: '20px', height: '20px', borderRadius: '50%',
          background: '#f3f4f4', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: '12px', color: '#868889',
          lineHeight: 1, padding: 0,
        }}
        aria-label="Đóng"
      >
        ×
      </button>
    </div>
  );
}
