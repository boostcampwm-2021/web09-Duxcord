import React from 'react';

import { useSelectedGroup, useToast } from '@hooks/index';
import { TOAST_MESSAGE } from '@utils/constants/index';
import Colors from '@styles/Colors';
import Modal from '..';
import { CodeWrapper } from './style';

function GroupInviteModal({ controller: { hide, show } }: { controller: ModalController }) {
  const selectedGroup = useSelectedGroup();
  const { fireToast } = useToast();

  const pasteGroupCode = async () => {
    try {
      await window.navigator.clipboard.writeText(selectedGroup.code);
      fireToast({ message: TOAST_MESSAGE.SUCCESS.GROUP_CODE_COPY, type: 'success' });
    } catch (error) {
      fireToast({ message: TOAST_MESSAGE.ERROR.GROUP_CODE_COPY, type: 'warning' });
    }
  };

  const CodeComponent = <CodeWrapper onClick={pasteGroupCode}>{selectedGroup.code}</CodeWrapper>;

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
      controller={{ hide, show }}
    />
  );
}

export default GroupInviteModal;
