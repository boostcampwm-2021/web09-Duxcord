import { postFetchOptions } from '@api/fetchOptions';
import { API_URL } from '@utils/constants/API_URL';

export const postLogout = async () => {
  const response = await fetch(API_URL.USER.POST_SIGN_OUT, postFetchOptions({}));
  return response.ok;
};
