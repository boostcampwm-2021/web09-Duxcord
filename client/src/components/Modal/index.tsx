import React from 'react';
import { ModalController, ModalData } from '../../types/modal';
import { BottomRightButton, Bottom, Background, Wrapper, Title, SubTitle } from './style';

function Modal({
  props: { title, subTitle, middleContent, bottomRightButton },
  controller: { hide, previous },
}: {
  props: ModalData;
  controller: ModalController;
}) {
  return (
    <Background onClick={hide}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'right' }}>
          <img src="/icons/btn-close-modal.svg" alt="close modal" onClick={hide} />
        </div>
        {title && <Title>{title}</Title>}
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
        <div>{middleContent}</div>
        {bottomRightButton && (
          <Bottom>
            {previous !== null ? (
              <div onClick={previous}>이전</div>
            ) : (
              <div onClick={hide}>닫기</div>
            )}
            <BottomRightButton
              color={bottomRightButton.color}
              onClick={bottomRightButton.onClickHandler}
            >
              {bottomRightButton.text}
            </BottomRightButton>
          </Bottom>
        )}
      </Wrapper>
    </Background>
  );
}

export default Modal;
