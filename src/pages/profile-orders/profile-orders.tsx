import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  orderHistory,
  getUserOrdersLoading,
  getUserOrdersHistory
} from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getUserOrdersHistory);
  const dispatch = useDispatch();
  const isLoad = useSelector(getUserOrdersLoading);

  useEffect(() => {
    dispatch(orderHistory());
  }, [dispatch]);

  if (isLoad) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
