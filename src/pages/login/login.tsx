import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { TLoginData } from '../../utils/burger-api';
import { Navigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { loginUser, getAuthenticated } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(getAuthenticated);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    // Диспатчим действие для логина пользователя
    dispatch(loginUser({ email, password }));
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
