import api from '@/lib/api';

// Products
export const productsApi = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    api.get('/products', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/products/${id}`).then((r) => r.data),
  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`).then((r) => r.data),
};

// Categories
export const categoriesApi = {
  getAll: () => api.get('/categories').then((r) => r.data),
};

// Sliders
export const slidersApi = {
  getAll: () => api.get('/sliders').then((r) => r.data),
};

// Cart
export const cartApi = {
  get: () => api.get('/cart').then((r) => r.data),
  addItem: (productId: string, quantity: number) =>
    api.post('/cart/items', { productId, quantity }).then((r) => r.data),
  updateItem: (itemId: string, quantity: number) =>
    api.patch(`/cart/items/${itemId}`, { quantity }).then((r) => r.data),
  removeItem: (itemId: string) =>
    api.delete(`/cart/items/${itemId}`).then((r) => r.data),
  clear: () => api.delete('/cart').then((r) => r.data),
};

// Orders
export const ordersApi = {
  getMyOrders: () => api.get('/orders').then((r) => r.data),
  getById: (id: string) => api.get(`/orders/${id}`).then((r) => r.data),
  create: (data: { shippingAddress: object; note?: string }) =>
    api.post('/orders', data).then((r) => r.data),
  repay: (id: string) => api.post(`/orders/${id}/repay`).then((r) => r.data),
};

// Auth
export const authApi = {
  me: () => api.get('/auth/me').then((r) => r.data),
};

// Reviews
export const reviewsApi = {
  getByProduct: (slug: string) =>
    api.get(`/reviews/product/${slug}`).then((r) => r.data),
  create: (productId: string, data: { rating: number; comment?: string }) =>
    api.post(`/reviews/product/${productId}`, data).then((r) => r.data),
  delete: (reviewId: string) =>
    api.delete(`/reviews/${reviewId}`).then((r) => r.data),
};

// Promotions
export interface Promotion {
  id: string;
  tag: string;
  title: string;
  description?: string;
  buttonText: string;
  linkUrl: string;
  imageUrl: string;
  bgColor: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const promotionsApi = {
  getAll: () => api.get('/promotions').then((r) => r.data as Promotion[]),
  getAllAdmin: () => api.get('/promotions/admin').then((r) => r.data as Promotion[]),
  create: (data: Partial<Promotion>) => api.post('/promotions', data).then((r) => r.data),
  update: (id: string, data: Partial<Promotion>) => api.patch(`/promotions/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/promotions/${id}`).then((r) => r.data),
};

// Wishlist
export interface WishlistProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountRate: number;
  thumbnailUrl?: string;
  unit: string;
  isActive: boolean;
  isHot: boolean;
  stockQuantity: number;
  avgRating: number;
  reviewCount: number;
}

export interface WishlistItem {
  id: string;
  createdAt: string;
  product: WishlistProduct;
}

export const wishlistApi = {
  getAll: () => api.get('/wishlist').then((r) => r.data as { items: WishlistItem[]; total: number }),
  check: (productId: string) =>
    api.get(`/wishlist/check/${productId}`).then((r) => r.data as { isWishlisted: boolean }),
  toggle: (productId: string) =>
    api.post(`/wishlist/${productId}/toggle`).then((r) => r.data as { message: string; isWishlisted: boolean }),
  remove: (productId: string) =>
    api.delete(`/wishlist/${productId}`).then((r) => r.data),
};

