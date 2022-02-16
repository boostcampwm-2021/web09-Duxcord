import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { useSelectedGroup, useGroups, useToast } from '@hooks/index';
import Colors from '@styles/Colors';
import { CHANNEL_TYPE, TOAST_MESSAGE, URL } from '@constants/index';
import { postCreateChannel } from '@api/index';
import { ChannelChattingIcon, ChannelMeetingIcon } from '@components/common/Icons';
import ChannelTypeItem from './ChannelTypeItem';
import Modal from '..';
import { Label, Wrapper, Input } from './style';

export default function ChannelCreateModal({
  initialChannelType,
  controller,
}: {
  initialChannelType: ChannelType;
  controller: ModalController;
}) {
  const [channelType, setChannelType] = useState(initialChannelType);
  const [channelName, setChannelName] = useState('');
  const selectedGroup = useSelectedGroup();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: mutateGroups } = useGroups();

  const { fireToast } = useToast();

  const createChannel = async () => {
    if (channelName.trim() === '')
      return fireToast({ message: TOAST_MESSAGE.ERROR.NEED_CHANNEL_NAME, type: 'warning' });
    const response = await postCreateChannel({
      groupID: selectedGroup.id,
      channelType,
      channelName,
    });
    if (response.status !== 200)
      return fireToast({ message: TOAST_MESSAGE.ERROR.CHANNEL_CREATE, type: 'warning' });
    try {
      const createdChannel = await response.json();
      mutateGroups((groups) => {
        return (groups as GroupData[]).map((group: GroupData) => {
          if (group.id !== selectedGroup.id) return group;
          const tempGroup = group;
          if (channelType === CHANNEL_TYPE.CHATTING) {
            tempGroup.chattingChannels = [...tempGroup.chattingChannels, createdChannel];
          } else if (channelType === CHANNEL_TYPE.MEETING) {
            tempGroup.meetingChannels = [...tempGroup.meetingChannels, createdChannel];
          }

          return tempGroup;
        });
      }, false);
      controller.hide();
      if (channelType === CHANNEL_TYPE.CHATTING) {
        navigate(URL.CHANNEL(selectedGroup.id, channelType, createdChannel.id), { replace: true });
        dispatch(
          setSelectedChannel({
            type: channelType,
            id: createdChannel.id,
            name: createdChannel.name,
          }),
        );
      }
      fireToast({ message: TOAST_MESSAGE.SUCCESS.CHANNEL_CREATE, type: 'success' });
    } catch (e) {
      fireToast({ message: TOAST_MESSAGE.ERROR.CHANNEL_CREATE, type: 'warning' });
    }
  };
  const ChannelCreateForm = (
    <Wrapper>
      <Label>채널 유형</Label>
      <ChannelTypeItem
        setChannelType={setChannelType}
        channelType={CHANNEL_TYPE.CHATTING}
        isSelected={channelType === CHANNEL_TYPE.CHATTING}
        icon={<ChannelChattingIcon />}
        title="채팅 채널"
        subTitle="메시지를 보내고 파일을 공유해요"
      />
      <ChannelTypeItem
        setChannelType={setChannelType}
        channelType={CHANNEL_TYPE.MEETING}
        isSelected={channelType === CHANNEL_TYPE.MEETING}
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
