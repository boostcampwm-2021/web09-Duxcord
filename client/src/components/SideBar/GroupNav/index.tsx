import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useGroups } from '../../../hooks/useGroups';
import { setSelectedChannel } from '../../../redux/selectedChannel/slice';
import { setSelectedGroup } from '../../../redux/selectedGroup/slice';
import GroupJoinModal from '../../Modal/GroupJoin';
import {
  GroupListWrapper,
  GroupList,
  Group,
  GroupListDivider,
  AddGroupButton,
} from './style';

function GroupNav() {
  const { groups } = useGroups();
  const dispatch = useDispatch();
  const history = useHistory();

  const [modalHidden, setModalHidden] = useState(true);

  const selectGroup = (group: any) => () => {
    history.push(`/Main/group/${group.id}`);
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
          <img src='/icons/addGroup.png' alt='addGroup' />
        </AddGroupButton>
      </div>
      <GroupJoinModal
        controller={{ hidden: modalHidden, setHidden: setModalHidden }}
      />
    </GroupListWrapper>
  );
}

export default GroupNav;
