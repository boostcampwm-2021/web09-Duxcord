import React, { useState, useEffect } from 'react';
import { useSelectedGroup } from '@hooks/index';
import MeetEvent from '@customTypes/socket/MeetEvent';
import { socket } from '../../../util/socket';
import { ChannelAddIcon, ChannelOpenIcon } from '../../common/Icon';
import { getURLParams } from '../../../util/getURLParams';
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
  const { groupID } = getURLParams();

  useEffect(() => {
    const meetingchannelList = selectedGroup?.meetingChannels?.map(
      (channel: { id: number }) => channel.id,
    );

    socket.emit(MeetEvent.MeetingChannelList, selectedGroup.code, meetingchannelList);
  }, [selectedGroup]);

  useEffect(() => {
    socket.on(MeetEvent.MeetingUserList, (meetingUserList) => {
      setMeetingUser({ ...meetingUserList });
    });

    return () => {
      socket.off(MeetEvent.MeetingUserList);
    };
  }, []);

  return (
    <ChannelWrapper>
      {groupID && (
        <>
          <ChannelType>
            <div>
              <ChannelOpenIcon />
              <p>{channelType.toUpperCase()} CHANNELS</p>
            </div>
            <ChannelAddIcon />
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
        </>
      )}
    </ChannelWrapper>
  );
}

export default Channels;
