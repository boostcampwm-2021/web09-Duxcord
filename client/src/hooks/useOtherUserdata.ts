import useSWR from 'swr';

import { API_URL } from '@utils/constants/API_URL';
import { getFetcher } from '@utils/fetcher';

export const useOtherUserData = (userID?: number) => {
  const { data: otherUserData, ...rest } = useSWR(
    userID ? API_URL.USER.GET_OTHER_USER_DATA(userID) : null,
    getFetcher,
  );

  return { otherUserData, ...rest };
};
