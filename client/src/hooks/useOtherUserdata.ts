import useSWR from 'swr';

import { API_URL } from '@constants/index';
import { getFetcher } from '@api/index';

export const useOtherUserData = (userID: number | null) => {
  const { data: otherUserData, ...rest } = useSWR(
    userID ? API_URL.USER.GET_OTHER_USER_DATA(userID) : null,
    getFetcher,
  );

  return { otherUserData, ...rest };
};
