import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { resetSelectedChannel } from '@redux/selectedChannel/slice';
import { useSelectedGroup, useToast } from '@hooks/index';
import { URL } from '@utils/constants/URL';
import { TOAST_MESSAGE } from '@utils/constants/MESSAGE';
import { capture } from '@utils/capture';
import {
  CaptureIcon,
  MeetingStopIcon,
  ScreenShareStartIcon,
  ScreenShareStopIcon,
} from '@components/common/Icons';
import { DarkRedButton, GreenButton, YellowButton, MeetButtonWrapper } from './style';

function MeetButton({
  onScreenShareClick,
  screenShare,
}: {
  onScreenShareClick: () => void;
  screenShare: boolean;
}) {
  const selectedGroup = useSelectedGroup();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fireToast } = useToast();

  const onMeetingStopClick = () => {
    dispatch(resetSelectedChannel());
    navigate(URL.GROUP(selectedGroup.id), { replace: true });
  };

  const onMeetingCaptureClick = async () => {
    try {
      await capture();
      fireToast({ message: TOAST_MESSAGE.SUCCESS.CAPTURE, type: 'success' });
    } catch (error) {
      if (typeof error === 'string') fireToast({ message: error, type: 'warning' });
      else {
        fireToast({ message: TOAST_MESSAGE.ERROR.CAPTURE.COMMON, type: 'warning' });
        console.log(error);
      }
    }
  };

  return (
    <MeetButtonWrapper>
      <GreenButton onClick={onScreenShareClick}>
        {screenShare ? <ScreenShareStopIcon /> : <ScreenShareStartIcon />}
      </GreenButton>
      <YellowButton onClick={onMeetingCaptureClick}>
        <CaptureIcon />
      </YellowButton>
      <DarkRedButton onClick={onMeetingStopClick}>
        <MeetingStopIcon />
      </DarkRedButton>
    </MeetButtonWrapper>
  );
}

export default MeetButton;
