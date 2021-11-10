import React from 'react';
import MeetVideo from './MeetVideo';
import MeetButton from './MeetButton';
import { MeetWrapper } from './style';

function Meet() {
  return (
    <MeetWrapper>
      <MeetVideo />
      <MeetButton />
    </MeetWrapper>
  );
}

export default Meet;
