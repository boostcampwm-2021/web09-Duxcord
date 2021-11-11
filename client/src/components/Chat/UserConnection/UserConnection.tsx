import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useGroupConnection } from '../../../hooks/useGroupConnection';
import { useSelectedGroup } from '../../../hooks/useSelectedGroup';
import { getFetcher } from '../../../util/fetcher';
import { socket } from '../../../util/socket';
import { UserConnectionWrapper, Text, UserImage, UserTile } from './style';

function UserConnection() {
  const selectedGroup = useSelectedGroup();
  const groupConnection = useGroupConnection();
  const { data = [] } = useSWR(`/api/group/${selectedGroup?.id}/members`, getFetcher);

  useEffect(() => {
    socket.emit('GroupID', selectedGroup?.code);
  }, [selectedGroup?.code]);

  return (
    <UserConnectionWrapper>
      <Text>Online</Text>
      {groupConnection.map((oneUser: any, i: number) => (
        <UserTile key={i}>
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
          <UserTile key={i}>
            <div>
              <UserImage src={'/images/default_profile.png'} alt="user profile" />
              <div className="off-line"></div>
            </div>
            <div>{offLineUser.user.username}</div>
          </UserTile>
        ))}
    </UserConnectionWrapper>
  );
}

export default UserConnection;
