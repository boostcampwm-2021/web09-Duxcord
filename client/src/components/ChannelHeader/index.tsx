import React from 'react';
import { useSelectedChannel } from '../../hooks/useSelectedChannel';
import { ChannelHeaderWrapper, ChannelHeaderLeft, ChannelHeaderRight } from './style';

function ChannelHeader() {
  const { type, name } = useSelectedChannel();
  return (
    <ChannelHeaderWrapper>
      <ChannelHeaderLeft>
        {name !== '' ? (
          <>
            <img src={`/icons/${type}Channel.png`} alt={`${type}Channel`} />
            <p>{name}</p>
          </>
        ) : (
          ''
        )}
      </ChannelHeaderLeft>
      <ChannelHeaderRight>
        <div>
          <img src="/icons/headerNotification.png" alt="headerNotification" />
          <img src="/icons/headerFix.png" alt="headerFix" />
          <img src="/icons/headerUsers.png" alt="headerUsers" />
        </div>
        <div>
          <p>Duxcord</p>
        </div>
        <div>
          <p>LogOut</p>
        </div>
      </ChannelHeaderRight>
    </ChannelHeaderWrapper>
  );
}

export default ChannelHeader;
