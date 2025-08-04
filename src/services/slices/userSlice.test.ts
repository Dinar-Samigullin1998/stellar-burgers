import {
  TUserState,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  userSlice,
  authChecked
} from './userSlice';

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  userLoginError: null,
  userLoginRequest: false
};

const testUser = {
  success: true,
  user: {
    email: 'test@test.com',
    name: 'Dinar'
  },
  accessToken: 'test',
  refreshToken: 'Dinar'
};

const testLogIn = {
  email: 'test@test.com',
  password: 'password'
};

const testRegisterUser = {
  email: 'test@test.com',
  name: 'Dinar',
  password: 'password'
};

const updatedUser = {
  success: true,
  user: {
    email: 'test@test.com',
    name: 'Dinar'
  }
};

describe('Тесты редюсеров userSlice', () => {
  it('Обрабатка authChecked', () => {
    const previousState = {
      ...initialState,
      isAuthChecked: false
    };

    const actualState = userSlice.reducer(previousState, authChecked());

    const expectedState = {
      ...previousState,
      isAuthChecked: true
    };

    expect(actualState).toEqual(expectedState);
  });
});

describe('Тесты экстраредюсеров userSlice', () => {
  it('Тест для registerUser в состоянии pending', () => {
    const actualState = userSlice.reducer(
      initialState,
      registerUser.pending('', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: false,
      user: null,
      userLoginRequest: true
    });
  });

  it('Тест для registerUser в состоянии fulfilled', () => {
    const actualState = userSlice.reducer(
      initialState,
      registerUser.fulfilled(testUser.user, '', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: true,
      user: testUser.user,
      userLoginRequest: false
    });
  });

  it('Тест для registerUser в состоянии rejected', () => {
    const error = new Error('registerUser Error');
    const actualState = userSlice.reducer(
      initialState,
      registerUser.rejected(error, '', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: false,
      userLoginError: 'registerUser Error',
      userLoginRequest: false
    });
  });

  it('Тест для loginUser в состоянии pending', () => {
    const actualState = userSlice.reducer(
      initialState,
      loginUser.pending('', testLogIn)
    );

    expect(actualState).toEqual({
      ...initialState,
      userLoginError: null,
      userLoginRequest: true
    });
  });

  it('Тест для loginUser в состоянии fulfilled', () => {
    const actualState = userSlice.reducer(
      initialState,
      loginUser.fulfilled(testUser.user, '', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      user: testUser.user,
      isAuthenticated: true,
      isAuthChecked: true,
      userLoginRequest: false
    });
  });

  it('Тест для loginUser в состоянии rejected', () => {
    const error = new Error('loginUser Error');
    const actualState = userSlice.reducer(
      initialState,
      loginUser.rejected(error, '', testLogIn)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthChecked: true,
      userLoginRequest: false,
      isAuthenticated: false,
      userLoginError: 'loginUser Error'
    });
  });

  it('Тест для logoutUser в состоянии pending', () => {
    const previousState = {
      ...initialState,
      isAuthenticated: true,
      user: testUser.user
    };

    const actualState = userSlice.reducer(
      previousState,
      logoutUser.pending('')
    );

    expect(actualState).toEqual({
      ...previousState,
      userLoginRequest: true
    });
  });

  it('Тест для logoutUser в состоянии fulfilled', () => {
    const actualState = userSlice.reducer(
      initialState,
      logoutUser.fulfilled(undefined, '')
    );

    expect(actualState).toEqual({
      isAuthenticated: false,
      user: null,
      userLoginRequest: false,
      isAuthChecked: false,
      userLoginError: null
    });
  });

  it('Тест для logoutUser в состоянии rejected', () => {
    const error = new Error('logoutUser Error');
    const previousState = {
      ...initialState,
      isAuthenticated: false,
      user: testUser.user
    };

    const actualState = userSlice.reducer(
      previousState,
      logoutUser.rejected(error, '')
    );

    expect(actualState).toEqual({
      ...previousState,
      isAuthenticated: false,
      userLoginError: 'logoutUser Error',
      userLoginRequest: false
    });
  });

  it('Тест для updateUser в состоянии pending', () => {
    const actualState = userSlice.reducer(
      initialState,
      updateUser.pending('', updatedUser.user)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: true,
      userLoginRequest: true
    });
  });

  it('Тест для updateUser в состоянии fulfilled', () => {
    const actualState = userSlice.reducer(
      initialState,
      updateUser.fulfilled(updatedUser, '', testUser.user)
    );
    expect(actualState).toEqual({
      isAuthenticated: true,
      user: updatedUser.user,
      userLoginRequest: false,
      isAuthChecked: false,
      userLoginError: null
    });
  });

  it('Тест для updateUser в состоянии rejected', () => {
    const error = new Error('updateUser Error');
    const actualState = userSlice.reducer(
      initialState,
      updateUser.rejected(error, '', testUser.user)
    );

    expect(actualState).toEqual({
      ...initialState,
      userLoginError: error.message,
      userLoginRequest: false
    });
  });
});
