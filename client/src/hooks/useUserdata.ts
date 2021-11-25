import useSWR from 'swr';
import { API_URL } from '@utils/constraints/API_URL';
import { getFetcher } from '@utils/fetcher';

export const useUserdata = () => {
  const { data: userdata, ...rest } = useSWR(API_URL.USER.GET_USERDATA, getFetcher);

  return { userdata, ...rest };
};
