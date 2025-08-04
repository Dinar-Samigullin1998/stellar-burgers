import { getFeeds, getOrderByNumber, TFeedState, feedSlice } from './feedSlice';

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  isloading: false,
  orderModal: null
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

describe('Тест экшенов feedSlice', () => {
  it('Загрузку ленты заказов - состояние pending', () => {
    const actualState = feedSlice.reducer(
      {
        ...initialState,
        error: 'Err'
      },
      getFeeds.pending('')
    );
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
      isloading: true,
      orderModal: null
    });
  });

  it('Загрузку ленты заказов - состояние fulfilled', () => {
    const actualState = feedSlice.reducer(
      {
        ...initialState,
        isloading: true
      },
      getFeeds.fulfilled(testOrders, '')
    );

    expect(actualState).toEqual({
      orders: testOrders.orders,
      total: testOrders.total,
      totalToday: testOrders.totalToday,
      error: null,
      isloading: false,
      orderModal: null
    });
  });

  it('Загрузку ленты заказов - состояние rejected', () => {
    const testErr = new Error('Err');
    const actualState = feedSlice.reducer(
      {
        ...initialState,
        isloading: true
      },
      getFeeds.rejected(testErr, '')
    );

    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      orderModal: null,
      isloading: false,
      error: 'Err'
    });
  });

  it('Получение заказа - состояние pending', () => {
    const actualState = feedSlice.reducer(
      {
        ...initialState,
        error: 'Err'
      },
      getOrderByNumber.pending('1', 1)
    );
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
      isloading: true,
      orderModal: null
    });
  });

  it('Получение заказа - состояние fulfilled', () => {
    const actualState = feedSlice.reducer(
      {
        ...initialState,
        isloading: true
      },
      getOrderByNumber.fulfilled(testOrders, '1', 1)
    );

    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
      isloading: false,
      orderModal: testOrders.orders[0]
    });
  });

  it('Получение заказа - состояние rejected', () => {
    const testErr = new Error('Err');
    const actualState = feedSlice.reducer(
      {
        ...initialState,
        isloading: true
      },
      getOrderByNumber.rejected(testErr, '1', 1)
    );
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      orderModal: null,
      isloading: false,
      error: 'Err'
    });
  });
});
