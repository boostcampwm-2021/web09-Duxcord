import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { API_URL } from '../api/API_URL';
import { STATUS_CODES } from '../api/STATUS_CODES';

export const useAccessControl = ({
  signIn = true,
  redirectPath = '/',
}: {
  signIn: boolean;
  redirectPath: string;
}) => {
  const history = useHistory();

  useEffect(() => {
    fetch(API_URL.user.getUserdata).then(({ status }) => {
      const accessible =
        (signIn && status === STATUS_CODES.OK) || (!signIn && status >= STATUS_CODES.BAD_REQUEST);
      if (!accessible) history.push(redirectPath);
    });
  });
};
