import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '../../utils/burger-api';

export const orderHistory = createAsyncThunk('user/orderHistory', getOrdersApi);

export type TOrderState = {
  orders: TOrder[];
  isloading: boolean;
  error: null | string | undefined;
};

export const initialState: TOrderState = {
  orders: [],
  isloading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(orderHistory.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(orderHistory.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isloading = false;
        state.error = null;
      })
      .addCase(orderHistory.rejected, (state, action) => {
        state.error = action.error.message || 'Error orders history';
        state.isloading = false;
      });
  },
  selectors: {
    getUserOrdersHistory: (state) => state.orders,
    getUserOrdersHistoryError: (state) => state.error,
    getUserOrdersLoading: (state) => state.isloading
  }
});

export const {
  getUserOrdersHistory,
  getUserOrdersHistoryError,
  getUserOrdersLoading
} = orderSlice.selectors;

export default orderSlice;
