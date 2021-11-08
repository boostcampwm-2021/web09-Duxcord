import React from 'react';
import ChannelHeader from '../../components/ChannelHeader';
import Chat from '../../components/Chat';
import SideBar from '../../components/SideBar';
import { useSelectedChannel } from '../../hooks/useSelectedChannel';
import { Layout, MainWrapper } from './style';

function Main() {
  const selectedChannel = useSelectedChannel();
  return (
    <Layout>
      <SideBar />
      <MainWrapper>
        <ChannelHeader />
        {selectedChannel.type === 'chatting' && <Chat />}
      </MainWrapper>
    </Layout>
  );
}

export default Main;
