import React from 'react';
import { ModalData } from '../../types/modal';
import {
  BottomRightButton,
  Bottom,
  Background,
  Wrapper,
  Title,
  SubTitle,
} from './style';

function Modal({ props, controller }: { props: ModalData; controller: any }) {
  const { title, subTitle, middleContent, bottomRightButton } = props;
  const { hidden, setHidden } = controller;
  const hide = () => {
    setHidden(true);
  };
  return (
    <Background onClick={hide} hidden={hidden}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'right' }}>
          <img
            src='/icons/btn-close-modal.svg'
            alt='close modal'
            onClick={hide}
          />
        </div>
        <Title>{title}</Title>
        <SubTitle>{subTitle}</SubTitle>
        <div>{middleContent}</div>
        <Bottom>
          <div onClick={hide}>닫기</div>
          <BottomRightButton
            color={bottomRightButton.color}
            onClick={() => bottomRightButton.onClickHandler()}
          >
            {bottomRightButton.title}
          </BottomRightButton>
        </Bottom>
      </Wrapper>
    </Background>
  );
}

export default Modal;
