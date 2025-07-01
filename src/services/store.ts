import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsSlice from './slices/IngredientsSlice';
import burgerConstructorSlice from './slices/burgerConstructorSlice';
import orderSlice from './slices/orderSlice';
import feedSlice from './slices/feedSlice';
import userStateSlice from './slices/userSlice';

export const rootReducer = combineReducers({
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [userStateSlice.name]: userStateSlice.reducer,
  [burgerConstructorSlice.name]: burgerConstructorSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [feedSlice.name]: feedSlice.reducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
