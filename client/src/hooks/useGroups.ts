import useSWR from 'swr';
import { API_URL } from '../api/API_URL';

const getGroupsFetcher = async (url: string) => {
  try {
    const response = await fetch(url, { credentials: 'include' });
    const responseData = await response.json();

    return responseData?.groups.map((el: any) => el.group);
  } catch (error) {
    console.error(error);
  }
};

export const useGroups = () => {
  const { data: groups, error, mutate } = useSWR(API_URL.user.getGroups, getGroupsFetcher);

  return { groups, error, mutate };
};
