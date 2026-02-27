import api from './api';

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getSellerProducts: (params) => api.get('/products/seller/my-products', { params }),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  getCategories: () => api.get('/products/categories'),
  getFeatured: () => api.get('/products/featured'),
};
