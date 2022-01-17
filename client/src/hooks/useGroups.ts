import { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { BareFetcher, PublicConfiguration } from 'swr/dist/types';

import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { API_URL, SOCKET } from '@constants/index';
import { getFetcher } from '@api/index';
import { socket } from '@utils/index';
import { useSelectedGroup } from './useSelectedGroup';

export const getGroupsFetcher = async (url: string) => {
  try {
    const response = await fetch(url, { credentials: 'include' });
    const responseData = await response.json();

    return responseData?.map((el: { group: GroupData }) => el.group);
  } catch (error) {
    console.error(error);
  }
};

export const useGroups = (
  options?: Partial<PublicConfiguration<GroupData[], any, BareFetcher<GroupData[]>>>,
) => {
  const { data: groups, ...rest } = useSWR<GroupData[], string>(
    API_URL.USER.GET_GROUPS,
    getGroupsFetcher,
    options,
  );
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
