import React, { useState } from 'react';
import { useSelectedChannel } from '../../hooks/useSelectedChannel';
import { ModalController } from '../../types/modal';
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
            <p onClick={() => setTryLogOut(!tryLogout)}>LogOut</p>
          </div>
        </ChannelHeaderRight>
      </ChannelHeaderWrapper>
      {tryLogout && <LogoutModal controller={logOutModalControl} />}
    </>
  );
}

export default ChannelHeader;
