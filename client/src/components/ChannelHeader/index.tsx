import React, { useState } from 'react';
import { useSelectedChannel } from '@hooks/useSelectedChannel';
import { ModalController } from '@customTypes/modal';
import {
  ChannelChattingIcon,
  ChannelMeetingIcon,
  HeaderAlertIcon,
  HeaderFixIcon,
  HeaderUsersIcon,
} from '../common/Icon';
import LogoutModal from '../Modal/Logout';
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
            <HeaderAlertIcon />
            <HeaderFixIcon />
            <HeaderUsersIcon />
          </div>
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
