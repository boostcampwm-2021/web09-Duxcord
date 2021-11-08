import React from 'react';
import ChannelHeader from '../../components/ChannelHeader';
import Chat from '../../components/Chat';
import Meet from '../../components/Meet';
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
        {selectedChannel.type && (selectedChannel.type === 'chatting' ? <Chat /> : <Meet />)}
      </MainWrapper>
    </Layout>
  );
}

export default Main;
