import React, { useState, useEffect } from 'react';

import { useSelectedGroup } from '@hooks/index';
import MeetEvent from '@customTypes/socket/MeetEvent';
import { ModalController } from '@customTypes/modal';
import { socket } from 'src/utils/socket';
import { getURLParams } from 'src/utils/getURLParams';
import ChannelListItem from './ChannelListItem';
import MeetingUserList from './MeetingUserList';
import ChannelCreateModal from '@components/Modal/ChannelCreate';
import { ChannelAddIcon, ChannelOpenIcon } from '@components/common/Icons';
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
  const [channelToCreate, setChannelToCreate] = useState<'chatting' | 'meeting' | null>(null);
  const [showModal, setShowModal] = useState(false);
  const modalController: ModalController = {
    hide: () => setShowModal(false),
    show: () => setShowModal(true),
  };
  const { groupID } = getURLParams();

  useEffect(() => {
    socket.on(MeetEvent.MeetingUserList, (meetingUserList) => {
      setMeetingUser({ ...meetingUserList });
    });

    socket.on(MeetEvent.someoneIn, (targetMeetingUsers, targetMeetingID) => {
      setMeetingUser((prevState) => ({
        ...prevState,
        [targetMeetingID]: targetMeetingUsers,
      }));
    });

    socket.on(MeetEvent.someoneOut, (targetMeetingUsers, targetMeetingID) => {
      setMeetingUser((prevState) => ({
        ...prevState,
        [targetMeetingID]: targetMeetingUsers,
      }));
    });

    return () => {
      socket.off(MeetEvent.MeetingUserList);
      socket.off(MeetEvent.someoneIn);
      socket.off(MeetEvent.someoneOut);
    };
  }, []);

  useEffect(() => {
    if (channelType === 'chatting') return;

    const meetingChannelList = selectedGroup?.meetingChannels?.map(
      (channel: { id: number }) => channel.id,
    );

    socket.emit(MeetEvent.MeetingChannelList, selectedGroup.code, meetingChannelList);
  }, [selectedGroup]);

  return (
    <ChannelWrapper>
      {groupID && (
        <>
          <ChannelType>
            <div>
              <ChannelOpenIcon />
              <p>{channelType.toUpperCase()} CHANNELS</p>
            </div>
            <ChannelAddIcon
              onClick={() => {
                setChannelToCreate(channelType);
                modalController.show();
              }}
            />
          </ChannelType>
          <ul>
            {channels?.map((channel: any) => {
              return (
                <div key={channel.id}>
                  <ChannelListItem
                    meetingUserCount={meetingUser[channel.id]?.length}
                    channelType={channelType}
                    id={channel.id}
                    name={channel.name}
                  />
                  {channelType === 'meeting' && (
                    <MeetingUserList meetingUser={meetingUser[channel.id]} />
                  )}
                </div>
              );
            })}
          </ul>
          {channelToCreate && showModal && (
            <ChannelCreateModal initialChannelType={channelToCreate} controller={modalController} />
          )}
        </>
      )}
    </ChannelWrapper>
  );
}

export default Channels;
