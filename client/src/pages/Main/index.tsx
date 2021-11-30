import React, { Suspense, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { useGroups, useSelectedChannel, useSelectedGroup } from '@hooks/index';
import { getURLParams } from '@utils/getURLParams';
import ChannelHeader from '@components/ChannelHeader';
import Chat from '@components/Chat';
import Meet from '@components/Meet';
import SideBar from '@components/SideBar';
import Empty from '@components/common/Empty';
import { Layout, MainWrapper, EmptyWrapper } from './style';
import Loading from '@pages/Loading';

const CHANNEL_SELECT_NEEDED = '채널을 선택해주세요!';

function MainLayout() {
  const { groups, isValidating } = useGroups({ suspense: true });
  const { groupID, channelType, channelID } = getURLParams();
  const selectedGroup = useSelectedGroup();
  const selectedChannel = useSelectedChannel();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (isValidating) return;
    if (selectedGroup !== null || groupID === null) return;

    const group = groups?.find((group: GroupData) => group.id.toString() === groupID) ?? null;

    if (group === null) return;

    dispatch(setSelectedGroup(group));

    if (selectedChannel.id !== null || channelID === null) return;

    const { id, name } = group?.[
      channelType === 'chatting' ? 'chattingChannels' : 'meetingChannels'
    ].find((channel: ChannelData) => channel.id.toString() === channelID);

    if (!id || !name) return;

    dispatch(setSelectedChannel({ id, name, type: channelType }));
  }, [isValidating]);

  return (
    <Layout>
      <SideBar />
      <MainWrapper>
        <ChannelHeader />
        {selectedChannel.type ? (
          selectedChannel.type === 'chatting' ? (
            <Chat />
          ) : (
            <Meet />
          )
        ) : (
          <EmptyWrapper>
            <Empty message={CHANNEL_SELECT_NEEDED} />
          </EmptyWrapper>
        )}
      </MainWrapper>
    </Layout>
  );
}

function Main() {
  return (
    <Suspense fallback={Loading}>
      <MainLayout />
    </Suspense>
  );
}

export default Main;
