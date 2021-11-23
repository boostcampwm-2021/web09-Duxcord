import React, { useEffect, useState } from 'react';

import { ToastData } from '@customTypes/toast';
import { GridWrapper, Line, Wrapper } from './style';

export default function ToastItem({ id, message, type, duration }: ToastData) {
  const [leftTime, setLeftTime] = useState<number>(duration! / 1000);
  useEffect(() => {
    const setDurationInterval = setInterval(() => setLeftTime((prev: number) => prev - 1), 1000);

    return () => clearInterval(setDurationInterval);
  });
  return (
    <Wrapper>
      <GridWrapper color={type}>
        <div>{message}</div>
        <div>{leftTime}</div>
      </GridWrapper>
      <Line type={type} duration={duration! / 1000} />
    </Wrapper>
  );
}
