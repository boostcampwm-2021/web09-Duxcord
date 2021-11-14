import React from 'react';
import Modal from '..';
import { ModalController } from '../../../types/modal';
import { Transporter } from './style';

function GroupAddModal({
  controller,
  showGroupCreate,
  showGroupJoin,
}: {
  controller: ModalController;
  showGroupCreate: () => void;
  showGroupJoin: () => void;
}) {
  const TransporterComponent = (
    <>
      <Transporter onClick={showGroupCreate}>그룹 만들기</Transporter>
      <Transporter onClick={showGroupJoin}>그룹 참가하기</Transporter>
    </>
  );
  return (
    <Modal
      props={{
        middleContent: TransporterComponent,
      }}
      controller={controller}
    />
  );
}

export default GroupAddModal;
