import React from 'react';
import EmptyWrapper from './style';

function Empty() {
  return (
    <EmptyWrapper>
      <div>
        <img src="/images/default_profile.png" />
        <p>채널을 선택해주세요!</p>
      </div>
    </EmptyWrapper>
  );
}

export default Empty;
