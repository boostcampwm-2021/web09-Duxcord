import React from 'react';
import { ChannelListWrapper, GroupSettingWrapper, ChannelWrapper, ChannelType, ChannelList, ProfileWrapper } from './style';

function GroupListLayout() {
  return (
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
          <img src="icons/micOn.png" alt="micToggle" />
          <img src="icons/speakerOn.png" alt="speakerToggle" />
          <img src="icons/camOn.png" alt="comToggle" />
        </div>
      </ProfileWrapper>
    </ChannelListWrapper>
  );
}

export default GroupListLayout;
