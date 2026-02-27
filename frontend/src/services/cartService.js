import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  getCount: () => api.get('/cart/count'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (productId, data) => api.put(`/cart/items/${productId}`, data),
  removeItem: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart'),
};
