import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useUserdata } from './useUserdata';

export const useAccessControl = ({
  signIn = true,
  redirectPath = '/',
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
