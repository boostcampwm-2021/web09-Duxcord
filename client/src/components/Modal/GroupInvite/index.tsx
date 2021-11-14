import React, { useState } from 'react';
import Modal from '..';
import { useSelectedGroup } from '../../../hooks';
import Colors from '../../../styles/Colors';
import { ModalController } from '../../../types/modal';
import { CodeWrapper } from './style';

const pasteCodeMessage = {
  IDLE: '',
  SUCCESS: '복사가 완료되었습니다.',
  FAIL: '복사에 실패했습니다. 다시 시도해주세요',
};

function GroupInviteModal({ controller: { hide, show } }: { controller: ModalController }) {
  const selectedGroup = useSelectedGroup();
  const [copied, setCopied] = useState(pasteCodeMessage.IDLE);

  const pasteGroupCode = async () => {
    try {
      await window.navigator.clipboard.writeText(selectedGroup.code);
      setCopied(pasteCodeMessage.SUCCESS);
    } catch (error) {
      console.error(error);
      setCopied(pasteCodeMessage.FAIL);
    }
  };

  const finishModal = () => {
    setCopied(pasteCodeMessage.IDLE);
    hide();
  };

  const CodeComponent = (
    <>
      <CodeWrapper onClick={pasteGroupCode}>{selectedGroup.code}</CodeWrapper>
      <div>{copied}</div>
    </>
  );

  return (
    <Modal
      props={{
        title: '그룹 초대하기',
        middleContent: CodeComponent,
        bottomRightButton: {
          text: '초대 코드 복사하기',
          color: Colors.Blue,
          onClickHandler: pasteGroupCode,
        },
      }}
      controller={{ hide: finishModal, show }}
    />
  );
}

export default GroupInviteModal;
