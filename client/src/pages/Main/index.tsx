import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { useGroups, useSelectedChannel, useSelectedGroup } from '@hooks/index';
import { getURLParams } from 'src/utils/getURLParams';
import ChannelHeader from '@components/ChannelHeader';
import Chat from '@components/Chat';
import Meet from '@components/Meet';
import SideBar from '@components/SideBar';
import Empty from '@components/common/Empty';
import { Layout, MainWrapper } from './style';
import { Group } from '@customTypes/group';

function Main() {
  const { groups, isValidating } = useGroups();
  const { groupID, channelType, channelID } = getURLParams();
  const selectedGroup = useSelectedGroup();
  const selectedChannel = useSelectedChannel();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (isValidating) return;
    if (selectedGroup !== null || groupID === null) return;

    const group = groups?.find((group: Group) => group.id.toString() === groupID) ?? null;

    if (group === null) return;

    dispatch(setSelectedGroup(group));

    if (selectedChannel.id !== null || channelID === null) return;

    const { id, name } = group?.[
      channelType === 'chatting' ? 'chattingChannels' : 'meetingChannels'
    ].find((channel: any) => channel.id.toString() === channelID);

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
          <Empty />
        )}
      </MainWrapper>
    </Layout>
  );
}

export default Main;
