import React, { useEffect, useState } from 'react';

import { ToastData } from '@customTypes/toast';
import { InnerWrapper, Line, Wrapper } from './style';

export default function ToastItem({ message, type, duration }: ToastData) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const setExitTimeout = setTimeout(() => {
      setIsClosing(true);
      clearTimeout(setExitTimeout);
    }, duration!);

    return () => clearTimeout(setExitTimeout);
  }, []);

  return (
    <Wrapper isClosing={isClosing}>
      <InnerWrapper color={type}>
        <div>{message}</div>
      </InnerWrapper>
      <Line type={type} duration={duration! / 1000} />
    </Wrapper>
  );
}
