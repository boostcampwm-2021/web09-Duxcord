import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { API_URL } from '../../../../api/API_URL';
import { useSelectedGroup } from '../../../../hooks/useSelectedGroup';
import { setSelectedChannel } from '../../../../redux/selectedChannel/slice';
import { ChannelChattingIcon, ChannelMeetingIcon, GroupDeleteIcon } from '../../../common/Icon';
import { ListItem } from './style';

interface Props {
  channelType: 'chatting' | 'meeting';
  id: number;
  name: string;
}

function ChannelListItem({ channelType, id, name }: Props) {
  const selectedGroup = useSelectedGroup();
  const history = useHistory();
  const dispatch = useDispatch();
  const joinChannel = () => {
    history.push(API_URL.page.ChannelPage(selectedGroup?.id, channelType, id));
    dispatch(setSelectedChannel({ type: channelType, id, name }));
  };

  return (
    <ListItem onClick={joinChannel}>
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
