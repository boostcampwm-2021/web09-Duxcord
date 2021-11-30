import { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { API_URL } from '@utils/constants/API_URL';
import { SOCKET } from '@utils/constants/SOCKET_EVENT';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { getFetcher } from '@api/fetcher';
import { socket } from '@utils/socket';
import { useSelectedGroup } from './useSelectedGroup';
import { PublicConfiguration } from 'swr/dist/types';

export const getGroupsFetcher = async (url: string) => {
  try {
    const response = await fetch(url, { credentials: 'include' });
    const responseData = await response.json();

    return responseData?.map((el: { group: GroupData }) => el.group);
  } catch (error) {
    console.error(error);
  }
};

export const useGroups = (options?: Partial<PublicConfiguration>) => {
  const { data: groups, ...rest } = useSWR(API_URL.USER.GET_GROUPS, getGroupsFetcher, options);
  const { data: userData } = useSWR(API_URL.USER.GET_USERDATA, getFetcher);
  const selectedGroup = useSelectedGroup();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) socket.emit(SOCKET.GROUP_EVENT.LOGIN, groups, userData);
  }, [userData, groups]);

  useLayoutEffect(() => {
    if (selectedGroup === null) return;

    const updatedSelectedGroup =
      groups?.find((group: GroupData) => group.id === selectedGroup.id) ?? null;

    dispatch(setSelectedGroup(updatedSelectedGroup));
  }, [groups, dispatch]);

  return { groups, ...rest };
};
