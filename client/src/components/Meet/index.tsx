import React from 'react';

import MeetVideo from './MeetVideo';
import MeetChat from './MeetChat';
import { MeetWrapper } from './style';

function Meet() {
  return (
    <MeetWrapper>
      <MeetChat />
      <MeetVideo />
    </MeetWrapper>
  );
}

export default Meet;
