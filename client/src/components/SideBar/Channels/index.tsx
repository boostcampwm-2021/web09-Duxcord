import React, { useState, useEffect } from 'react';

import { useSelectedGroup } from '@hooks/index';
import MeetEvent from '@customTypes/socket/MeetEvent';
import { ModalController } from '@customTypes/modal';
import { socket } from '@utils/socket';
import { getURLParams } from '@utils/getURLParams';
import ChannelListItem from './ChannelListItem';
import MeetingUserList from './MeetingUserList';
import ChannelCreateModal from '@components/Modal/ChannelCreate';
import ChannelDeleteModal from '@components/Modal/ChannelDelete';
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
  const [showChannelCreateModal, setShowChannelCreateModal] = useState(false);
  const channelCreateModalController: ModalController = {
    hide: () => setShowChannelCreateModal(false),
    show: () => setShowChannelCreateModal(true),
  };
  const [showChannelDeleteModal, setShowChannelDeleteModal] = useState(false);
  const channelDeleteModalController: ModalController = {
    hide: () => setShowChannelDeleteModal(false),
    show: () => setShowChannelDeleteModal(true),
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
                channelCreateModalController.show();
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
                    showChannelDeleteModal={channelDeleteModalController.show}
                  />
                  {channelType === 'meeting' && (
                    <MeetingUserList meetingUser={meetingUser[channel.id]} />
                  )}
                </div>
              );
            })}
          </ul>
          {channelToCreate && showChannelCreateModal && (
            <ChannelCreateModal
              initialChannelType={channelToCreate}
              controller={channelCreateModalController}
            />
          )}
          {showChannelDeleteModal && (
            <ChannelDeleteModal controller={channelDeleteModalController} />
          )}
        </>
      )}
    </ChannelWrapper>
  );
}

export default Channels;
