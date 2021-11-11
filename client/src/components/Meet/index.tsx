import React from 'react';
import MeetVideo from './MeetVideo';
import MeetButton from './MeetButton';
import { MeetWrapper, VideoSection } from './style';
import MeetChat from './MeetChat';

function Meet() {
  return (
    <MeetWrapper>
      <MeetChat />
      <VideoSection>
        <MeetVideo />
        <MeetButton />
      </VideoSection>
    </MeetWrapper>
  );
}

export default Meet;
