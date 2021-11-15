import React, { useState, useEffect } from 'react';
import { useSelectedGroup } from '@hooks/index';
import MeetEvent from '@customTypes/socket/MeetEvent';
import { socket } from '../../../util/socket';
import { ChannelAddIcon, ChannelOpenIcon } from '../../common/Icon';
import ChannelListItem from './ChannelListItem';
import MeetingUserList from './MeetingUserList';
import { ChannelWrapper, ChannelType } from './style';
import ChannelCreateModal from '@components/Modal/ChannelCreate';
import { ModalController } from '@customTypes/modal';

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

  useEffect(() => {
    const meetingchannelList = selectedGroup.meetingChannels.map(
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
              <ChannelListItem channelType={channelType} id={channel.id} name={channel.name} />
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
    </ChannelWrapper>
  );
}

export default Channels;
