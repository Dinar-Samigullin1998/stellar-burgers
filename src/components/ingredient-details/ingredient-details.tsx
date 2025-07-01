import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getIngredientsSelector } from '../../services/slices/IngredientsSlice';
import { useLocation } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const location = useLocation();
  const ingredients = useSelector(getIngredientsSelector);
  const ingredientToFind = location.pathname.replace('/ingredients/', '');

  const ingredientData: TIngredient = ingredients.find(
    (ingredient) => ingredient._id === ingredientToFind
  )!;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
