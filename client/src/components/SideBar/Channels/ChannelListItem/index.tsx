import React from 'react';
import { useHistory } from 'react-router';
import { ListItem } from './style';

interface Props {
  channelType: 'text' | 'meeting';
  id: number;
  name: string;
}

function ChannelListItem({ channelType, id, name }: Props) {
  const history = useHistory();
  const joinChannel = () => {
    history.push(`/Main/${channelType}/${id}`);
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
