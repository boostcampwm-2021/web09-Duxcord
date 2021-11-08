import React from 'react';
import { useSelectedGroup } from '../../hooks/useSelectedGroup';
import Channels from './Channels';
import GroupNav from './GroupNav';
import GroupSetting from './GroupSetting';
import Profile from './Profile';
import { ChannelListWrapper } from './style';

function SideBar() {
  const selectedGroup = useSelectedGroup();
  return (
    <>
      <GroupNav />
      <ChannelListWrapper>
        <div>
          <GroupSetting />
          {selectedGroup && (
            <>
              <Channels channelType='chatting' />
              <Channels channelType='meeting' />
            </>
          )}
        </div>
        <Profile />
      </ChannelListWrapper>
    </>
  );
}

export default SideBar;
