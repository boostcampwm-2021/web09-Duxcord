import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite';
import { API_URL } from '@constants/index';
import { getFetcher } from '@api/index';

export const useChats = (id: number | null, options?: SWRInfiniteConfiguration) => {
  const { data: chats, ...rest } = useSWRInfinite(
    API_URL.CHANNEL.GET_BY_PAGE(id ?? 0),
    getFetcher,
    options,
  );

  return { chats, ...rest };
};
