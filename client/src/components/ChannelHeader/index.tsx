import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ChannelHeaderWrapper, ChannelHeaderLeft, ChannelHeaderRight } from './style';

function ChannelHeader() {
  const { type, name } = useSelector((state: RootState) => state.selectedChannel);
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
          <img src="/icons/headerMention.png" alt="headerMention" />
          <img src="/icons/headerQuestion.png" alt="headerQuestion" />
        </div>
      </ChannelHeaderRight>
    </ChannelHeaderWrapper>
  );
}

export default ChannelHeader;
