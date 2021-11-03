import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGroups } from '../../../hooks/useGroups';
import { useSelectedGroup } from '../../../hooks/useSelectedGroup';
import { setSelectedGroup } from '../../../redux/selectedGroup/slice';
import { RootState } from '../../../redux/store';
import { GroupListWrapper, GroupList, Group, GroupListDivider, AddGroupButton } from './style';

function GroupNav() {
  const { groups } = useGroups();
  const dispatch = useDispatch();

  return (
    <GroupListWrapper>
      <GroupList>
        {groups?.map((group: any) => (
          <Group
            key={group.id}
            onClick={() => {
              dispatch(setSelectedGroup(group));
            }}
          >
            {group.name}
          </Group>
        ))}
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

export default GroupNav;
