import React, { useState } from 'react';
import GroupNav from './GroupNav';
import {
  ChannelListWrapper,
  GroupSettingWrapper,
  ChannelWrapper,
  ChannelType,
  ChannelList,
  ProfileWrapper,
} from './style';

function SideBar() {
  const [device, setDevice] = useState({
    mic: true,
    speaker: true,
    cam: true,
  });

  const toggleDevice = (target: 'mic' | 'speaker' | 'cam') => {
    setDevice({
      ...device,
      [target]: !device[target],
    });
  };

  return (
    <>
      <GroupNav />
      <ChannelListWrapper>
        <div>
          <GroupSettingWrapper>
            <p>F4</p>
            <div>
              <img src="icons/inviteGroup.png" alt="inviteGroup" />
              <img src="icons/delete.png" alt="deleteGroup" />
            </div>
          </GroupSettingWrapper>
          <ChannelWrapper>
            <ChannelType>
              <div>
                <img src="icons/channelOpen.png" alt="channelToggle" />
                <p>TEXT CHANNELS</p>
              </div>
              <img src="icons/addChannel.png" alt="addChannel" />
            </ChannelType>
            <ChannelList>
              <li>
                <div>
                  <img src="icons/textChannel.png" alt="textChannel" />
                  general
                </div>
                <img src="icons/delete.png" alt="deleteChannel" />
              </li>
            </ChannelList>
          </ChannelWrapper>
          <ChannelWrapper>
            <ChannelType>
              <div>
                <img src="icons/channelOpen.png" alt="channelToggle" />
                <p>MEETING CHANNELS</p>
              </div>
              <img src="icons/addChannel.png" alt="addChannel" />
            </ChannelType>
            <ChannelList>
              <li>
                <div>
                  <img src="icons/meetingChannel.png" alt="meetingChannel" />
                  General
                </div>
                <img src="icons/delete.png" alt="deleteChannel" />
              </li>
            </ChannelList>
          </ChannelWrapper>
        </div>
        <ProfileWrapper>
          <div>
            <div></div>
            <p>부덕이</p>
          </div>
          <div>
            <img
              onClick={() => toggleDevice('mic')}
              src={'icons/mic' + (device.mic ? 'On' : 'Off') + '.png'}
              alt="micToggle"
            />
            <img
              onClick={() => toggleDevice('speaker')}
              src={'icons/speaker' + (device.speaker ? 'On' : 'Off') + '.png'}
              alt="speakerToggle"
            />
            <img
              onClick={() => toggleDevice('cam')}
              src={'icons/cam' + (device.cam ? 'On' : 'Off') + '.png'}
              alt="comToggle"
            />
          </div>
        </ProfileWrapper>
      </ChannelListWrapper>
    </>
  );
}

export default SideBar;
