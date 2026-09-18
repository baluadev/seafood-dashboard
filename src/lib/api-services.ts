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
