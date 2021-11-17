import React, { useState, useEffect } from 'react';
import { useSelectedGroup } from '@hooks/index';
import MeetEvent from '@customTypes/socket/MeetEvent';
import { socket } from '../../../utils/socket';
import { ChannelAddIcon, ChannelOpenIcon } from '../../common/Icons';
import { getURLParams } from '../../../utils/getURLParams';
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
  const { groupID } = getURLParams();

  useEffect(() => {
    socket.on(MeetEvent.MeetingUserList, (meetingUserList) => {
      setMeetingUser({ ...meetingUserList });
    });

    socket.on('someoneIn', (targetMeetingUsers, targetMeetingID) => {
      setMeetingUser((prevState) => ({
        ...prevState,
        [targetMeetingID]: targetMeetingUsers,
      }));
    });

    socket.on('someoneOut', (targetMeetingUsers, targetMeetingID) => {
      setMeetingUser((prevState) => ({
        ...prevState,
        [targetMeetingID]: targetMeetingUsers,
      }));
    });

    return () => {
      socket.off(MeetEvent.MeetingUserList);
    };
  }, []);

  useEffect(() => {
    if (channelType === 'chatting') return;

    const meetingChannelList = selectedGroup?.meetingChannels?.map(
      (channel: { id: number }) => channel.id,
    );
    // 현재 클릭된 그룹의 미팅채널별 참여인원들을 받아온다.
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
