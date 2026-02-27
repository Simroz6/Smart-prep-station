import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const getOrders = createAsyncThunk(
  'orders/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/orders?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const getOrder = createAsyncThunk(
  'orders/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`, { reason });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

export const getSellerOrders = createAsyncThunk(
  'orders/getSellerOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/orders/seller?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller orders');
    }
  }
);

export const updateSellerOrderStatus = createAsyncThunk(
  'orders/updateSellerStatus',
  async ({ orderId, status, note }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/seller/status`, { status, note });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const getSellerRevenue = createAsyncThunk(
  'orders/getSellerRevenue',
  async (period = 'month', { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/seller/revenue?period=${period}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue');
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  sellerOrders: {
    orders: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 0 }
  },
  sellerRevenue: { summary: {}, monthlyRevenue: [] },
  pagination: { page: 1, limit: 10, total: 0, pages: 0 },
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Orders
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Single Order
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      // Seller Orders
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.sellerOrders = action.payload;
      })
      // Update Seller Order Status
      .addCase(updateSellerOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSellerOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sellerOrders.orders.findIndex(o => o.orderId === action.payload._id);
        if (index !== -1) {
          const sellerId = state.sellerOrders.orders[index].seller;
          if (sellerId) {
            const sellerOrder = action.payload.sellerOrders.find(
              so => so.seller && so.seller.toString() === sellerId.toString()
            );
            if (sellerOrder) {
              state.sellerOrders.orders[index].status = sellerOrder.status;
              state.sellerOrders.orders[index].statusHistory = sellerOrder.statusHistory;
            }
          }
        }
      })
      .addCase(updateSellerOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Seller Revenue
      .addCase(getSellerRevenue.fulfilled, (state, action) => {
        state.sellerRevenue = action.payload;
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
