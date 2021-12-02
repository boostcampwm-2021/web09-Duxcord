import React, { useEffect, useRef } from 'react';

import { useMeeting, useUserDevice } from '@hooks/index';
import { playSoundEffect, SoundEffect } from '@utils/playSoundEffect';
import OtherVideo from './OtherVideo';
import MeetButton from './MeetButton';
import FocusedVideo from './FocusedVideo';
import MyVideo from './MyVideo';
import { Videos, VideoSection } from './style';

function MeetVideo() {
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoCount = videoWrapperRef.current && videoWrapperRef.current.childElementCount;
  const { mic, cam, speaker } = useUserDevice();

  const {
    myVideoRef,
    myScreenRef,
    screenShare,
    onScreenShareClick,
    meetingMembers,
    selectVideo,
    deselectVideo,
    selectedVideo,
  } = useMeeting();

  useEffect(() => {
    playSoundEffect(SoundEffect.JoinMeeting);

    return () => {
      playSoundEffect(SoundEffect.LeaveMeeting);
    };
  }, []);

  return (
    <VideoSection>
      {selectedVideo && <FocusedVideo selectedVideo={selectedVideo} onClick={deselectVideo} />}
      <Videos ref={videoWrapperRef} videoCount={videoCount || 0} focused={selectedVideo !== null}>
        <MyVideo
          myVideoRef={myVideoRef}
          myScreenRef={myScreenRef}
          cam={cam}
          mic={mic}
          speaker={speaker}
          screenShare={screenShare}
        />
        {meetingMembers.map((member) => (
          <OtherVideo
            key={member.socketID}
            member={member}
            muted={!speaker}
            selectVideo={selectVideo}
            selectedVideo={selectedVideo}
          />
        ))}
      </Videos>
      <MeetButton screenShare={screenShare} onScreenShareClick={onScreenShareClick} />
    </VideoSection>
  );
}

export default MeetVideo;
