import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  nanoid
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: Array<TConstructorIngredient>;
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isloading: boolean;
  error: null | string | undefined;
};

export const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  isloading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

export const burgerConstructorSlice = createSlice({
  name: 'burgerconstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const key = nanoid();
        return { payload: { ...ingredient, id: key } };
      }
    },
    removeIngredients: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const ingredients = state.constructorItems.ingredients;
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.constructorItems.ingredients.length - 1) {
        const ingredients = state.constructorItems.ingredients;
        [ingredients[index + 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index + 1]
        ];
      }
    },
    clearOrders: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = null;
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
        state.error = null;
      });
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems,
    getOrderData: (state) => state.orderModalData,
    getOrderRequest: (state) => state.orderRequest,
    getIsLoading: (state) => state.isloading,
    getError: (state) => state.error
  }
});

export const {
  getConstructorItems,
  getOrderData,
  getOrderRequest,
  getIsLoading,
  getError
} = burgerConstructorSlice.selectors;

export const {
  addIngredient,
  removeIngredients,
  moveIngredientUp,
  moveIngredientDown,
  clearOrders
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice;
