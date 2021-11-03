import React from 'react';
import { GroupSettingWrapper } from './style';

function GroupSetting() {

  return (
    <GroupSettingWrapper>
      <p>F4</p>
      <div>
        <img src="icons/inviteGroup.png" alt="inviteGroup" />
        <img src="icons/delete.png" alt="deleteGroup" />
      </div>
    </GroupSettingWrapper>
  );
}

export default GroupSetting;
