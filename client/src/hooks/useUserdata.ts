import useSWR from 'swr';
import { PublicConfiguration } from 'swr/dist/types';

import { API_URL } from '@constants/index';
import { getFetcher } from '@api/index';

export const useUserdata = (options?: Partial<PublicConfiguration>) => {
  const { data: userdata, ...rest } = useSWR(API_URL.USER.GET_USERDATA, getFetcher, options);

  return { userdata, ...rest };
};
