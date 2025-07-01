import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

type TIngredientsState = {
  ingredients: TIngredient[];
  request: boolean;
  error: string | null;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  request: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message || null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.request = false;
        state.ingredients = action.payload;
      });
  },
  selectors: {
    getIngredientsSelector: (state) => state.ingredients,
    getRequestStatus: (state) => state.request
  }
});

export const { getIngredientsSelector, getRequestStatus } =
  ingredientsSlice.selectors;

export default ingredientsSlice;
