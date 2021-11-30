import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { mutate } from 'swr';

import { resetSelectedChannel } from '@redux/selectedChannel/slice';
import { resetSelectedGroup, setSelectedGroup } from '@redux/selectedGroup/slice';
import { resetSelectedChat } from '@redux/selectedChat/slice';
import {
  addUserConnection,
  removeUserConnection,
  setGroupConnection,
} from '@redux/groupConnection/slice';
import { useGroups, useSelectedGroup, useSelectedChannel } from '@hooks/index';
import { API_URL, URL, SOCKET } from '@constants/index';
import { socket } from '@utils/index';
import GroupCreateModal from '@components/Modal/GroupCreate';
import GroupAddModal from '@components/Modal/GroupAdd';
import GroupJoinModal from '@components/Modal/GroupJoin';
import { GroupAddIcon } from '@components/common/Icons';
import {
  GroupListWrapper,
  GroupList,
  GroupWrapper,
  GroupItem,
  GroupListDivider,
  AddGroupButton,
} from './style';

function GroupNav() {
  const { groups, mutate: mutateGroups } = useGroups();
  const selectedGroup = useSelectedGroup();
  const selectedChannel = useSelectedChannel();
  const dispatch = useDispatch();
  const history = useHistory();

  const [selectedModal, setSelectedModal] = useState('');
  const groupJoinModalControl: ModalController = {
    hide: () => setSelectedModal(''),
    show: () => setSelectedModal('JOIN'),
    previous: () => setSelectedModal('ADD'),
  };
  const groupCreateModalControl: ModalController = {
    hide: () => setSelectedModal(''),
    show: () => setSelectedModal('CREATE'),
    previous: () => setSelectedModal('ADD'),
  };
  const groupAddModalControl: ModalController = {
    hide: () => setSelectedModal(''),
    show: () => setSelectedModal('ADD'),
  };

  const selectGroup = (group: GroupData) => () => {
    history.replace(URL.GROUP(group.id));
    dispatch(resetSelectedChannel());
    dispatch(setSelectedGroup(group));
    socket.emit(SOCKET.GROUP_EVENT.GROUP_ID, group.code);
  };

  useEffect(() => {
    socket.on(SOCKET.GROUP_EVENT.USER_CONNECTION, (connectionList) => {
      dispatch(setGroupConnection(connectionList));
    });

    socket.on(SOCKET.GROUP_EVENT.DELETE_GROUP, (code) => {
      mutateGroups(
        groups.filter((group: GroupData) => group.id !== selectedGroup.id),
        false,
      );
      if (code === selectedGroup?.code) {
        dispatch(resetSelectedGroup());
        dispatch(resetSelectedChannel());
        dispatch(resetSelectedChat());
        history.replace(URL.GROUP());
      }
    });

    socket.on(SOCKET.GROUP_EVENT.USER_EXIT, (user, code) => {
      dispatch(removeUserConnection(user));
    });

    socket.on(SOCKET.GROUP_EVENT.USER_ENTER, (user, code) => {
      if (code === selectedGroup?.code) dispatch(addUserConnection(user));
      mutate(API_URL.GROUP.GET_MEMBERS(selectedGroup?.id));
    });

    socket.on(SOCKET.GROUP_EVENT.DELETE_CHANNEL, ({ code, id, type }) => {
      mutateGroups(
        groups.map((group: GroupData) => {
          if (group.id !== selectedGroup.id) return group;
          else {
            const tempGroup = group;
            if (type === 'chatting')
              tempGroup.chattingChannels.filter((channel: ChannelData) => channel.id !== id);
            else tempGroup.meetingChannels.filter((channel: ChannelData) => channel.id !== id);
            return tempGroup;
          }
        }),
        false,
      );
      if (code === selectedGroup?.code)
        if (id === selectedChannel.id && type === selectedChannel.type) {
          dispatch(resetSelectedChannel());
          dispatch(resetSelectedChat());
          history.replace(URL.GROUP(selectedGroup.id));
        }
    });

    return () => {
      socket.off(SOCKET.GROUP_EVENT.USER_CONNECTION);
      socket.off(SOCKET.GROUP_EVENT.DELETE_CHANNEL);
      socket.off(SOCKET.GROUP_EVENT.DELETE_GROUP);
      socket.off(SOCKET.GROUP_EVENT.USER_ENTER);
      socket.off(SOCKET.GROUP_EVENT.USER_EXIT);
    };
  }, [dispatch, selectedGroup?.code, selectedGroup?.id]);

  return (
    <GroupListWrapper>
      <GroupList>
        {groups?.map((group: GroupData) => (
          <GroupWrapper name={group.name} key={group.id}>
            <GroupItem
              onClick={selectGroup(group)}
              thumbnail={group.thumbnail}
              isSelected={group.id === selectedGroup?.id}
            >
              <p>{!group.thumbnail && group.name}</p>
            </GroupItem>
          </GroupWrapper>
        ))}
      </GroupList>
      <GroupListDivider />
      <div>
        <AddGroupButton onClick={groupAddModalControl.show}>
          <GroupAddIcon />
        </AddGroupButton>
      </div>
      {selectedModal === 'ADD' ? (
        <GroupAddModal
          controller={groupAddModalControl}
          showGroupCreate={groupCreateModalControl.show}
          showGroupJoin={groupJoinModalControl.show}
        />
      ) : selectedModal === 'JOIN' ? (
        <GroupJoinModal controller={groupJoinModalControl} />
      ) : selectedModal === 'CREATE' ? (
        <GroupCreateModal controller={groupCreateModalControl} />
      ) : null}
    </GroupListWrapper>
  );
}

export default GroupNav;
