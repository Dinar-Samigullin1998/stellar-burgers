import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export const getFeeds = createAsyncThunk('feed/data', getFeedsApi);

export const getOrderByNumber = createAsyncThunk(
  'feed/getByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response;
    } catch (error) {
      return rejectWithValue('Error feed data');
    }
  }
);

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isloading: boolean;
  error: string | null;
  orderModal: TOrder | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isloading: false,
  error: null,
  orderModal: null
};

export const feedSlice = createSlice({
  name: 'feeddata',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isloading = false;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.error.message || null;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isloading = false;
        state.orderModal = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.error.message || null;
      });
  },
  selectors: {
    getFeedOrders: (state) => state.orders,
    getTotalOrdersAmount: (state) => state.total,
    getTotalOrdersToday: (state) => state.totalToday,
    getIsLoadingStatus: (state) => state.isloading,
    getError: (state) => state.error,
    getModalOrder: (state) => state.orderModal
  }
});

export const selectOrderByNumber = (
  state: { feeddata: TFeedState },
  number: number
): TOrder | null => {
  const orderFromFeed = state.feeddata.orders.find(
    (order: TOrder) => order.number === number
  );

  const orderFromModal =
    state.feeddata.orderModal && state.feeddata.orderModal.number === number
      ? state.feeddata.orderModal
      : null;

  return orderFromFeed || orderFromModal || null;
};

export const {
  getFeedOrders,
  getTotalOrdersAmount,
  getTotalOrdersToday,
  getIsLoadingStatus,
  getError
} = feedSlice.selectors;

export default feedSlice;
