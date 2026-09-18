'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAddToCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountRate: number;
  thumbnailUrl?: string;
  unit: string;
  isHot: boolean;
  avgRating: number;
  reviewCount: number;
}

interface ProductCardProps {
  product: Product;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export function ProductCard({ product }: ProductCardProps) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const salePrice = Math.round(product.price * (1 - product.discountRate));
  const hasDiscount = product.discountRate > 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    addToCart({ productId: product.id, quantity: 1 });
  }

  return (
    <Link href={`/shop/${product.slug}`} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--gray-50)', overflow: 'hidden' }}>
        {product.thumbnailUrl ? (
          <Image src={product.thumbnailUrl} alt={product.title} fill style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.05)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🦐</div>
        )}
        {product.isHot && (
          <div style={{ position: 'absolute', top: '0.625rem', left: '0.625rem' }}>
            <span className="badge-hot">🔥 Hot</span>
          </div>
        )}
        {hasDiscount && (
          <div style={{ position: 'absolute', top: '0.625rem', right: '0.625rem', background: 'var(--error)', color: 'white', borderRadius: 'var(--radius-full)', padding: '0.15rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
            -{Math.round(product.discountRate * 100)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--gray-800)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.title}
        </h3>
        {product.reviewCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
            <span style={{ color: 'var(--warning)' }}>★</span>
            <span>{product.avgRating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="price">{formatPrice(salePrice)}<span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--gray-500)' }}>/{product.unit}</span></span>
          {hasDiscount && <span className="price-original">{formatPrice(product.price)}</span>}
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
          onClick={handleAddToCart}
          disabled={isPending}
        >
          {isPending ? 'Đang thêm...' : '🛒 Thêm vào giỏ'}
        </button>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton" style={{ aspectRatio: '4/3' }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="skeleton" style={{ height: '1rem', width: '75%' }} />
        <div className="skeleton" style={{ height: '0.875rem', width: '40%' }} />
        <div className="skeleton" style={{ height: '1.25rem', width: '55%' }} />
        <div className="skeleton" style={{ height: '2.5rem', borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  );
}
