import { API_URL } from '@utils/constants/API_URL';
import { postFetchOptions } from '@utils/fetchOptions';

export const postSignUp = async (loginID: string, username: string, password: string) => {
  const response = await fetch(
    API_URL.USER.POST_SIGN_UP,
    postFetchOptions({ loginID, username, password }),
  );
  const responseText = await response.text();

  return { status: response.status, responseText };
};
