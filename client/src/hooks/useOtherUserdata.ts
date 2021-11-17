import { API_URL } from 'src/api/API_URL';
import { getFetcher } from 'src/utils/fetcher';
import useSWR from 'swr';

export const useOtherUserData = (userID: number) => {
  const { data: otherUserData, ...rest } = useSWR(
    API_URL.user.getOtherUserdata(userID),
    getFetcher,
  );

  return { otherUserData, ...rest };
};
