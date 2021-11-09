import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useGroups } from '../../../hooks/useGroups';
import { useSelectedChannel } from '../../../hooks/useSelectedChannel';
import { setSelectedChannel } from '../../../redux/selectedChannel/slice';
import { setSelectedGroup } from '../../../redux/selectedGroup/slice';
import GroupJoinModal from '../../Modal/GroupJoin';
import { GroupListWrapper, GroupList, Group, GroupListDivider, AddGroupButton } from './style';
import { socket } from '../../../util/socket';
import { ModalController } from '../../../types/modal';
import GroupCreateModal from '../../Modal/GroupCreate';
import GroupAddModal from '../../Modal/GroupAdd';

function GroupNav() {
  const { groups } = useGroups();
  const { id, type } = useSelectedChannel();
  const dispatch = useDispatch();
  const history = useHistory();

  const [groupJoinModalHidden, setGroupJoinModalHidden] = useState(true);
  const groupJoinModalControl: ModalController = {
    hidden: groupJoinModalHidden,
    hide: () => setGroupJoinModalHidden(true),
    show: () => setGroupJoinModalHidden(false),
  };

  const [groupCreateModalHidden, setGroupCreateModalHidden] = useState(true);
  const groupCreateModalControl: ModalController = {
    hidden: groupCreateModalHidden,
    hide: () => setGroupCreateModalHidden(true),
    show: () => setGroupCreateModalHidden(false),
  };

  const [groupAddModalHidden, setGroupAddModalHidden] = useState(true);
  const groupAddModalControl: ModalController = {
    hidden: groupAddModalHidden,
    hide: () => setGroupAddModalHidden(true),
    show: () => setGroupAddModalHidden(false),
  };

  const selectGroup = (group: any) => () => {
    history.push(`/main?group=${group.id}`);
    socket.emit('leaveChannel', type + id);
    dispatch(setSelectedChannel({ type: '', id: null, name: '' }));
    dispatch(setSelectedGroup(group));
  };

  const openGroupAddModal = () => {
    setGroupAddModalHidden(false);
  };

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
        <AddGroupButton onClick={openGroupAddModal}>
          <img src="/icons/addGroup.png" alt="addGroup" />
        </AddGroupButton>
      </div>
      <GroupAddModal
        controller={groupAddModalControl}
        showGroupCreate={groupCreateModalControl.show}
        showGroupJoin={groupJoinModalControl.show}
      />
      <GroupJoinModal controller={groupJoinModalControl} />
      <GroupCreateModal controller={groupCreateModalControl} />
    </GroupListWrapper>
  );
}

export default GroupNav;
