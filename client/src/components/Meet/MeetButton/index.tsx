import React from 'react';
import { MeetingStopIcon, ScreenShareStartIcon } from '../../common/Icons';
import { MeetButtonWrapper } from './style';

function MeetButton() {
  return (
    <MeetButtonWrapper>
      <button>
        <ScreenShareStartIcon stroke="white" />
      </button>
      <button>
        <MeetingStopIcon stroke="white" />
      </button>
    </MeetButtonWrapper>
  );
}

export default MeetButton;