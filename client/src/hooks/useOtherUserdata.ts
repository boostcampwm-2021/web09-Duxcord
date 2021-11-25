import { API_URL } from '@api/API_URL';
import { getFetcher } from '@utils/fetcher';
import useSWR from 'swr';

export const useOtherUserData = (userID?: string) => {
  const { data: otherUserData, ...rest } = useSWR(
    userID ? API_URL.user.getOtherUserdata(userID) : null,
    getFetcher,
  );

  return { otherUserData, ...rest };
};
