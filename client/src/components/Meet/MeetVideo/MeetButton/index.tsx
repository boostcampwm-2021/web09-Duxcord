import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { setSelectedChannel } from '@redux/selectedChannel/slice';
import { useSelectedGroup } from '@hooks/index';
import { URL } from 'src/api/URL';
import { MeetingStopIcon, ScreenShareStartIcon } from '@components/common/Icons';
import { MeetButtonWrapper } from './style';

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

  return (
    <MeetButtonWrapper>
      <button onClick={onScreenShareClick}>
        <ScreenShareStartIcon />
      </button>
      <button onClick={onMeetingStopClick}>
        <MeetingStopIcon />
      </button>
    </MeetButtonWrapper>
  );
}

export default MeetButton;
