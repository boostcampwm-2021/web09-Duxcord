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


function GroupNav() {
  const { groups } = useGroups();
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
    // group.id의 키에 있는 애들 다 알려줘~!
    socket.emit('GroupID', group.code);
  };

  const openGroupJoinModal = () => {
    setModalHidden(false);
  };

  useEffect(() => {
    socket.on('GroupUserConnection', (connectionList) => {
      dispatch(setGroupConnection(connectionList));
    });

    socket.on('userExit', (user, code) => {
      dispatch(removeUserConnection(user));
    });

    socket.on('userEnter', (user, code) => {
      dispatch(addUserConnection(user));
    });

    return () => {
      socket.off('GroupUserConnection');
      socket.off('userExit');
      socket.off('userEnter');
    };
  }, []);

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
