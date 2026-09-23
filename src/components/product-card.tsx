'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAddToCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

/* ─────────────────────────────────────────────────────────────────────────────
   SVG Icons — inline từ Figma (node 1-135)
───────────────────────────────────────────────────────────────────────────── */

/** ⭐ Star — fill #6CC51D */
const StarSVG = () => (
  <svg width="12" height="11" viewBox="0 0 11.6667 11.0833" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z" fill="#6CC51D"/>
  </svg>
);

/** 🛍 Cart/Bag — fill white (dùng bên trong nút xanh) */
const BagSVG = () => (
  <svg width="13" height="17" viewBox="0 0 13.3333 16.6667" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V5C0 4.54167 0.163194 4.14931 0.489583 3.82292C0.815972 3.49653 1.20833 3.33333 1.66667 3.33333H3.33333C3.33333 2.41667 3.65972 1.63194 4.3125 0.979167C4.96528 0.326389 5.75 0 6.66667 0C7.58333 0 8.36806 0.326389 9.02083 0.979167C9.67361 1.63194 10 2.41667 10 3.33333H11.6667C12.125 3.33333 12.5174 3.49653 12.8438 3.82292C13.1701 4.14931 13.3333 4.54167 13.3333 5V15C13.3333 15.4583 13.1701 15.8507 12.8438 16.1771C12.5174 16.5035 12.125 16.6667 11.6667 16.6667H1.66667ZM1.66667 15H11.6667V5H10V6.66667C10 6.90278 9.92014 7.10069 9.76042 7.26042C9.60069 7.42014 9.40278 7.5 9.16667 7.5C8.93056 7.5 8.73264 7.42014 8.57292 7.26042C8.41319 7.10069 8.33333 6.90278 8.33333 6.66667V5H5V6.66667C5 6.90278 4.92014 7.10069 4.76042 7.26042C4.60069 7.42014 4.40278 7.5 4.16667 7.5C3.93056 7.5 3.73264 7.42014 3.57292 7.26042C3.41319 7.10069 3.33333 6.90278 3.33333 6.66667V5H1.66667V15ZM5 3.33333H8.33333C8.33333 2.875 8.17014 2.48264 7.84375 2.15625C7.51736 1.82986 7.125 1.66667 6.66667 1.66667C6.20833 1.66667 5.81597 1.82986 5.48958 2.15625C5.16319 2.48264 5 2.875 5 3.33333Z" fill="white"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
export interface ProductCardData {
  id: string;
  title: string;
  slug: string;
  price: number | string;
  discountRate: number | string;
  thumbnailUrl?: string;
  unit?: string;
  isHot?: boolean;
  avgRating?: number;
  reviewCount?: number;
  category?: { id?: string; name: string };
  stockQuantity?: number;
  images?: { url: string }[];
}

interface ProductCardProps {
  product: ProductCardData;
  rank?: number;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────────── */
function fmtPrice(n: number | string) {
  return new Intl.NumberFormat('vi-VN').format(Number(n)) + '₫';
}

/* ─────────────────────────────────────────────────────────────────────────────
   ProductCard — pixel-perfect theo Figma node 1:135
───────────────────────────────────────────────────────────────────────────── */
export function ProductCard({ product, rank }: ProductCardProps) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const price = Number(product.price);
  const discountRate = Number(product.discountRate);
  const salePrice = discountRate > 0 ? Math.round(price * (1 - discountRate)) : price;
  const hasDiscount = discountRate > 0;

  /* origin label: "category • unit" */
  const originLabel = [product.category?.name, product.unit].filter(Boolean).join(' • ');

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    addToCart({ productId: product.id, quantity: qty });
  }

  function changeQty(e: React.MouseEvent, delta: number) {
    e.preventDefault();
    e.stopPropagation();
    setQty(q => Math.max(1, q + delta));
  }

  return (
    <Link
      href={`/shop/${product.slug}`}
      style={{
        /* Card wrapper */
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        fontFamily: 'Roboto, sans-serif',
        position: 'relative',
      }}
    >
      {/* ── TOP: Image area ──────────────────────────────────── */}
      <div style={{ position: 'relative' }}>

        {/* Image bg + photo */}
        <div style={{
          background: '#F4F5F9',
          height: '208px',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
              unoptimized
            />
          ) : (
            <span style={{ fontSize: '3rem' }}>🛒</span>
          )}
        </div>

        {/* Badge "Bán chạy #N" — absolute top-left 8px */}
        {(rank != null || product.isHot) && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: '#EBFFD7',
            boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
            borderRadius: '12px',
            padding: '4px 8px',
            zIndex: 2,
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#356B00',
              whiteSpace: 'nowrap',
              lineHeight: '14px',
            }}>
              {rank != null ? `Bán chạy #${rank}` : 'Bán chạy'}
            </span>
          </div>
        )}
      </div>

      {/* ── MIDDLE: Info area ────────────────────────────────── */}
      {/* pt-19 px-12 pb-12 gap-4 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '19px 12px 12px',
        flex: 1,
      }}>

        {/* Origin: "Đà Lạt • Túi 500g" — 10px medium #868889 */}
        {originLabel ? (
          <div style={{
            fontSize: '10px',
            fontWeight: 500,
            color: '#868889',
            lineHeight: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {originLabel}
          </div>
        ) : null}

        {/* Title — 15px bold black, 2 lines */}
        <div style={{ overflow: 'hidden', paddingTop: '3px' }}>
          <h3 style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 700,
            color: '#000',
            lineHeight: '20px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {product.title}
          </h3>
        </div>

        {/* Rating: ⭐ score (đánh giá) */}
        {(product.reviewCount ?? 0) > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <StarSVG />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#000', lineHeight: '14px' }}>
              {(product.avgRating ?? 0).toFixed(1)}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 500, color: '#868889', lineHeight: '14px' }}>
              ({product.reviewCount} đánh giá)
            </span>
          </div>
        )}

        {/* Price: 18px bold + strikethrough 12px */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
          paddingTop: '4px',
          flexWrap: 'nowrap',
        }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#000', lineHeight: '24px' }}>
            {fmtPrice(salePrice)}
          </span>
          {hasDiscount && (
            <span style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#868889',
              textDecoration: 'line-through',
              lineHeight: '16px',
            }}>
              {fmtPrice(price)}
            </span>
          )}
        </div>
      </div>

      {/* ── BOTTOM: Qty selector + Cart button ──────────────── */}
      {/* px-12 pb-12, space-between */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px 12px',
      }}>

        {/* Qty: bg-#f4f5f9 p-4 rounded-8 | [-][1][+] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#F4F5F9',
          borderRadius: '8px',
          padding: '4px',
        }}>
          {/* − button: bg-white 28×28 rounded-4 */}
          <button
            onClick={e => changeQty(e, -1)}
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 700,
              color: '#000',
              lineHeight: '15px',
              flexShrink: 0,
            }}
          >
            -
          </button>

          {/* qty display: w-32px, 12px bold center */}
          <div style={{
            width: '32px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 700,
            color: '#000',
            lineHeight: '16px',
          }}>
            {qty}
          </div>

          {/* + button: bg-white 28×28 rounded-4 */}
          <button
            onClick={e => changeQty(e, +1)}
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 700,
              color: '#000',
              lineHeight: '15px',
              flexShrink: 0,
            }}
          >
            +
          </button>
        </div>

        {/* Cart button: bg-#6cc51d 40×40 rounded-8 shadow + bag SVG */}
        <button
          onClick={handleAdd}
          disabled={isPending}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isPending ? '#a8d978' : '#6CC51D',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
            cursor: isPending ? 'wait' : 'pointer',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
        >
          <BagSVG />
        </button>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ProductCardSkeleton — loading state
───────────────────────────────────────────────────────────────────────────── */
export function ProductCardSkeleton() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      fontFamily: 'Roboto, sans-serif',
    }}>
      {/* Image skeleton */}
      <div style={{ height: '208px', background: '#F4F5F9' }} />

      {/* Info skeleton */}
      <div style={{ padding: '19px 12px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '10px', width: '55%', background: '#F4F5F9', borderRadius: '4px' }} />
        <div style={{ height: '14px', width: '85%', background: '#F4F5F9', borderRadius: '4px' }} />
        <div style={{ height: '14px', width: '60%', background: '#F4F5F9', borderRadius: '4px' }} />
        <div style={{ height: '11px', width: '45%', background: '#F4F5F9', borderRadius: '4px' }} />
        <div style={{ height: '22px', width: '50%', background: '#F4F5F9', borderRadius: '4px', marginTop: '4px' }} />
      </div>

      {/* Bottom skeleton */}
      <div style={{ padding: '0 12px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ height: '36px', width: '88px', background: '#F4F5F9', borderRadius: '8px' }} />
        <div style={{ height: '40px', width: '40px', background: '#F4F5F9', borderRadius: '8px' }} />
      </div>
    </div>
  );
}
