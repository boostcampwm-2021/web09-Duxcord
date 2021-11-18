import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useSelectedGroup, useSelectedChannel } from '@hooks/index';
import { URL } from 'src/api/URL';
import { setSelectedChannel } from '../../../../redux/selectedChannel/slice';
import { ChannelChattingIcon, ChannelMeetingIcon, GroupDeleteIcon } from '../../../common/Icons';
import { ListItem } from './style';

interface Props {
  meetingUserCount: number;
  channelType: 'chatting' | 'meeting';
  id: number;
  name: string;
}

function ChannelListItem({ channelType, meetingUserCount, id, name }: Props) {
  const selectedGroup = useSelectedGroup();
  const { id: selectedChannelID, type: selectedChannelType } = useSelectedChannel();
  const history = useHistory();
  const dispatch = useDispatch();

  const joinChannel = () => {
    if (meetingUserCount >= 5 && channelType === 'meeting') return;
    history.replace(URL.channelPage(selectedGroup?.id, channelType, id));
    dispatch(setSelectedChannel({ type: channelType, id, name }));
  };

  return (
    <ListItem
      onClick={joinChannel}
      selected={id === selectedChannelID && channelType === selectedChannelType}
    >
      <div>
        {channelType === 'meeting' ? (
          <ChannelMeetingIcon />
        ) : channelType === 'chatting' ? (
          <ChannelChattingIcon />
        ) : null}
        <p>{name}</p>
      </div>
      <GroupDeleteIcon />
    </ListItem>
  );
}

export default ChannelListItem;
