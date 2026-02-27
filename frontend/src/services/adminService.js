import api from './api';

// Admin Service
const adminService = {
  getSellerRequests: async () => {
    const response = await api.get('/admin/seller-requests');
    return response.data;
  },

  reviewSellerRequest: async (id, status) => {
    const response = await api.put(`/admin/seller-requests/${id}`, { status });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.put(`/admin/users/${id}/status`);
    return response.data;
  },

  getAllProducts: async (params) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  getAllOrders: async (params) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  getSellerAnalytics: async () => {
    const response = await api.get('/admin/seller-analytics');
    return response.data;
  },
};

export default adminService;