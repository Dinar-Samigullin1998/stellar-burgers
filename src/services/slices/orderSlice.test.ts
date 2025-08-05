import { TOrderState, orderHistory, orderSlice } from './orderSlice';

const initialState: TOrderState = {
  orders: [],
  isloading: false,
  error: null
};

const testOrders = {
  success: true,
  orders: [
    {
      _id: '1',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa093e'
      ],
      status: 'done',
      name: 'Краторный люминесцентный бургер',
      createdAt: '2024-08-01T11:44:25.234Z',
      updatedAt: '2024-08-01T13:44:25.914Z',
      number: 4367
    },
    {
      _id: '2',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa0946',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный минеральный антарианский бургер',
      createdAt: '2024-08-01T12:04:14.552Z',
      updatedAt: '2024-08-01T12:04:14.925Z',
      number: 4368
    }
  ],
  total: 2,
  totalToday: 2
};

describe('Тесты orderSlice', () => {
  it('Тестируем состояние загрузки - pending', () => {
    const actualState = orderSlice.reducer(
      {
        ...initialState,
        error: 'Test err'
      },
      orderHistory.pending('')
    );
    expect(actualState).toEqual({
      orders: [],
      error: null,
      isloading: true
    });
  });

  it('Тестируем состояние загрузки - fulfilled(', () => {
    const actualState = orderSlice.reducer(
      {
        ...initialState,
        isloading: true
      },
      orderHistory.fulfilled(testOrders.orders, '')
    );

    expect(actualState).toEqual({
      orders: testOrders.orders,
      error: null,
      isloading: false
    });
  });

  it('Тестируем состояние загрузки - rejected', () => {
    const testErr = new Error('Test err');
    const actualState = orderSlice.reducer(
      {
        ...initialState,
        isloading: true
      },
      orderHistory.rejected(testErr, '')
    );

    expect(actualState).toEqual({
      orders: [],
      isloading: false,
      error: 'Test err'
    });
  });
});
