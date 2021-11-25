<<<<<<< HEAD
import { postFetchOptions } from '../utils/fetchOptions';
import { API_URL } from '../utils/constraints/API_URL';
=======
import { postFetchOptions } from '@utils/fetchOptions';
import { API_URL } from './API_URL';
>>>>>>> dev

export const postLogout = async () => {
  const response = await fetch(API_URL.USER.POST_SIGN_OUT, postFetchOptions({}));
  return response.ok;
};
