'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          style={{ fontSize: '1.5rem', transition: 'transform 0.1s', transform: hover === star ? 'scale(1.2)' : 'scale(1)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ color: star <= (hover || value) ? '#f59e0b' : '#d1d5db' }}>★</span>
        </button>
      ))}
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

interface ReviewsSectionProps {
  slug: string;
  productId: string;
}

export function ReviewsSection({ slug, productId }: ReviewsSectionProps) {
  const qc = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', slug],
    queryFn: () => reviewsApi.getByProduct(slug),
  });

  const createMut = useMutation({
    mutationFn: () => reviewsApi.create(productId, { rating, comment: comment || undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', slug] });
      qc.invalidateQueries({ queryKey: ['product', slug] });
      setComment('');
      setRating(5);
      setShowForm(false);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (reviewId: string) => reviewsApi.delete(reviewId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', slug] });
      qc.invalidateQueries({ queryKey: ['product', slug] });
    },
  });

  return (
    <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '2rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
          ⭐ Đánh giá ({data?.total ?? 0})
        </h2>

        {/* Rating summary */}
        {data?.total > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--warning)' }}>{data.avgRating.toFixed(1)}</span>
            <div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ color: s <= Math.round(data.avgRating) ? 'var(--warning)' : 'var(--gray-200)', fontSize: '1.25rem' }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>{data.total} đánh giá</p>
            </div>
          </div>
        )}

        {isAuthenticated && !showForm && (
          <button className="btn btn-outline btn-sm" onClick={() => setShowForm(true)}>✏️ Viết đánh giá</button>
        )}
      </div>

      {/* Rating distribution bars */}
      {data?.total > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1.5rem', maxWidth: '320px' }}>
          {data.distribution.map(({ star, count }: { star: number; count: number }) => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <span style={{ width: '12px', textAlign: 'right', color: 'var(--gray-600)', fontWeight: 600 }}>{star}</span>
              <span style={{ color: 'var(--warning)', fontSize: '0.75rem' }}>★</span>
              <div style={{ flex: 1, height: '8px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--warning)', borderRadius: '4px', width: `${data.total ? (count / data.total) * 100 : 0}%`, transition: 'width 0.5s' }} />
              </div>
              <span style={{ color: 'var(--gray-400)', width: '24px' }}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Write review form */}
      {showForm && isAuthenticated && (
        <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', border: '1.5px solid var(--primary)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9375rem' }}>✍️ Đánh giá của bạn</h3>
          {createMut.isError && (
            <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>
              {(createMut.error as any)?.response?.data?.message || 'Lỗi khi gửi đánh giá'}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Số sao *</p>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="review-comment">Nhận xét (không bắt buộc)</label>
              <textarea
                id="review-comment"
                className="form-input"
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Sản phẩm tươi ngon, giao hàng nhanh..."
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary btn-sm" disabled={createMut.isPending} onClick={() => createMut.mutate()}>
                {createMut.isPending ? 'Đang gửi...' : '📤 Gửi đánh giá'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-md)' }} />)}
        </div>
      ) : data?.reviews?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--gray-400)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
          <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data?.reviews?.map((review: any) => (
            <div key={review.id} style={{ padding: '1rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    {review.user.fullName?.[0] || '?'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{review.user.fullName}</p>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= review.rating ? '#f59e0b' : '#d1d5db', fontSize: '0.875rem' }}>★</span>)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{formatDate(review.createdAt)}</span>
                  {(user?.id === review.user.id) && (
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', fontSize: '0.75rem', padding: '2px 6px' }} onClick={() => { if (confirm('Xóa đánh giá?')) deleteMut.mutate(review.id); }}>
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              {review.comment && <p style={{ fontSize: '0.9375rem', color: 'var(--gray-700)', lineHeight: 1.7, paddingLeft: '44px' }}>{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
