import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useSelectedGroup } from '../../../../hooks/useSelectedGroup';
import { setSelectedChannel } from '../../../../redux/selectedChannel/slice';
import { RootState } from '../../../../redux/store';
import { socket } from '../../../../util/socket';
import { ListItem } from './style';

interface Props {
  channelType: 'text' | 'meeting';
  id: number;
  name: string;
}

function ChannelListItem({ channelType, id, name }: Props) {
  const selectedGroup = useSelectedGroup();
  const selectedChannel = useSelector((state: RootState) => state.selectedChannel);
  const history = useHistory();
  const dispatch = useDispatch();
  const joinChannel = () => {
    history.push(`/Main/group/${selectedGroup?.id}/${channelType}/${id}`);
    socket.emit('leaveChannel', selectedChannel.id);
    socket.emit('joinChannel', id);
    dispatch(setSelectedChannel({ type: channelType, id, name }));
  };

  return (
    <ListItem onClick={joinChannel}>
      <div>
        <img src={'/icons/' + channelType + 'Channel.png'} alt={channelType + 'Channel'} />
        {name}
      </div>
      <img src="/icons/delete.png" alt="deleteChannel" />
    </ListItem>
  );
}

export default ChannelListItem;
