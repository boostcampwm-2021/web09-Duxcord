import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useGroups } from '../../../hooks/useGroups';
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
import { useSelectedGroup } from '../../../hooks/useSelectedGroup';
import { mutate } from 'swr';
import { API_URL } from '../../../api/API_URL';
import GroupEvent from '../../../types/socket/GroupEvent';

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
    history.push(API_URL.page.groupPage(group.id));
    dispatch(setSelectedChannel({ type: '', id: null, name: '' }));
    dispatch(setSelectedGroup(group));
    socket.emit(GroupEvent.groupID, group.code);
  };

  useEffect(() => {
    socket.on(GroupEvent.groupUserConnection, (connectionList) => {
      dispatch(setGroupConnection(connectionList));
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
