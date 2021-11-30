import useSWR from 'swr';
import { PublicConfiguration } from 'swr/dist/types';

import { API_URL } from '@utils/constants/API_URL';
import { getFetcher } from '@api/fetcher';

export const useUserdata = (options?: Partial<PublicConfiguration>) => {
  const { data: userdata, ...rest } = useSWR(API_URL.USER.GET_USERDATA, getFetcher, options);

  return { userdata, ...rest };
};
