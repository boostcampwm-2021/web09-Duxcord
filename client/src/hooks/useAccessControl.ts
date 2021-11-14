import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { API_URL } from '../api/API_URL';
import { useUserdata } from './useUserdata';

export const useAccessControl = ({
  signIn = true,
  redirectPath = API_URL.page.loginPage,
}: {
  signIn: boolean;
  redirectPath: string;
}) => {
  const history = useHistory();
  const { userdata, isValidating } = useUserdata();

  useEffect(() => {
    if (isValidating) return;
    const isAccessible = (signIn && userdata) || (!signIn && !userdata);
    if (!isAccessible) history.push(redirectPath);
  }, [isValidating, userdata, history, signIn, redirectPath]);
};
