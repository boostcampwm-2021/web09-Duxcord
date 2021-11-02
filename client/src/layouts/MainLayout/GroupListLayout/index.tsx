import React from 'react';
import { GroupListWrapper, GroupList, Group, GroupListDivider, AddGroupButton } from './style';

function GroupListLayout() {
  // groupId, name, thumbnail

  return (
    <GroupListWrapper>
      <GroupList>
        <Group></Group>
        <Group></Group>
        <Group></Group>
      </GroupList>
      <GroupListDivider />
      <div>
        <AddGroupButton>
          <img src="icons/addGroup.png" alt="addGroup" />
        </AddGroupButton>
      </div>
    </GroupListWrapper>
  );
}

export default GroupListLayout;
