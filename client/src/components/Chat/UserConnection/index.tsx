import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';

import { setSelectedUser } from '@redux/selectedUser/slice';
import { useGroupConnection, useSelectedGroup, useUserdata } from '@hooks/index';
import { API_URL, SOCKET } from '@constants/index';
import { getFetcher } from '@api/index';
import { socket } from '@utils/index';
import { UserConnectionWrapper, Text, UserImage, UserTile } from './style';

function UserConnection() {
  const selectedGroup = useSelectedGroup();
  const groupConnection = useGroupConnection();
  const { userdata } = useUserdata();
  const { data = [] } = useSWR(API_URL.GROUP.GET_MEMBERS(selectedGroup?.id), getFetcher);

  const dispatch = useDispatch();

  const onUserSelected = (user: UserData, isOnline: boolean) => {
    if (user.loginID === userdata.loginID) {
      dispatch(setSelectedUser({ ...userdata, isOnline, isEditable: true }));
    } else {
      dispatch(setSelectedUser({ ...user, isOnline, isEditable: false }));
    }
  };

  useEffect(() => {
    socket.emit(SOCKET.GROUP_EVENT.GROUP_ID, selectedGroup?.code, userdata);
  }, [selectedGroup?.code, userdata]);

  return (
    <UserConnectionWrapper>
      <Text>Online</Text>
      {groupConnection.map((oneUser: UserData, i: number) => (
        <UserTile key={i} onClick={() => onUserSelected(oneUser, true)}>
          <div>
            <UserImage
              src={oneUser.thumbnail ?? '/images/default_profile.png'}
              alt="user profile"
            />
            <div className="on-line"></div>
          </div>
          <div>{oneUser.username}</div>
        </UserTile>
      ))}
      {data.filter(
        ({ user }: { user: UserData }) =>
          !groupConnection.map((v: UserData) => v.loginID).includes(user.loginID),
      ).length !== 0 && <Text>Offline</Text>}
      {data
        .filter(
          ({ user }: { user: UserData }) =>
            !groupConnection.map((v: UserData) => v.loginID).includes(user.loginID),
        )
        .map((offLineUser: { user: UserData }, i: number) => (
          <UserTile key={i} onClick={() => onUserSelected(offLineUser.user, false)}>
            <div>
              <UserImage
                src={offLineUser.user.thumbnail ?? '/images/default_profile.png'}
                alt="user profile"
              />
              <div className="off-line"></div>
            </div>
            <div>{offLineUser.user.username}</div>
          </UserTile>
        ))}
    </UserConnectionWrapper>
  );
}

export default UserConnection;
