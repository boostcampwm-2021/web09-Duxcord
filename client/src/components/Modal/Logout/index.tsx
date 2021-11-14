import { useHistory } from 'react-router';
import Modal from '..';
import { ModalController } from '@customTypes/modal';

import Colors from '@styles/Colors';
import { MiddlePart } from './style';
import { postLogout } from '../../../api/postLogout';
import { API_URL } from '../../../api/API_URL';

function LogoutModal({ controller: { hide, show } }: { controller: ModalController }) {
  const history = useHistory();
  const finishModal = () => hide();
  const logOut = async () => {
    const isSuccess = await postLogout();
    if (isSuccess) history.push(API_URL.page.loginPage);
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
      controller={{ hide: finishModal, show }}
    />
  );
}

export default LogoutModal;
