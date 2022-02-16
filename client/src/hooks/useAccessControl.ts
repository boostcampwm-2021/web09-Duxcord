import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { API_URL, STATUS_CODES, URL } from '@utils/constants/index';

export const useAccessControl = ({
  signIn = true,
  redirectPath = URL.LOGIN,
}: {
  signIn: boolean;
  redirectPath: string;
}) => {
  const navigate = useNavigate();
  const authCheck = useCallback(() => {
    fetch(API_URL.USER.GET_USERDATA).then((res) => {
      if (res.status === STATUS_CODES.OK) {
        if (signIn === false) navigate(redirectPath, { replace: true });
      } else if (signIn === true) navigate(redirectPath, { replace: true });
    });
  }, [navigate, redirectPath, signIn]);

  useEffect(() => {
    window.addEventListener('focus', authCheck);

    return () => {
      window.removeEventListener('focus', authCheck);
    };
  }, [authCheck]);

  useEffect(authCheck, [authCheck]);
};
