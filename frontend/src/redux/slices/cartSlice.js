import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch cart');
    }
  }
);

export const getCartCount = createAsyncThunk(
  'cart/getCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart/count');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get cart count');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity = 1, selectedVariants = [] }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/items', { productId, quantity, selectedVariants });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to add to cart'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove item');
    }
  }
);

export const buyNow = createAsyncThunk(
  'cart/buyNow',
  async ({ productId, quantity = 1, selectedVariants = [] }, { dispatch, rejectWithValue }) => {
    try {
      // 1. Clear existing cart
      await api.delete('/cart');
      
      // 2. Add the new item
      const response = await api.post('/cart/items', { productId, quantity, selectedVariants });
      
      // 3. Update cart count
      dispatch(getCartCount());
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to process Buy Now'
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clear cart');
    }
  }
);

const initialState = {
  cart: { items: [], subtotal: 0 },
  cartCount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Cart Count
      .addCase(getCartCount.fulfilled, (state, action) => {
        state.cartCount = action.payload.count;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.cartCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Buy Now
      .addCase(buyNow.pending, (state) => {
        state.loading = true;
      })
      .addCase(buyNow.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.cartCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      })
      .addCase(buyNow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.cartCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.cartCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = { items: [], subtotal: 0 };
        state.cartCount = 0;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
