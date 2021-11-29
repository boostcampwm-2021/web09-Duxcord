import useSWRInfinite from 'swr/infinite';

import { API_URL } from '@utils/constants/API_URL';
import { getFetcher } from '@utils/fetcher';

export const useChats = (id: number | null) => {
  const { data: chats, ...rest } = useSWRInfinite(API_URL.CHANNEL.GET_BY_PAGE(id), getFetcher, {
    suspense: true,
  });
  return { chats, ...rest };
};
