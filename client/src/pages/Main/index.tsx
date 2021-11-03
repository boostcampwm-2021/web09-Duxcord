import React from 'react';
import { useSelector } from 'react-redux';
import ChannelHeader from '../../components/ChannelHeader';
import Chat from '../../components/Chat';
import SideBar from '../../components/SideBar';
import { RootState } from '../../redux/store';
import { Layout, MainWrapper } from './style';

function Main() {
  const selectedChannel = useSelector((state: RootState) => state.selectedChannel);
  return (
    <Layout>
      <SideBar />
      <MainWrapper>
        <ChannelHeader />
        {selectedChannel.type === 'text' && <Chat />}
      </MainWrapper>
    </Layout>
  );
}

export default Main;
