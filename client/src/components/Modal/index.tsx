import React from 'react';
import { ModalController, ModalData } from '../../types/modal';
import { BottomRightButton, Bottom, Background, Wrapper, Title, SubTitle } from './style';

function Modal({
  props: {
    title,
    subTitle,
    middleContent,
    bottomRightButton: { text, onClickHandler, color },
  },
  controller: { hidden, hide },
}: {
  props: ModalData;
  controller: ModalController;
}) {
  return (
    <Background onClick={hide} hidden={hidden}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'right' }}>
          <img src="/icons/btn-close-modal.svg" alt="close modal" onClick={hide} />
        </div>
        <Title>{title}</Title>
        <SubTitle>{subTitle}</SubTitle>
        <div>{middleContent}</div>
        <Bottom>
          <div onClick={hide}>닫기</div>
          <BottomRightButton color={color} onClick={onClickHandler}>
            {text}
          </BottomRightButton>
        </Bottom>
      </Wrapper>
    </Background>
  );
}

export default Modal;
