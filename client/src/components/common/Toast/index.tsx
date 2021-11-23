import React from 'react';

import { useToasts } from '@hooks/index';
import { Wrapper } from './style';
import ToastItem from './Item';

export default function Toast() {
  const toasts = useToasts();
  if (toasts.length === 0) return <></>;
  return (
    <Wrapper>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      ))}
    </Wrapper>
  );
}
