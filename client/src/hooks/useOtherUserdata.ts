import { API_URL } from 'src/utils/constraints/API_URL';
import { getFetcher } from 'src/utils/fetcher';
import useSWR from 'swr';

export const useOtherUserData = (userID?: string) => {
  const { data: otherUserData, ...rest } = useSWR(
    userID ? API_URL.USER.GET_OTHER_USER_DATA(userID) : null,
    getFetcher,
  );

  return { otherUserData, ...rest };
};
