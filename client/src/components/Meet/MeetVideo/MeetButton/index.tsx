import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { useSelectedGroup, useToast } from '@hooks/index';
import { URL } from '@utils/constraints/URL';
import { TOAST_MESSAGE } from '@utils/constraints/MESSAGE';
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
    history.replace(URL.GROUP(selectedGroup.id));
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
