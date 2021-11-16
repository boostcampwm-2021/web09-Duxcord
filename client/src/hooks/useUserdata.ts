import useSWR from 'swr';
import { API_URL } from '../api/API_URL';
import { getFetcher } from '../utils/fetcher';

export const useUserdata = () => {
  const { data: userdata, ...rest } = useSWR(API_URL.user.getUserdata, getFetcher);

  return { userdata, ...rest };
};
