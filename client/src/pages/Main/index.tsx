import React, { Suspense, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSWRImmutable from 'swr/immutable';

import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { getGroupsFetcher, useSelectedChannel, useSelectedGroup } from '@hooks/index';
import { getURLParams } from '@utils/getURLParams';
import ChannelHeader from '@components/ChannelHeader';
import Chat from '@components/Chat';
import Meet from '@components/Meet';
import SideBar from '@components/SideBar';
import Empty from '@components/common/Empty';
import { Layout, MainWrapper } from './style';
import { Group } from '@customTypes/group';
import { API_URL } from '@utils/constants/API_URL';

const NEED_CHANNEL_SELECT = '채널을 선택해주세요!';

function Main() {
  const { data: groups } = useSWRImmutable(API_URL.USER.GET_GROUPS, getGroupsFetcher, {
    suspense: true,
  });
  const { groupID, channelType, channelID } = getURLParams();
  const selectedGroup = useSelectedGroup();
  const selectedChannel = useSelectedChannel();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (selectedGroup !== null || groupID === null) return;

    const group = groups?.find((group: Group) => group.id === +groupID);

    if (!group) return;

    dispatch(setSelectedGroup(group));

    if (selectedChannel.id !== null || channelID === null) return;

    const channel = group?.[
      channelType === 'chatting' ? 'chattingChannels' : 'meetingChannels'
    ].find((channel: any) => channel.id === +channelID);

    if (!channel) return;
    const { id, name } = channel;

    dispatch(setSelectedChannel({ id, name, type: channelType }));
  }, []);

  return (
    <Layout>
      <SideBar />
      <MainWrapper>
        <ChannelHeader />
        {selectedChannel.type ? (
          <Suspense fallback={<Empty message="로딩중" />}>
            {selectedChannel.type === 'chatting' ? <Chat /> : <Meet />}
          </Suspense>
        ) : (
          <Empty message={NEED_CHANNEL_SELECT} />
        )}
      </MainWrapper>
    </Layout>
  );
}

export default Main;
