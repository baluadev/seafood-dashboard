'use client';

import { useState, useEffect } from 'react';
import { useCouponStore } from '@/store/coupon.store';
import { couponsApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';

interface Suggestion {
  code: string;
  label: string;
  type: string;
  value: number;
  description?: string;
}

interface CouponInputProps {
  orderAmount: number; // subtotal để validate
}

export function CouponInput({ orderAmount }: CouponInputProps) {
  const { isAuthenticated } = useAuthStore();
  const {
    code, applied, discountAmount, shippingFree,
    message, messageType, couponData, isLoading,
    setCode, apply, clear,
  } = useCouponStore();

  const [inputCode, setInputCode] = useState(code);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Fetch suggestions on mount if authenticated
  useEffect(() => {
    if (!isAuthenticated || orderAmount <= 0) return;
    setLoadingSuggestions(true);
    couponsApi.getSuggestions(orderAmount)
      .then((data: any) => setSuggestions(Array.isArray(data) ? data : []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoadingSuggestions(false));
  }, [isAuthenticated, orderAmount]);

  async function handleApply() {
    if (!inputCode.trim()) return;
    await apply(inputCode, orderAmount);
    if (applied || messageType === 'success') {
      setInputCode(inputCode.toUpperCase());
    }
  }

  function handleChipClick(suggestionCode: string) {
    setInputCode(suggestionCode);
    apply(suggestionCode, orderAmount);
  }

  function handleClear() {
    clear();
    setInputCode('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>🎫</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#191c1d' }}>Mã ưu đãi / Khuyến mãi</span>
        </div>
        {suggestions.length > 0 && !loadingSuggestions && (
          <span style={{ fontSize: '11px', color: '#6CC51D', fontWeight: 500, cursor: 'pointer' }}>
            👆 Chọn mã khác ({suggestions.length})
          </span>
        )}
      </div>

      {/* Input row */}
      {applied && couponData ? (
        // Applied state — show green badge + remove
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px', background: '#ebffd7', borderRadius: '8px',
            border: '1px solid #c2f193',
          }}>
            <span style={{ fontSize: '14px' }}>✅</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#356b00' }}>
              {couponData.code}
            </span>
            {discountAmount > 0 && (
              <span style={{ fontSize: '12px', color: '#486f21', fontWeight: 500 }}>
                -{discountAmount.toLocaleString('vi-VN')}₫
              </span>
            )}
            {shippingFree && (
              <span style={{ fontSize: '12px', color: '#486f21', fontWeight: 500 }}>
                Freeship
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: '10px 14px', background: '#f4f5f9', color: '#868889',
              border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            ✕ Bỏ
          </button>
        </div>
      ) : (
        // Input state
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🏷️</span>
            <input
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              placeholder="Nhập mã giảm giá..."
              style={{
                width: '100%', padding: '10px 12px 10px 38px', background: '#f4f5f9',
                border: messageType === 'error' ? '1px solid #ef4444' : '1px solid transparent',
                borderRadius: '8px', fontSize: '13px', color: '#191c1d',
                outline: 'none', boxSizing: 'border-box', fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading || !inputCode.trim()}
            style={{
              padding: '10px 18px', background: isLoading ? '#868889' : '#191c1d',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: 700,
              cursor: isLoading ? 'wait' : 'pointer', flexShrink: 0,
              transition: 'background 0.15s',
            }}
          >
            {isLoading ? '...' : 'Áp dụng'}
          </button>
        </div>
      )}

      {/* Message */}
      {message && (
        <div style={{
          fontSize: '12px', fontWeight: 500,
          color: messageType === 'success' ? '#356b00' : '#dc2626',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span>{messageType === 'success' ? '✅' : '⚠️'}</span>
          {message}
        </div>
      )}

      {/* Suggestion chips */}
      {!applied && suggestions.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {suggestions.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => handleChipClick(s.code)}
              style={{
                padding: '4px 10px', background: '#f4f5f9',
                border: '1px solid #e2e3e5', borderRadius: '20px',
                fontSize: '11px', fontWeight: 600, color: '#191c1d',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = '#ebffd7';
                (e.target as HTMLButtonElement).style.borderColor = '#c2f193';
                (e.target as HTMLButtonElement).style.color = '#356b00';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = '#f4f5f9';
                (e.target as HTMLButtonElement).style.borderColor = '#e2e3e5';
                (e.target as HTMLButtonElement).style.color = '#191c1d';
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
