import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';
import { API_URL } from '../../../api/API_URL';
import GroupEvent from '@customTypes/socket/GroupEvent';
import { useGroupConnection, useSelectedGroup, useUserdata, useSelectedUser } from '@hooks/index';
import { getFetcher } from '../../../utils/fetcher';
import { socket } from '../../../utils/socket';
import { UserConnectionWrapper, Text, UserImage, UserTile } from './style';
import { setSelectedUser } from '@redux/selectedUser/slice';
import UserInformationModal from '@components/Modal/UserInformation';
import UserEditModal from '@components/Modal/UserEdit';

function UserConnection() {
  const selectedGroup = useSelectedGroup();
  const groupConnection = useGroupConnection();
  const { userdata } = useUserdata();
  const { data = [] } = useSWR(API_URL.group.getGroupMembers(selectedGroup?.id), getFetcher);

  const dispatch = useDispatch();
  const selectedUser = useSelectedUser();

  const [userEditMode, setUserEditMode] = useState(false);
  const userEditModalController = {
    hide: () => setUserEditMode(false),
    show: () => setUserEditMode(true),
  };

  const userInformationModalController = {
    hide: () => dispatch(setSelectedUser({})),
    next: userEditModalController.show,
  };

  const onUserSelected = (user: any, isOnline: boolean) => {
    if (user.loginID === userdata.loginID) {
      dispatch(setSelectedUser({ ...userdata, isOnline, isEditable: true }));
    } else {
      dispatch(setSelectedUser({ ...user, isOnline, isEditable: false }));
    }
  };

  useEffect(() => {
    socket.emit(GroupEvent.groupID, selectedGroup?.code, userdata);
  }, [selectedGroup?.code, userdata]);

  return (
    <UserConnectionWrapper>
      <Text>Online</Text>
      {groupConnection.map((oneUser: any, i: number) => (
        <UserTile key={i} onClick={() => onUserSelected(oneUser, true)}>
          <div>
            <UserImage src={'/images/default_profile.png'} alt="user profile" />
            <div className="on-line"></div>
          </div>
          <div>{oneUser.username}</div>
        </UserTile>
      ))}
      <Text>Offline</Text>
      {data
        .filter(
          ({ user }: any) => !groupConnection.map((v: any) => v.loginID).includes(user.loginID),
        )
        .map((offLineUser: any, i: number) => (
          <UserTile key={i} onClick={() => onUserSelected(offLineUser.user, false)}>
            <div>
              <UserImage src={'/images/default_profile.png'} alt="user profile" />
              <div className="off-line"></div>
            </div>
            <div>{offLineUser.user.username}</div>
          </UserTile>
        ))}
      {(selectedUser.id || selectedUser.loginID) && (
        <UserInformationModal controller={userInformationModalController} />
      )}
      {userEditMode && <UserEditModal controller={userEditModalController} />}
    </UserConnectionWrapper>
  );
}

export default UserConnection;
