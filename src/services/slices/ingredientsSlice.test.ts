import ingredientsSlice, {
  getIngredients,
  TIngredientsState
} from './IngredientsSlice';

const initialState: TIngredientsState = {
  ingredients: [],
  request: false,
  error: null
};

const testIngredient = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

describe('Тест экшенов ingredientsSlice', () => {
  it('Тестируем состояние загрузки - pending', () => {
    const actualState = ingredientsSlice.reducer(
      {
        ...initialState,
        error: 'Test err'
      },
      getIngredients.pending('')
    );

    expect(actualState).toEqual({
      ingredients: [],
      request: true,
      error: null
    });
  });

  it('Тестируем состояние загрузки - fulfilled', () => {
    const actualState = ingredientsSlice.reducer(
      {
        ...initialState,
        request: true
      },
      getIngredients.fulfilled(testIngredient, '')
    );

    expect(actualState).toEqual({
      ingredients: testIngredient,
      request: false,
      error: null
    });
  });

  it('Тестируем состояние загрузки - rejected', () => {
    const testErr = new Error('Test err');

    const actualState = ingredientsSlice.reducer(
      {
        ...initialState,
        request: true
      },
      getIngredients.rejected(testErr, '')
    );
    expect(actualState).toEqual({
      ingredients: [],
      request: false,
      error: 'Test err'
    });
  });
});
