const testUrl = 'http://localhost:4000';
const ingredientConstructor = '[data-cy=ingredient_constructor]';
const closeModal = '[data-cy=modal-close]';
const closeOverlay = '[data-cy=modal-overlay]';
const orderNumber = '[data-cy=order-number]';
const orderButton = '[data-cy=order-button]';
const modal = '[data-cy="modal"]';

describe('Тестируем доступность приложения', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit(testUrl);

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');

    // Ждем, чтобы убедиться что все элементы загрузились
    cy.wait(2000);
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Тестируем добавление булочки', function () {
    cy.get('[data-cy=bun_1_constructor]')
      .contains('Флюоресцентная булка R2-D3')
      .should('not.exist');
    cy.get('[data-cy=bun_2_constructor]')
      .contains('Флюоресцентна булка R2-D3')
      .should('not.exist');
    cy.get('[data-cy="643d69a5c3f7b9001cfa0940"]')
      .find('button')
      .click({ force: true });
    cy.get('[data-cy=bun_1_constructor]')
      .contains('Флюоресцентная булка R2-D3')
      .should('exist');
    cy.get('[data-cy=bun_2_constructor]')
      .contains('Флюоресцентная булка R2-D3')
      .should('exist');
  });

  it('Тестируем добавление основных ингридиентов', function () {
    cy.get(ingredientConstructor)
      .contains('Биокотлета из марсианской Магнолии')
      .should('not.exist');
    cy.get(ingredientConstructor).contains('Соус Spicy-X').should('not.exist');
    cy.get('[data-cy=643d69a5c3f7b9001cfa0941]')
      .find('button')
      .click({ force: true });
    cy.get(ingredientConstructor)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get('[data-cy=643d69a5c3f7b9001cfa093f]')
      .find('button')
      .click({ force: true });
    cy.get(ingredientConstructor).contains('Соус Spicy-X').should('exist');
  });
});

describe('Тестируем работу модальных окон', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(testUrl);
  });

  it('Тестируем открытие модального окна ингредиента', () => {
    cy.get('[data-cy="643d69a5c3f7b9001cfa0940"]').click();
    cy.get(modal).should('be.visible');
    cy.get('[data-cy="ingredient-details"]').should('be.visible');
    cy.get('[data-cy="ingredient-details"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get('[data-cy="ingredient-calories"]').should('contain', '643');
    cy.get('[data-cy="ingredient-proteins"]').should('contain', '44');
    cy.get('[data-cy="ingredient-fat"]').should('contain', '26');
    cy.get('[data-cy="ingredient-carbohydrates"]').should('contain', '85');
  });

  it('Тестируем закрытие модального окна по крестику', () => {
    cy.get('[data-cy="643d69a5c3f7b9001cfa0940"]').click();
    cy.get(modal).should('be.visible');
    cy.get(closeModal).click();
    cy.get(modal).should('not.exist');
  });

  it('Тестируем закрытие модального окна по оверлею', () => {
    cy.get('[data-cy="643d69a5c3f7b9001cfa0940"]').click();
    cy.get(modal).should('be.visible');
    cy.get(closeOverlay).click({ force: true });
    cy.get(modal).should('not.exist');
  });
});

describe('Тестируем создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'userData.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'userOrder.json' });

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.visit(testUrl);
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearCookies();
  });

  it('Сборка и оформление заказа', () => {
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]')
      .find('button')
      .click({ force: true });
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]')
      .find('button')
      .click({ force: true });
    cy.get('[data-cy="643d69a5c3f7b9001cfa093f"]')
      .find('button')
      .click({ force: true });

    cy.get(orderButton).click();
    cy.get(orderNumber).contains('85467').should('exist');

    cy.get(closeModal).click();
    cy.get(orderNumber).should('not.exist');

    cy.get(ingredientConstructor)
      .contains('Краторная булка N-200i')
      .should('not.exist');
    cy.get(ingredientConstructor)
      .contains('Биокотлета из марсианской Магнолии')
      .should('not.exist');
    cy.get(ingredientConstructor).contains('Соус Spicy-X').should('not.exist');
  });
});
