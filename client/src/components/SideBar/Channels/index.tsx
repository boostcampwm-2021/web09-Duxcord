import React, { useState, useEffect } from 'react';
import { useSelectedGroup } from '../../../hooks/useSelectedGroup';
import { socket } from '../../../util/socket';
import ChannelListItem from './ChannelListItem';
import MeetingUserList from './MeetingUserList';
import { ChannelWrapper, ChannelType } from './style';

interface Props {
  channelType: 'chatting' | 'meeting';
}

interface IMeetingUser {
  [key: number]: object[];
}

function Channels({ channelType }: Props) {
  const selectedGroup = useSelectedGroup();
  const channels =
    selectedGroup?.[channelType === 'chatting' ? 'chattingChannels' : 'meetingChannels'];
  const [meetingUser, setMeetingUser] = useState<IMeetingUser>({});

  useEffect(() => {
    const meetingchannelList = selectedGroup.meetingChannels.map(
      (channel: { id: number }) => channel.id,
    );

    socket.emit('MeetingChannelList', selectedGroup.code, meetingchannelList);
  }, [selectedGroup]);

  useEffect(() => {
    socket.on('MeetingUserList', (meetingUserList) => {
      setMeetingUser({ ...meetingUserList });
    });

    return () => {
      socket.off('MeetingUserList');
    };
  }, []);

  return (
    <ChannelWrapper>
      <ChannelType>
        <div>
          <img src="/icons/channelOpen.png" alt="channelToggle" />
          <p>{channelType.toUpperCase()} CHANNELS</p>
        </div>
        <img src="/icons/addChannel.png" alt="addChannel" />
      </ChannelType>
      <ul>
        {channels?.map((channel: any) => {
          return (
            <>
              <ChannelListItem
                key={channel.id}
                channelType={channelType}
                id={channel.id}
                name={channel.name}
              />
              {channelType === 'meeting' && (
                <MeetingUserList
                  key={channel.id + 'userlist'}
                  meetingUser={meetingUser[channel.id]}
                />
              )}
            </>
          );
        })}
      </ul>
    </ChannelWrapper>
  );
}

export default Channels;
