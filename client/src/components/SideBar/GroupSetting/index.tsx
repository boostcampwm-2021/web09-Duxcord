import React from 'react';
import { useSelectedGroup } from '../../../hooks/useSelectedGroup';
import { GroupSettingWrapper } from './style';

function GroupSetting() {
  const selectedGroup = useSelectedGroup();

  return (
    <GroupSettingWrapper>
      <p>{selectedGroup?.name}</p>
      <div>
        <img src="icons/inviteGroup.png" alt="inviteGroup" />
        <img src="icons/delete.png" alt="deleteGroup" />
      </div>
    </GroupSettingWrapper>
  );
}

export default GroupSetting;
