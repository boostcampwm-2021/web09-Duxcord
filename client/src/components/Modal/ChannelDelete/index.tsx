import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { useGroups, useSelectedGroup, useSelectedChannel } from '@hooks/index';
import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { setSelectedChat } from '@redux/selectedChat/slice';
import { ModalController } from '@customTypes/modal';
import Colors from '@styles/Colors';
import { deleteChannel } from 'src/api/deleteChannel';
import { URL } from 'src/api/URL';
import Modal from '..';
import { AlertWrapper } from './style';

export default function ChannelDeleteModal({ controller }: { controller: ModalController }) {
  const selectedGroup = useSelectedGroup();
  const selectedChannel = useSelectedChannel();
  const { groups, mutate: mutateGroups } = useGroups();
  const dispatch = useDispatch();
  const history = useHistory();

  const deleteCurrentChannel = async () => {
    try {
      const response = await deleteChannel({
        groupID: selectedGroup.id,
        channelType: selectedChannel.type as 'chatting' | 'meeting',
        channelID: selectedChannel.id,
      });
      switch (response.status) {
        case 200:
          //socket.emit(GroupEvent.groupDelete, selectedGroup.code);
          mutateGroups(
            groups.map((group: any) => {
              if (group.id !== selectedGroup.id) return group;
              else {
                if (selectedChannel.type === 'meeting')
                  return {
                    ...group,
                    meetingChannels: group.meetingChannels.filter(
                      (channel: any) => channel.id !== selectedChannel.id,
                    ),
                  };
                else
                  return {
                    ...group,
                    chattingChannels: group.chattingChannels.filter(
                      (channel: any) => channel.id !== selectedChannel.id,
                    ),
                  };
              }
            }),
            false,
          );
          dispatch(
            setSelectedChannel({
              type: '',
              id: null,
              name: '',
            }),
          );
          dispatch(setSelectedChat(null));
          controller.hide();
          history.replace(URL.groupPage(selectedGroup.id));
          break;
        case 400:
          const responseText = await response.text();
          console.error(responseText);
          break;
        default:
          console.log('백엔드가 포기한 요청');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const AlertComponent = (
    <>
      <AlertWrapper>
        정말로 <span>{selectedChannel.name}</span> 채널을 삭제하시겠습니까?
      </AlertWrapper>
    </>
  );

  return (
    <Modal
      props={{
        title: '그룹 삭제하기',
        middleContent: AlertComponent,
        bottomRightButton: {
          text: '삭제하기',
          color: Colors.Red,
          onClickHandler: deleteCurrentChannel,
        },
      }}
      controller={{ hide: controller.hide, show: controller.show }}
    />
  );
}
