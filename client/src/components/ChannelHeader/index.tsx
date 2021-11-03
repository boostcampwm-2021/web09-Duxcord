import React from 'react';
import { ChannelHeaderWrapper, ChannelHeaderLeft, ChannelHeaderRight } from './style';

function ChannelHeader() {
  return (
    <ChannelHeaderWrapper>
      <ChannelHeaderLeft>
        <img src="/icons/textChannel.png" alt="textChannel" />
        <p>general</p>
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
