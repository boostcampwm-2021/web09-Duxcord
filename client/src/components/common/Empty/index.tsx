import React from 'react';

import EmptyWrapper from './style';

interface EmptyProps {
  message: string;
}

function Empty({ message = '' }: EmptyProps) {
  return (
    <EmptyWrapper>
      <img src="/images/default_profile.png" alt="select channel" />
      <p>{message}</p>
    </EmptyWrapper>
  );
}

export default Empty;
