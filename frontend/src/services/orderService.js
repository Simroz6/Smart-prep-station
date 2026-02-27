import api from './api';

export const orderService = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, data) => api.put(`/orders/${id}/cancel`, data),
  getSellerOrders: (params) => api.get('/orders/seller', { params }),
  updateSellerStatus: (orderId, data) => api.put(`/orders/${orderId}/seller/status`, data),
  getSellerRevenue: (params) => api.get('/orders/seller/revenue', { params }),
};
