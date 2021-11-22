import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { useSelectedGroup, useGroups } from '@hooks/index';
import { ModalController } from '@customTypes/modal';
import Colors from '@styles/Colors';
import { postCreateChannel } from 'src/api/postCreateChannel';
import { URL } from 'src/api/URL';
import Modal from '..';
import ChannelTypeItem from './ChannelTypeItem';
import { ChannelChattingIcon, ChannelMeetingIcon } from '@components/common/Icons';
import { Label, Wrapper, Input, ErrorMessage } from './style';
import { Group } from '@customTypes/group';

export default function ChannelCreateModal({
  initialChannelType,
  controller,
}: {
  initialChannelType: 'chatting' | 'meeting';
  controller: ModalController;
}) {
  const [channelType, setChannelType] = useState(initialChannelType);
  const [channelName, setChannelName] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const selectedGroup = useSelectedGroup();
  const history = useHistory();
  const dispatch = useDispatch();
  const { mutate: mutateGroups } = useGroups();

  const createChannel = async () => {
    const response = await postCreateChannel({
      groupID: selectedGroup.id,
      channelType,
      channelName,
    });
    try {
      const createdChannel = await response.json();
      mutateGroups((groups: Group[]) => {
        return groups.map((group: Group) => {
          if (group.id !== selectedGroup.id) return group;
          const tempGroup = group;
          tempGroup[`${channelType}Channels`] = [
            ...tempGroup[`${channelType}Channels`],
            createdChannel,
          ];
          return tempGroup;
        });
      }, false);
      controller.hide();
      if (channelType === 'chatting') {
        history.replace(URL.channelPage(selectedGroup.id, channelType, createdChannel.id));
        dispatch(
          setSelectedChannel({
            type: channelType,
            id: createdChannel.id,
            name: createdChannel.name,
          }),
        );
      }
    } catch (e) {
      setErrorMessage(true);
    }
  };
  const ChannelCreateForm = (
    <Wrapper>
      <Label>채널 유형</Label>
      <ChannelTypeItem
        setChannelType={setChannelType}
        channelType="chatting"
        isSelected={channelType === 'chatting'}
        icon={<ChannelChattingIcon />}
        title="채팅 채널"
        subTitle="메시지를 보내고 파일을 공유해요"
      />
      <ChannelTypeItem
        setChannelType={setChannelType}
        channelType="meeting"
        isSelected={channelType === 'meeting'}
        icon={<ChannelMeetingIcon />}
        title="화상 채널"
        subTitle="회의 합시다!"
      />
      <Label>채널 이름</Label>
      <Input
        onChange={(e) => {
          setChannelName(e.target.value);
        }}
      />
      {errorMessage && <ErrorMessage>채널 생성에 실패했습니다. 다시 시도해주세요.</ErrorMessage>}
    </Wrapper>
  );
  return (
    <Modal
      props={{
        title: '채널 만들기',
        middleContent: ChannelCreateForm,
        bottomRightButton: {
          text: '만들기',
          color: Colors.Blue,
          onClickHandler: createChannel,
        },
      }}
      controller={controller}
    />
  );
}
