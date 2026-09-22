'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAddToCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

/* ── Figma SVG icons ── */
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 11.6667 11.0833" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z" fill="#6CC51D"/>
  </svg>
);

const CartAddIcon = () => (
  <svg width="14" height="17" viewBox="0 0 13.3333 16.6667" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V5C0 4.54167 0.163194 4.14931 0.489583 3.82292C0.815972 3.49653 1.20833 3.33333 1.66667 3.33333H3.33333C3.33333 2.41667 3.65972 1.63194 4.3125 0.979167C4.96528 0.326389 5.75 0 6.66667 0C7.58333 0 8.36806 0.326389 9.02083 0.979167C9.67361 1.63194 10 2.41667 10 3.33333H11.6667C12.125 3.33333 12.5174 3.49653 12.8438 3.82292C13.1701 4.14931 13.3333 4.54167 13.3333 5V15C13.3333 15.4583 13.1701 15.8507 12.8438 16.1771C12.5174 16.5035 12.125 16.6667 11.6667 16.6667H1.66667ZM1.66667 15H11.6667V5H10V6.66667C10 6.90278 9.92014 7.10069 9.76042 7.26042C9.60069 7.42014 9.40278 7.5 9.16667 7.5C8.93056 7.5 8.73264 7.42014 8.57292 7.26042C8.41319 7.10069 8.33333 6.90278 8.33333 6.66667V5H5V6.66667C5 6.90278 4.92014 7.10069 4.76042 7.26042C4.60069 7.42014 4.40278 7.5 4.16667 7.5C3.93056 7.5 3.73264 7.42014 3.57292 7.26042C3.41319 7.10069 3.33333 6.90278 3.33333 6.66667V5H1.66667V15ZM5 3.33333H8.33333C8.33333 2.875 8.17014 2.48264 7.84375 2.15625C7.51736 1.82986 7.125 1.66667 6.66667 1.66667C6.20833 1.66667 5.81597 1.82986 5.48958 2.15625C5.16319 2.48264 5 2.875 5 3.33333Z" fill="white"/>
  </svg>
);

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountRate: number;
  thumbnailUrl?: string;
  unit?: string;
  isHot: boolean;
  avgRating: number;
  reviewCount: number;
  category?: { name: string };
}

interface ProductCardProps {
  product: Product;
  rank?: number; // cho badge "Bán chạy #N"
}

function fmtPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

export function ProductCard({ product, rank }: ProductCardProps) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const salePrice = product.discountRate > 0
    ? Math.round(product.price * (1 - product.discountRate))
    : product.price;
  const hasDiscount = product.discountRate > 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    addToCart({ productId: product.id, quantity: qty });
  }

  function handleQty(e: React.MouseEvent, delta: number) {
    e.preventDefault();
    setQty(q => Math.max(1, q + delta));
  }

  /* Origin label: category + unit */
  const originLabel = [product.category?.name, product.unit].filter(Boolean).join(' • ');

  return (
    <Link href={`/shop/${product.slug}`} style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      background: '#fff', borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      overflow: 'hidden', textDecoration: 'none', color: 'inherit',
      fontFamily: 'Poppins, sans-serif',
    }}>

      {/* ── Image area 208px ── */}
      <div style={{ position: 'relative', height: '208px', background: '#F4F5F9', overflow: 'hidden', flexShrink: 0 }}>
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            unoptimized
            onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.05)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>🛒</div>
        )}

        {/* Badge "Bán chạy #N" — Figma: #EBFFD7 bg, #356b00 text, rounded-12px */}
        {(rank || product.isHot) && (
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            background: '#EBFFD7',
            boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
            borderRadius: '12px', padding: '4px 8px',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#356b00', whiteSpace: 'nowrap' }}>
              {rank ? `Bán chạy #${rank}` : 'Bán chạy'}
            </span>
          </div>
        )}

        {/* Discount badge top-right */}
        {hasDiscount && (
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            background: '#ff4444', color: '#fff',
            borderRadius: '12px', padding: '4px 8px',
            fontSize: '10px', fontWeight: 700,
          }}>
            -{Math.round(product.discountRate * 100)}%
          </div>
        )}
      </div>

      {/* ── Info area ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '19px 12px 12px', flex: 1 }}>
        {/* Origin / unit */}
        {originLabel && (
          <div style={{ fontSize: '10px', fontWeight: 500, color: '#868889', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {originLabel}
          </div>
        )}

        {/* Title — 2 lines max */}
        <div style={{ overflow: 'hidden' }}>
          <h3 style={{
            fontSize: '15px', fontWeight: 700, color: '#000', margin: 0, lineHeight: '20px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.title}
          </h3>
        </div>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <StarIcon />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#000' }}>
              {product.avgRating.toFixed(1)}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 500, color: '#868889' }}>
              ({product.reviewCount} đánh giá)
            </span>
          </div>
        )}

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', paddingTop: '4px', flexWrap: 'nowrap' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#000', lineHeight: '24px' }}>
            {fmtPrice(salePrice)}
          </span>
          {hasDiscount && (
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#868889', textDecoration: 'line-through' }}>
              {fmtPrice(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* ── Bottom row: qty selector + cart button ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px 12px' }}>

        {/* Qty selector: [−][1][+] */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#F4F5F9', borderRadius: '8px', padding: '4px',
        }}>
          <button
            onClick={e => handleQty(e, -1)}
            style={{
              width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
              fontSize: '15px', fontWeight: 700, color: '#000', lineHeight: 1,
            }}
          >−</button>
          <div style={{ width: '32px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#000' }}>
            {qty}
          </div>
          <button
            onClick={e => handleQty(e, +1)}
            style={{
              width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
              fontSize: '15px', fontWeight: 700, color: '#000', lineHeight: 1,
            }}
          >+</button>
        </div>

        {/* Add to cart button — green 40×40 */}
        <button
          onClick={handleAddToCart}
          disabled={isPending}
          style={{
            width: '40px', height: '40px', borderRadius: '8px',
            background: isPending ? '#a8d978' : '#6CC51D',
            boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
            border: 'none', cursor: isPending ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.2s',
          }}
        >
          <CartAddIcon />
        </button>
      </div>
    </Link>
  );
}

/* ── Skeleton ── */
export function ProductCardSkeleton() {
  return (
    <div style={{
      background: '#fff', borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      overflow: 'hidden',
    }}>
      <div style={{ height: '208px', background: '#F4F5F9' }} />
      <div style={{ padding: '19px 12px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '10px', width: '50%', background: '#F4F5F9', borderRadius: '4px' }} />
        <div style={{ height: '14px', width: '80%', background: '#F4F5F9', borderRadius: '4px' }} />
        <div style={{ height: '12px', width: '40%', background: '#F4F5F9', borderRadius: '4px' }} />
        <div style={{ height: '22px', width: '55%', background: '#F4F5F9', borderRadius: '4px' }} />
      </div>
      <div style={{ padding: '0 12px 12px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ height: '36px', width: '88px', background: '#F4F5F9', borderRadius: '8px' }} />
        <div style={{ height: '40px', width: '40px', background: '#F4F5F9', borderRadius: '8px' }} />
      </div>
    </div>
  );
}
