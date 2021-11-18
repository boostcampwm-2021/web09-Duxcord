import { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { API_URL } from '../api/API_URL';
import GroupEvent from '@customTypes/socket/GroupEvent';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { getFetcher } from '../utils/fetcher';
import { socket } from '../utils/socket';
import { useSelectedGroup } from './useSelectedGroup';

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
  const { data: groups, ...rest } = useSWR(API_URL.user.getGroups, getGroupsFetcher);
  const { data: userData } = useSWR(API_URL.user.getUserdata, getFetcher);
  const selectedGroup = useSelectedGroup();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) socket.emit(GroupEvent.login, groups, userData);
  }, [userData, groups]);

  useLayoutEffect(() => {
    if (selectedGroup === null) return;

    const updatedSelectedGroup =
      groups?.find((group: any) => group.id === selectedGroup.id) ?? null;

    dispatch(setSelectedGroup(updatedSelectedGroup));
  }, [groups, dispatch]);

  return { groups, ...rest };
};
