import React from 'react';
import GroupListLayout from './GroupListLayout';
import ChannelListLayout from './ChannelListLayout';
import ChannelHeaderLayout from './ChannelHeaderLayout';
import { Layout, MainWrapper } from './style';

interface Props {
  children: JSX.Element[] | JSX.Element
}

function MainLayout({ children }: Props) {
  return (
    <Layout>
      <GroupListLayout />
      <ChannelListLayout />
      <MainWrapper>
        <ChannelHeaderLayout />
        { children }
      </MainWrapper>
    </Layout>
  );
}

export default MainLayout;
