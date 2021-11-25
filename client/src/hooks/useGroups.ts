import { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { API_URL } from '@api/API_URL';
import GroupEvent from '@customTypes/socket/GroupEvent';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { getFetcher } from '@utils/fetcher';
import { socket } from '@utils/socket';
import { useSelectedGroup } from './useSelectedGroup';
import { Group } from '@customTypes/group';
import { PublicConfiguration } from 'swr/dist/types';

const getGroupsFetcher = async (url: string) => {
  try {
    const response = await fetch(url, { credentials: 'include' });
    const responseData = await response.json();

    return responseData?.map((el: any) => el.group);
  } catch (error) {
    console.error(error);
  }
};

export const useGroups = (options?: Partial<PublicConfiguration>) => {
  const { data: groups, ...rest } = useSWR(API_URL.user.getGroups, getGroupsFetcher, options);
  const { data: userData } = useSWR(API_URL.user.getUserdata, getFetcher);
  const selectedGroup = useSelectedGroup();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) socket.emit(GroupEvent.login, groups, userData);
  }, [userData, groups]);

  useLayoutEffect(() => {
    if (selectedGroup === null) return;

    const updatedSelectedGroup =
      groups?.find((group: Group) => group.id === selectedGroup.id) ?? null;

    dispatch(setSelectedGroup(updatedSelectedGroup));
  }, [groups, dispatch]);

  return { groups, ...rest };
};
