import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { getUser, getAuthChecked } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(getUser);
  const isAuthenticated = useSelector(getAuthChecked);
  const location = useLocation();

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  if (!isAuthenticated) {
    return <Preloader />;
  }

  return children;
};
