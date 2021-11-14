import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useGroups, useSelectedGroup } from '../../../hooks';
import { setSelectedChannel } from '../../../redux/selectedChannel/slice';
import { setSelectedGroup } from '../../../redux/selectedGroup/slice';
import GroupJoinModal from '../../Modal/GroupJoin';
import { socket } from '../../../util/socket';
import { GroupListWrapper, GroupList, Group, GroupListDivider, AddGroupButton } from './style';
import { ModalController } from '../../../types/modal';
import {
  addUserConnection,
  removeUserConnection,
  setGroupConnection,
} from '../../../redux/groupConnection/slice';
import GroupCreateModal from '../../Modal/GroupCreate';
import GroupAddModal from '../../Modal/GroupAdd';
import { mutate } from 'swr';

function GroupNav() {
  const { groups } = useGroups();
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
    history.push(`/main?group=${group.id}`);
    dispatch(setSelectedChannel({ type: '', id: null, name: '' }));
    dispatch(setSelectedGroup(group));
    socket.emit('GroupID', group.code);
  };

  useEffect(() => {
    socket.on('GroupUserConnection', (connectionList) => {
      dispatch(setGroupConnection(connectionList));
    });

    socket.on('userExit', (user, code) => {
      dispatch(removeUserConnection(user));
    });

    socket.on('userEnter', (user, code) => {
      if (code === selectedGroup?.code) dispatch(addUserConnection(user));
      mutate(`/api/group/${selectedGroup?.id}/members`);
    });

    return () => {
      socket.off('GroupUserConnection');
      socket.off('userExit');
      socket.off('userEnter');
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
          <img src="/icons/addGroup.png" alt="addGroup" />
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
