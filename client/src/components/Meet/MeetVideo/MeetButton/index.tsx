import React from 'react';

import { MeetingStopIcon, ScreenShareStartIcon } from '@components/common/Icons';
import { MeetButtonWrapper } from './style';

function MeetButton({ onClick }: { onClick: () => void }) {
  return (
    <MeetButtonWrapper>
      <button onClick={onClick}>
        <ScreenShareStartIcon />
      </button>
      <button>
        <MeetingStopIcon />
      </button>
    </MeetButtonWrapper>
  );
}

export default MeetButton;
