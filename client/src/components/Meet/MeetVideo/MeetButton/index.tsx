import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { useSelectedGroup, useToast } from '@hooks/index';
import { URL } from 'src/api/URL';
import { TOAST_MESSAGE } from 'src/utils/message';
import { capture } from 'src/utils/capture';
import { CaptureIcon, MeetingStopIcon, ScreenShareStartIcon } from '@components/common/Icons';
import { DarkRedButton, GrayButton, MeetButtonWrapper } from './style';

function MeetButton({ onScreenShareClick }: { onScreenShareClick: () => void }) {
  const selectedGroup = useSelectedGroup();
  const dispatch = useDispatch();
  const history = useHistory();
  const { fireToast } = useToast();

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

  const onMeetingCaptureClick = async () => {
    try {
      await capture();
      fireToast({ message: TOAST_MESSAGE.SUCCESS.CAPTURE, type: 'success' });
    } catch (error) {
      fireToast({ message: TOAST_MESSAGE.ERROR.CAPTURE, type: 'warning' });
    }
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
