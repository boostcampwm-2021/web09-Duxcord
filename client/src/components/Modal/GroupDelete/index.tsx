import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Modal from '..';
import { deleteGroup } from '../../../api/deleteGroup';
import { useSelectedGroup, useGroups } from '@hooks/index';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { setSelectedChat } from '@redux/selectedChat/slice';
import Colors from '@styles/Colors';
import { ModalController } from '@customTypes/modal';
import { AlertWrapper } from './style';
import { URL } from 'src/api/URL';
import { socket } from '../../../util/socket';
import GroupEvent from '@customTypes/socket/GroupEvent';

function GroupDeleteModal({ controller: { hide, show } }: { controller: ModalController }) {
  const selectedGroup = useSelectedGroup();
  const { groups, mutate: mutateGroups } = useGroups();
  const dispatch = useDispatch();
  const history = useHistory();

  const deleteCurrentGroup = async () => {
    try {
      const response = await deleteGroup({ groupID: selectedGroup.id });
      switch (response.status) {
        case 200:
          mutateGroups(
            groups.filter((group: any) => group.id !== selectedGroup.id),
            false,
          );
          socket.emit(GroupEvent.groupDelete, selectedGroup.code);
          dispatch(setSelectedGroup(null));
          dispatch(
            setSelectedChannel({
              type: '',
              id: null,
              name: '',
            }),
          );
          dispatch(setSelectedChat(null));
          finishModal();
          history.push(URL.groupPage());
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

  const finishModal = () => {
    hide();
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
      controller={{ hide: finishModal, show }}
    />
  );
}

export default GroupDeleteModal;
