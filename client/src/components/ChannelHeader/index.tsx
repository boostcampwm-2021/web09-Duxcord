import React, { useState } from 'react';

import { useSelectedChannel } from '@hooks/index';
import { ModalController } from '@customTypes/modal';
import LogoutModal from '../Modal/Logout';
import { ChannelChattingIcon, ChannelMeetingIcon } from '../common/Icons';
import { ChannelHeaderWrapper, ChannelHeaderLeft, ChannelHeaderRight } from './style';

function ChannelHeader() {
  const { type, name } = useSelectedChannel();
  const [tryLogout, setTryLogOut] = useState(false);

  const logOutModalControl: ModalController = {
    hide: () => setTryLogOut(false),
    show: () => setTryLogOut(true),
  };

  return (
    <>
      <ChannelHeaderWrapper>
        <ChannelHeaderLeft>
          {name !== '' ? (
            <>
              {type === 'meeting' ? (
                <ChannelMeetingIcon />
              ) : type === 'chatting' ? (
                <ChannelChattingIcon />
              ) : null}
              <p>{name}</p>
            </>
          ) : (
            ''
          )}
        </ChannelHeaderLeft>
        <ChannelHeaderRight>
          <div>
            <p>Duxcord</p>
          </div>
          <div>
            <p onClick={() => setTryLogOut(!tryLogout)}>LogOut</p>
          </div>
        </ChannelHeaderRight>
      </ChannelHeaderWrapper>
      {tryLogout && <LogoutModal controller={logOutModalControl} />}
    </>
  );
}

export default ChannelHeader;
