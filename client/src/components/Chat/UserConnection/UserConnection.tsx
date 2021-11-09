import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useGroupConnection } from '../../../hooks/useGroupConnection';
import { useSelectedGroup } from '../../../hooks/useSelectedGroup';
import { getFetcher } from '../../../util/fetcher';
import { socket } from '../../../util/socket';
import { UserConnectionWrapper, Text } from './style';

function UserConnection() {
  const selectedGroup = useSelectedGroup();
  const groupConnection = useGroupConnection();
  const { data = [] } = useSWR(`/api/group/${selectedGroup?.id}/members`, getFetcher);
  useEffect(() => {
    socket.emit('GroupID', selectedGroup?.code);
  }, []);
  return (
    <UserConnectionWrapper>
      <Text>Online</Text>
      {groupConnection.map((oneUser: any, i: number) => (
        <div key={i}>
          <div>{oneUser.thumbnail}</div>
          <div>{oneUser.loginID}</div>
          <div>{oneUser.username}</div>
        </div>
      ))}
      <Text>Offline</Text>
      {data
        .filter(
          ({ user }: any) => !groupConnection.map((v: any) => v.username).includes(user.username),
        )
        .map((offLineUser: any, i: number) => (
          <div key={i}>
            <div>{offLineUser.user.username}</div>
            <div>{offLineUser.user.thumbnail}</div>
          </div>
        ))}
    </UserConnectionWrapper>
  );
}

export default UserConnection;
