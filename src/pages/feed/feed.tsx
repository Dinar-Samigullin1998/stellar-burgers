import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedOrders,
  getIsLoadingStatus,
  getFeeds
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getFeedOrders);
  const loading = useSelector(getIsLoadingStatus);

  useEffect(() => {
    dispatch(getFeeds()).then((result) => {});
  }, [dispatch]);

  if (!orders.length || loading) {
    return <Preloader />;
  }

  <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
