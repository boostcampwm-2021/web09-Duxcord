import React, { useState } from 'react';
import { ChannelListWrapper } from './style';
import GroupSetting from './GroupSetting';
import Channel from './Channel';
import Profile from './Profile';

function GroupListLayout() {
  const [device, setDevice] = useState({
    mic: true,
    speaker: true,
    cam: true,
  })

  const toggleDevice = (target: "mic" | "speaker" | "cam") => {
    setDevice({
      ...device,
      [target]: !device[target]
    })
  }

  return (
    <ChannelListWrapper>
      <div>
        <GroupSetting />
        <Channel channelType="text" />
        <Channel channelType="meeting" />
      </div>
      <Profile device={device} onToggleDevice={toggleDevice}/>
    </ChannelListWrapper>
  );
}

export default GroupListLayout;
