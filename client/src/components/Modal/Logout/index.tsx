import React from 'react';
import { useHistory } from 'react-router';

import { useToast } from '@hooks/index';
import { ModalController } from '@customTypes/modal';
import Colors from '@styles/Colors';
import { TOAST_MESSAGE } from '@utils/constants/MESSAGE';
import { postLogout } from '@api/postLogout';
import { URL } from '@utils/constants/URL';
import Modal from '..';
import { MiddlePart } from './style';

function LogoutModal({ controller: { hide, show } }: { controller: ModalController }) {
  const history = useHistory();
  const { fireToast } = useToast();
  const logOut = async () => {
    const isSuccess = await postLogout();
    if (isSuccess) history.replace(URL.LOGIN);
    fireToast({ message: TOAST_MESSAGE.SUCCESS.LOGOUT, type: 'success' });
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
