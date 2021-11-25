import React from 'react';
import { useHistory } from 'react-router';

import { ModalController } from '@customTypes/modal';
import Colors from '@styles/Colors';
import { TOAST_MESSAGE } from '@utils/constraints/MESSAGE';
import { postLogout } from '@api/postLogout';
import { URL } from '@utils/constraints/URL';
import Modal from '..';
import { MiddlePart } from './style';
import { useToast } from '@hooks/useToast';

function LogoutModal({ controller: { hide, show } }: { controller: ModalController }) {
  const history = useHistory();
  const { fireToast } = useToast();
  const logOut = async () => {
    const isSuccess = await postLogout();
    if (isSuccess) history.replace(URL.LOGIN);
    fireToast({ message: TOAST_MESSAGE.SUCCESS.LOGOUT, type: 'success' });
    window.location.reload();
  };

  const middleContent = <MiddlePart>정말로 로그아웃 하시겠습니까?</MiddlePart>;
  return (
    <Modal
      props={{
        title: '로그아웃',
        middleContent,
        bottomRightButton: {
          text: '로그아웃',
          color: Colors.Blue,
          onClickHandler: logOut,
        },
      }}
      controller={{ hide, show }}
    />
  );
}

export default LogoutModal;
