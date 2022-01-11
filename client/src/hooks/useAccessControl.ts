import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { API_URL, STATUS_CODES, URL } from '@utils/constants/index';

export const useAccessControl = ({
  signIn = true,
  redirectPath = URL.LOGIN,
}: {
  signIn: boolean;
  redirectPath: string;
}) => {
  const history = useHistory();
  const authCheck = useCallback(() => {
    fetch(API_URL.USER.GET_USERDATA).then((res) => {
      if (res.status === STATUS_CODES.OK) {
        if (signIn === false) history.replace(redirectPath);
      } else if (signIn === true) history.replace(redirectPath);
    });
  }, [history, redirectPath, signIn]);

  useEffect(() => {
    window.addEventListener('focus', authCheck);

    return () => {
      window.removeEventListener('focus', authCheck);
    };
  }, [authCheck]);

  useEffect(authCheck, [authCheck]);
};
