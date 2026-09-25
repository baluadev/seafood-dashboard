import { create } from 'zustand';
import { couponsApi } from '@/lib/api-services';

interface CouponResult {
  id: string;
  code: string;
  type: 'FIXED_AMOUNT' | 'PERCENT' | 'FREE_SHIPPING';
  value: number;
  description?: string;
}

interface CouponState {
  code: string;
  applied: boolean;
  discountAmount: number;
  shippingFree: boolean;
  message: string;
  messageType: 'success' | 'error' | '';
  couponData: CouponResult | null;
  isLoading: boolean;

  setCode: (code: string) => void;
  apply: (code: string, orderAmount: number) => Promise<void>;
  clear: () => void;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  code: '',
  applied: false,
  discountAmount: 0,
  shippingFree: false,
  message: '',
  messageType: '',
  couponData: null,
  isLoading: false,

  setCode: (code) => set({ code }),

  apply: async (code, orderAmount) => {
    if (!code.trim()) return;
    set({ isLoading: true, message: '', messageType: '' });

    try {
      const result = await couponsApi.validate(code.trim(), orderAmount);

      if (result.valid) {
        set({
          applied: true,
          discountAmount: result.discountAmount ?? 0,
          shippingFree: result.shippingFree ?? false,
          couponData: result.coupon,
          code: result.coupon?.code ?? code.toUpperCase(),
          message: result.savings ?? `Áp dụng thành công mã ${code.toUpperCase()}`,
          messageType: 'success',
        });
      } else {
        set({
          applied: false,
          discountAmount: 0,
          shippingFree: false,
          couponData: null,
          message: result.message ?? 'Mã khuyến mãi không hợp lệ',
          messageType: 'error',
        });
      }
    } catch {
      set({
        applied: false,
        discountAmount: 0,
        shippingFree: false,
        couponData: null,
        message: 'Không thể kiểm tra mã. Thử lại sau.',
        messageType: 'error',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clear: () => set({
    code: '',
    applied: false,
    discountAmount: 0,
    shippingFree: false,
    message: '',
    messageType: '',
    couponData: null,
    isLoading: false,
  }),
}));
