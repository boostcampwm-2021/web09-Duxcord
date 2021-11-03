import React from 'react';
import { ChannelWrapper, ChannelType, ChannelList } from './style';

interface Props {
  channelType: "text" | "meeting"
}

function Channel({ channelType }: Props) {
  return (
    <ChannelWrapper>
      <ChannelType>
        <div>
          <img src="icons/channelOpen.png" alt="channelToggle" />
          <p>{channelType.toUpperCase()} CHANNELS</p>
        </div>
        <img src="icons/addChannel.png" alt="addChannel" />
      </ChannelType>
      <ChannelList>
        <li>
          <div>
            <img src={"icons/" + channelType + "Channel.png"} alt={ channelType + "Channel"} />
            general
          </div>
          <img src="icons/delete.png" alt="deleteChannel" />
        </li>
      </ChannelList>
    </ChannelWrapper>
  );
}

export default Channel;
