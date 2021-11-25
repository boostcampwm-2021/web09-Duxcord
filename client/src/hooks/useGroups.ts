import { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { API_URL } from '@utils/constraints/API_URL';
import { SOCKET } from '@utils/constraints/SOCKET_EVENT';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { getFetcher } from '@utils/fetcher';
import { socket } from '@utils/socket';
import { useSelectedGroup } from './useSelectedGroup';
import { Group } from '@customTypes/group';

const getGroupsFetcher = async (url: string) => {
  try {
    const response = await fetch(url, { credentials: 'include' });
    const responseData = await response.json();

    return responseData?.map((el: any) => el.group);
  } catch (error) {
    console.error(error);
  }
};

export const useGroups = () => {
  const { data: groups, ...rest } = useSWR(API_URL.USER.GET_GROUPS, getGroupsFetcher);
  const { data: userData } = useSWR(API_URL.USER.GET_USERDATA, getFetcher);
  const selectedGroup = useSelectedGroup();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) socket.emit(SOCKET.GROUP_EVENT.LOGIN, groups, userData);
  }, [userData, groups]);

  useLayoutEffect(() => {
    if (selectedGroup === null) return;

    const updatedSelectedGroup =
      groups?.find((group: Group) => group.id === selectedGroup.id) ?? null;

    dispatch(setSelectedGroup(updatedSelectedGroup));
  }, [groups, dispatch]);

  return { groups, ...rest };
};
