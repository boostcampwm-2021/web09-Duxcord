import React, { useState } from 'react';
import { ModalController } from '@customTypes/modal';
import Colors from '@styles/Colors';
import Modal from '..';
import ChannelTypeItem from './ChannelTypeItem';
import { ChannelChattingIcon, ChannelMeetingIcon } from '@components/common/Icon';
import { Label, Wrapper, Input } from './style';

export default function ChannelCreateModal({
  initialChannelType,
  controller,
}: {
  initialChannelType: 'chatting' | 'meeting';
  controller: ModalController;
}) {
  const [channelType, setChannelType] = useState(initialChannelType);
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
      <Input />
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
          onClickHandler: () => {},
        },
      }}
      controller={controller}
    />
  );
}
