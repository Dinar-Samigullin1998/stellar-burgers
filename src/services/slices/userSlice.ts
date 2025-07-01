import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  TRegisterData,
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';

export type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  userLoginError: null | string;
  userLoginRequest: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  userLoginError: null,
  userLoginRequest: false
};

export const userApi = createAsyncThunk('user/userApi', getUserApi);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, password, name }: TRegisterData) => {
    const data = await registerUserApi({ email, password, name });

    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const data = await loginUserApi({ email, password });

    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data.user;
  }
);

export const updateUser = createAsyncThunk('user/update', updateUserApi);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.clear();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userApi.pending, (state) => {
        state.user = null;
        state.userLoginRequest = true;
        state.isAuthenticated = false;
        state.userLoginError = null;
      })
      .addCase(userApi.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userLoginRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(userApi.rejected, (state, action) => {
        state.user = null;
        state.userLoginRequest = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.userLoginError =
          action.error.message || 'Не удалось получить данные пользователя';
      })
      .addCase(registerUser.pending, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.userLoginRequest = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.userLoginRequest = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.userLoginError =
          action.error.message || 'Пользователь не зарегестрирован';
        state.userLoginRequest = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.userLoginError = null;
        state.userLoginRequest = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.userLoginRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userLoginRequest = false;
        state.userLoginError =
          action.error.message ||
          'Не удалось выполнить запрос на вход пользователя';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isAuthenticated = true;
        state.userLoginRequest = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.userLoginRequest = false;
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.userLoginRequest = false;
        state.userLoginError =
          action.error.message ||
          'Не удалось выполнить запрос на выход пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.isAuthenticated = true;
        state.userLoginRequest = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.userLoginRequest = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userLoginError =
          action.error.message ||
          'Не удалось выполнить запрос на обновление пользователя';
        state.userLoginRequest = false;
      });
  },
  selectors: {
    getUser: (state) => state.user,
    getUserLoginRequest: (state) => state.userLoginRequest,
    getAuthenticated: (state) => state.isAuthenticated,
    getAuthChecked: (state) => state.isAuthChecked,
    getUserLoginError: (state) => state.userLoginError
  }
});

export const checkUserAuthenticated = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(userApi()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const { authChecked } = userSlice.actions;

export const {
  getUser,
  getUserLoginRequest,
  getAuthenticated,
  getUserLoginError,
  getAuthChecked
} = userSlice.selectors;

export default userSlice;
