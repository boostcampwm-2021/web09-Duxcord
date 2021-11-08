import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useSelectedChannel } from '../../../../hooks/useSelectedChannel';
import { useSelectedGroup } from '../../../../hooks/useSelectedGroup';
import { setSelectedChannel } from '../../../../redux/selectedChannel/slice';
import { socket } from '../../../../util/socket';
import { ListItem } from './style';

interface Props {
  channelType: 'chatting' | 'meeting';
  id: number;
  name: string;
}

function ChannelListItem({ channelType, id, name }: Props) {
  const selectedGroup = useSelectedGroup();
  const selectedChannel = useSelectedChannel();
  const history = useHistory();
  const dispatch = useDispatch();
  const joinChannel = () => {
    history.push(`/main?group=${selectedGroup?.id}&type=${channelType}&id=${id}`);
    socket.emit('leaveChannel', selectedChannel.type + selectedChannel.id);
    socket.emit('joinChannel', channelType + id);
    dispatch(setSelectedChannel({ type: channelType, id, name }));
  };

  return (
    <ListItem onClick={joinChannel}>
      <div>
        <img src={'/icons/' + channelType + 'Channel.png'} alt={channelType + 'Channel'} />
        <p>{name}</p>
      </div>
      <img src="/icons/delete.png" alt="deleteChannel" />
    </ListItem>
  );
}

export default ChannelListItem;
