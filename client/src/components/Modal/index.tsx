import React, { useState } from 'react';
import { ModalController, ModalData } from '@customTypes/modal';
import { ModalCloseIcon } from '../common/Icons';
import {
  BottomRightButton,
  Bottom,
  Background,
  Wrapper,
  Title,
  SubTitle,
  BottomLeftButton,
} from './style';

function Modal({
  props: { title, subTitle, middleContent, bottomRightButton },
  controller: { hide, previous },
}: {
  props: ModalData;
  controller: ModalController;
}) {
  const [hidden, setHidden] = useState(false);

  const hideModal = () => {
    setHidden(() => true);
    setTimeout(() => {
      hide();
    }, 300);
  };

  return (
    <Background onClick={hideModal} isHidden={hidden}>
      <Wrapper onClick={(e) => e.stopPropagation()} isHidden={hidden}>
        <div style={{ textAlign: 'right' }}>
          <ModalCloseIcon onClick={hideModal} />
        </div>
        {title && <Title>{title}</Title>}
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
        <div>{middleContent}</div>
        {bottomRightButton && (
          <Bottom>
            {previous ? (
              <BottomLeftButton onClick={previous}>이전</BottomLeftButton>
            ) : (
              <BottomLeftButton onClick={hideModal}>닫기</BottomLeftButton>
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
