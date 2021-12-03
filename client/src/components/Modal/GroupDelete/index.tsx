import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { resetSelectedGroup } from '@redux/selectedGroup/slice';
import { resetSelectedChannel } from '@redux/selectedChannel/slice';
import { resetSelectedChat } from '@redux/selectedChat/slice';
import { useSelectedGroup, useGroups, useToast } from '@hooks/index';
import { TOAST_MESSAGE, URL, SOCKET } from '@constants/index';
import { socket } from '@utils/socket';
import { deleteGroup } from '@api/index';
import Colors from '@styles/Colors';
import Modal from '..';
import { AlertWrapper } from './style';

function GroupDeleteModal({ controller: { hide, show } }: { controller: ModalController }) {
  const selectedGroup = useSelectedGroup();
  const { groups, mutate: mutateGroups } = useGroups();
  const dispatch = useDispatch();
  const history = useHistory();
  const { fireToast } = useToast();

  const deleteCurrentGroup = async () => {
    try {
      const response = await deleteGroup({ groupID: selectedGroup.id });
      switch (response.status) {
        case 200:
          socket.emit(SOCKET.GROUP_EVENT.DELETE_GROUP, selectedGroup.code);
          mutateGroups(
            groups.filter((group: GroupData) => group.id !== selectedGroup.id),
            false,
          );
          history.replace(URL.GROUP());
          dispatch(resetSelectedGroup());
          dispatch(resetSelectedChannel());
          dispatch(resetSelectedChat());
          hide();
          fireToast({ message: TOAST_MESSAGE.SUCCESS.GROUP_DELETE, type: 'success' });
          break;
        case 400:
          const responseText = await response.text();
          fireToast({ message: responseText, type: 'warning' });
          break;
        default:
          fireToast({ message: TOAST_MESSAGE.ERROR.COMMON, type: 'warning' });
      }
    } catch (error) {
      fireToast({ message: TOAST_MESSAGE.ERROR.GROUP_DELETE, type: 'warning' });
    }
  };

  const AlertComponent = (
    <>
      <AlertWrapper>
        정말로 <span>{selectedGroup.name}</span> 그룹을 삭제하시겠습니까?
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
          onClickHandler: deleteCurrentGroup,
        },
      }}
      controller={{ hide: () => hide(), show }}
    />
  );
}

export default GroupDeleteModal;
