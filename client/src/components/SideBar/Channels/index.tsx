import React from 'react';
import { useSelectedGroup } from '../../../hooks/useSelectedGroup';
import ChannelListItem from './ChannelListItem';
import { ChannelWrapper, ChannelType } from './style';

interface Props {
  channelType: 'chatting' | 'meeting';
}

function Channels({ channelType }: Props) {
  const selectedGroup = useSelectedGroup();
  const channels =
    selectedGroup?.[
      channelType === 'chatting' ? 'chattingChannels' : 'meetingChannels'
    ];

  return (
    <ChannelWrapper>
      <ChannelType>
        <div>
          <img src='/icons/channelOpen.png' alt='channelToggle' />
          <p>{channelType.toUpperCase()} CHANNELS</p>
        </div>
        <img src='/icons/addChannel.png' alt='addChannel' />
      </ChannelType>
      <ul>
        {channels?.map((channel: any) => (
          <ChannelListItem
            key={channel.id}
            channelType={channelType}
            id={channel.id}
            name={channel.name}
          />
        ))}
      </ul>
    </ChannelWrapper>
  );
}

export default Channels;
