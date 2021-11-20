import React from 'react';

import MeetVideo from './MeetVideo';
import MeetChat from './MeetChat';
import { MeetWrapper, VideoSection } from './style';

function Meet() {
  return (
    <MeetWrapper>
      <MeetChat />
      <VideoSection>
        <MeetVideo />
      </VideoSection>
    </MeetWrapper>
  );
}

export default Meet;
