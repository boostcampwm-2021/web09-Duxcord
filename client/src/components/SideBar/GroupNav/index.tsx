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

function GroupNav() {
  const { groups } = useGroups();
  const { id, type } = useSelectedChannel();
  const dispatch = useDispatch();
  const history = useHistory();

  const [modalHidden, setModalHidden] = useState(true);
  const modalController: ModalController = {
    hidden: modalHidden,
    hide: () => setModalHidden(true),
    show: () => setModalHidden(false),
  };

  const selectGroup = (group: any) => () => {
    history.push(`/main?group=${group.id}`);
    socket.emit('leaveChannel', type + id);
    dispatch(setSelectedChannel({ type: '', id: null, name: '' }));
    dispatch(setSelectedGroup(group));
  };

  const openGroupJoinModal = () => {
    setModalHidden(false);
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
        <AddGroupButton onClick={openGroupJoinModal}>
          <img src="/icons/addGroup.png" alt="addGroup" />
        </AddGroupButton>
      </div>
      <GroupJoinModal controller={modalController} />
    </GroupListWrapper>
  );
}

export default GroupNav;
