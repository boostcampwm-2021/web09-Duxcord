import React from 'react';
import ChannelHeader from '../../components/ChannelHeader';
import Chat from '../../components/Chat';
import SideBar from '../../components/SideBar';
import { Layout, MainWrapper } from './style';

interface Props {
  children: JSX.Element[] | JSX.Element;
}

function Main({ children }: Props) {
  return (
    <Layout>
      <SideBar />
      <MainWrapper>
        <ChannelHeader />
        {children}
        <Chat chats={[]} />
      </MainWrapper>
    </Layout>
  );
}

export default Main;
