import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { useSelectedGroup, useSelectedChannel, useUserdata } from '@hooks/index';
import { URL } from 'src/api/URL';
import { ChannelChattingIcon, ChannelMeetingIcon, GroupDeleteIcon } from '@components/common/Icons';
import { ListItem } from './style';
import ChannelMeetingCount from './ChannelMeetingCount';

interface Props {
  showChannelDeleteModal: () => void;
  meetingUserCount: number;
  channelType: 'chatting' | 'meeting';
  id: number;
  name: string;
}

const MAX_MEETING_USER_COUNT = 5;

function ChannelListItem({
  showChannelDeleteModal,
  channelType,
  meetingUserCount,
  id,
  name,
}: Props) {
  const selectedGroup = useSelectedGroup();
  const { userdata } = useUserdata();
  const { id: selectedChannelID, type: selectedChannelType } = useSelectedChannel();
  const history = useHistory();
  const dispatch = useDispatch();
  const isLeader = selectedGroup?.leader?.loginID === userdata?.loginID;

  const joinChannel = () => {
    if (meetingUserCount >= MAX_MEETING_USER_COUNT && channelType === 'meeting') return;
    history.replace(URL.channelPage(selectedGroup?.id, channelType, id));
    dispatch(setSelectedChannel({ type: channelType, id, name }));
  };

  return (
    <ListItem
      onClick={joinChannel}
      selected={id === selectedChannelID && channelType === selectedChannelType}
      isLeader={isLeader}
    >
      <div>
        {channelType === 'meeting' ? (
          <ChannelMeetingIcon />
        ) : channelType === 'chatting' ? (
          <ChannelChattingIcon />
        ) : null}
        <p>{name}</p>
      </div>
      {channelType === 'meeting' && !!meetingUserCount && (
        <ChannelMeetingCount meetingUserCount={meetingUserCount} />
      )}
      {isLeader && (
        <GroupDeleteIcon
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(setSelectedChannel({ type: channelType, id, name }));
            showChannelDeleteModal();
          }}
        />
      )}
    </ListItem>
  );
}

export default ChannelListItem;
