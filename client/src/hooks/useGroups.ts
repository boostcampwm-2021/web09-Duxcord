import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { API_URL } from '../api/API_URL';
import { setSelectedGroup } from '../redux/selectedGroup/slice';
import { useSelectedGroup } from './useSelectedGroup';

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
  const selectedGroup = useSelectedGroup();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (selectedGroup === null) return;

    const updatedSelectedGroup =
      groups?.find((group: any) => group.id === selectedGroup.id) ?? null;

    dispatch(setSelectedGroup(updatedSelectedGroup));
  }, [groups, dispatch]);

  return { groups, error, mutate };
};
