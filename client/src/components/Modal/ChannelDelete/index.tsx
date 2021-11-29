import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { useGroups, useSelectedGroup, useSelectedChannel, useToast } from '@hooks/index';
import { resetSelectedChannel } from '@redux/selectedChannel/slice';
import { setSelectedChat } from '@redux/selectedChat/slice';
import Colors from '@styles/Colors';
import { TOAST_MESSAGE } from '@utils/constants/MESSAGE';
import { URL } from '@utils/constants/URL';
import { socket } from '@utils/socket';
import { deleteChannel } from '@api/deleteChannel';
import Modal from '..';
import { AlertWrapper } from './style';
import { SOCKET } from '@utils/constants/SOCKET_EVENT';

export default function ChannelDeleteModal({ controller }: { controller: ModalController }) {
  const selectedGroup = useSelectedGroup();
  const selectedChannel = useSelectedChannel();
  const { groups, mutate: mutateGroups } = useGroups();
  const { fireToast } = useToast();
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
          socket.emit(SOCKET.GROUP_EVENT.DELETE_CHANNEL, {
            code: selectedGroup.code,
            id: selectedChannel.id,
            type: selectedChannel.type,
          });
          mutateGroups(
            groups.map((group: GroupData) => {
              if (group.id !== selectedGroup.id) return group;
              else {
                const tempGroup = group;
                selectedChannel.type === 'meeting'
                  ? tempGroup.meetingChannels.filter(
                      (channel: ChannelData) => channel.id !== selectedChannel.id,
                    )
                  : tempGroup.chattingChannels.filter(
                      (channel: ChannelData) => channel.id !== selectedChannel.id,
                    );
                return tempGroup;
              }
            }),
            false,
          );
          dispatch(resetSelectedChannel());
          dispatch(setSelectedChat(null));
          controller.hide();
          history.replace(URL.GROUP(selectedGroup.id));
          fireToast({ message: TOAST_MESSAGE.SUCCESS.CHANNEL_DELETE, type: 'success' });
          break;
        case 400:
          fireToast({ message: TOAST_MESSAGE.ERROR.CHANNEL_DELETE, type: 'warning' });
          break;
        default:
          fireToast({ message: TOAST_MESSAGE.ERROR.COMMON, type: 'warning' });
      }
    } catch (error) {
      fireToast({ message: TOAST_MESSAGE.ERROR.COMMON, type: 'warning' });
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
        title: '채널 삭제하기',
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
