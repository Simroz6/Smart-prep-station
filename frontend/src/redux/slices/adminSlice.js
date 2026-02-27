import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getSellerRequests = createAsyncThunk(
  'admin/getSellerRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/seller-requests');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch seller requests');
    }
  }
);

export const reviewSellerRequest = createAsyncThunk(
  'admin/reviewSellerRequest',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/seller-requests/${id}`, { status });
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to review seller request');
    }
  }
);

const initialState = {
  sellerRequests: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Seller Requests
      .addCase(getSellerRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSellerRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerRequests = action.payload;
      })
      .addCase(getSellerRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Review Seller Request
      .addCase(reviewSellerRequest.fulfilled, (state, action) => {
        state.sellerRequests = state.sellerRequests.filter(
          (request) => request._id !== action.payload.id
        );
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
