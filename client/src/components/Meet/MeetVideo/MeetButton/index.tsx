import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { useSelectedGroup } from '@hooks/index';
import { URL } from 'src/api/URL';
import { CaptureIcon, MeetingStopIcon, ScreenShareStartIcon } from '@components/common/Icons';
import { DarkRedButton, GrayButton, MeetButtonWrapper } from './style';
import { capture } from 'src/utils/capture';

function MeetButton({ onScreenShareClick }: { onScreenShareClick: () => void }) {
  const selectedGroup = useSelectedGroup();
  const dispatch = useDispatch();
  const history = useHistory();

  const onMeetingStopClick = () => {
    dispatch(
      setSelectedChannel({
        type: '',
        id: null,
        name: '',
      }),
    );
    history.replace(URL.groupPage(selectedGroup.id));
  };

  const onMeetingCaptureClick = () => {
    capture();
  };

  return (
    <MeetButtonWrapper>
      <GrayButton onClick={onScreenShareClick}>
        <ScreenShareStartIcon />
      </GrayButton>
      <GrayButton onClick={onMeetingCaptureClick}>
        <CaptureIcon />
      </GrayButton>
      <DarkRedButton onClick={onMeetingStopClick}>
        <MeetingStopIcon />
      </DarkRedButton>
    </MeetButtonWrapper>
  );
}

export default MeetButton;
