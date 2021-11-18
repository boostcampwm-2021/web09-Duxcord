import { postFetchOptions } from '../utils/fetchOptions';
import { API_URL } from './API_URL';

export const postLogout = async () => {
  const response = await fetch(API_URL.user.logout, postFetchOptions({}));
  return response.ok;
};
