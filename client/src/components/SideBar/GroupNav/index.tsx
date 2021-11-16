import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useGroups, useSelectedGroup } from '@hooks/index';
import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { setSelectedChat } from '@redux/selectedChat/slice';
import GroupJoinModal from '../../Modal/GroupJoin';
import { socket } from '../../../utils/socket';
import { GroupListWrapper, GroupList, Group, GroupListDivider, AddGroupButton } from './style';
import { ModalController } from '@customTypes/modal';
import {
  addUserConnection,
  removeUserConnection,
  setGroupConnection,
} from '@redux/groupConnection/slice';
import GroupCreateModal from '../../Modal/GroupCreate';
import GroupAddModal from '../../Modal/GroupAdd';
import { mutate } from 'swr';
import { API_URL } from '../../../api/API_URL';
import GroupEvent from '@customTypes/socket/GroupEvent';
import { GroupAddIcon } from '../../common/Icons';
import { URL } from 'src/api/URL';

function GroupNav() {
  const { groups, mutate: mutateGroups } = useGroups();
  const selectedGroup = useSelectedGroup();
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

  const selectGroup = (group: any) => () => {
    history.push(URL.groupPage(group.id));
    dispatch(setSelectedChannel({ type: '', id: null, name: '' }));
    dispatch(setSelectedGroup(group));
    socket.emit(GroupEvent.groupID, group.code);
  };

  useEffect(() => {
    socket.on(GroupEvent.groupUserConnection, (connectionList) => {
      dispatch(setGroupConnection(connectionList));
    });

    socket.on(GroupEvent.groupDelete, (code) => {
      mutateGroups(
        groups.filter((group: any) => group.id !== selectedGroup.id),
        false,
      );
      if (code === selectedGroup?.code) {
        dispatch(setSelectedGroup(null));
        dispatch(
          setSelectedChannel({
            type: '',
            id: null,
            name: '',
          }),
        );
        dispatch(setSelectedChat(null));
        history.push(URL.groupPage());
      }
    });

    socket.on(GroupEvent.userExit, (user, code) => {
      dispatch(removeUserConnection(user));
    });

    socket.on(GroupEvent.userEnter, (user, code) => {
      if (code === selectedGroup?.code) dispatch(addUserConnection(user));
      mutate(API_URL.group.getGroupMembers(selectedGroup?.id));
    });

    return () => {
      socket.off(GroupEvent.groupUserConnection);
      socket.off(GroupEvent.groupDelete);
      socket.off(GroupEvent.userEnter);
      socket.off(GroupEvent.userExit);
    };
  }, [dispatch, selectedGroup?.code, selectedGroup?.id]);

  return (
    <GroupListWrapper>
      <GroupList>
        {groups?.map((group: any) => (
          <Group key={group.id} onClick={selectGroup(group)}>
            {group.name}
          </Group>
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
