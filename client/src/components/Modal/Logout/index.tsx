import React from 'react';
import { useNavigate } from 'react-router';

import { useToast } from '@hooks/index';
import { TOAST_MESSAGE, URL } from '@constants/index';
import { postLogout } from '@api/index';
import Colors from '@styles/Colors';
import Modal from '..';
import { MiddlePart } from './style';

function LogoutModal({ controller: { hide, show } }: { controller: ModalController }) {
  const navigate = useNavigate();
  const { fireToast } = useToast();
  const logOut = async () => {
    const isSuccess = await postLogout();
    if (isSuccess) {
      navigate(URL.LOGIN, { replace: true });
      window.location.reload();
    } else {
      fireToast({ message: TOAST_MESSAGE.ERROR.COMMON, type: 'warning' });
    }
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
