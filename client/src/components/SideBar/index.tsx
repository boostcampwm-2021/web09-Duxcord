import React from 'react';
import Channel from './Channel';
import GroupNav from './GroupNav';
import GroupSetting from './GroupSetting';
import Profile from './Profile';
import { ChannelListWrapper } from './style';

function SideBar() {
  return (
    <>
      <GroupNav />
      <ChannelListWrapper>
        <GroupSetting />
        <div>
          <Channel channelType="text" />
          <Channel channelType="meeting" />
        </div>
        <Profile />
      </ChannelListWrapper>
    </>
  );
}

export default SideBar;
