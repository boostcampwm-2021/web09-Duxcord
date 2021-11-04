import React from 'react';
import Modal from '..';
import colors from '../../../styles/colors';
import { Input } from './style';

function GroupJoinModal({ controller }: { controller: any }) {
  const onClickHandler = () => {};
  const { hidden, setHidden } = controller;

  const InputComponent = <Input placeholder='그룹 코드를 입력해주세요' />;
  return (
    <Modal
      props={{
        title: '그룹 참가하기',
        subTitle: '아래에 초대 코드를 입력해 그룹에 참가하세요',
        middleContent: InputComponent,
        bottomRightButton: {
          title: '그룹 참가하기',
          color: colors.Blue,
          onClickHandler: onClickHandler,
        },
      }}
      controller={{ hidden, setHidden }}
    />
  );
}

export default GroupJoinModal;
