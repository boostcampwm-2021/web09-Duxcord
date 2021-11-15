import React, { useState } from 'react';
import Modal from '..';
import { useSelectedGroup } from '@hooks/index';
import Colors from '@styles/Colors';
import { ModalController } from '@customTypes/modal';
import { AlertWrapper } from './style';

function GroupDeleteModal({ controller: { hide, show } }: { controller: ModalController }) {
  const selectedGroup = useSelectedGroup();

  const deleteGroup = () => {
    try {
      console.log('click');
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
          onClickHandler: deleteGroup,
        },
      }}
      controller={{ hide: finishModal, show }}
    />
  );
}

export default GroupDeleteModal;
