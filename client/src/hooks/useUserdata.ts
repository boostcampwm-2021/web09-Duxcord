import useSWR from 'swr';
import { BareFetcher, PublicConfiguration } from 'swr/dist/types';

import { API_URL } from '@constants/index';
import { getFetcher } from '@api/index';

export const useUserdata = (
  options?: Partial<PublicConfiguration<UserData, any, BareFetcher<UserData>>>,
) => {
  const { data: userdata, ...rest } = useSWR<UserData>(
    API_URL.USER.GET_USERDATA,
    getFetcher,
    options,
  );

  return { userdata, ...rest };
};
