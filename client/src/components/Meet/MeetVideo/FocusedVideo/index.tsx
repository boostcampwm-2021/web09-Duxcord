import React, { useEffect, useRef } from 'react';

import { MicOffIcon, SpeakerOffIcon } from '@components/common/Icons';
import { SelectedVideo } from '..';
import { ThumbnailWrapper, Thumbnail } from '../style';
import { UserInfo, Video, VideoWrapper, DeviceStatus } from './style';

function FocusedVideo({
  selectedVideo: { loginID, username, stream, thumbnail, mic, cam, speaker, isScreen },
  onClick,
}: {
  selectedVideo: SelectedVideo;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <VideoWrapper onClick={onClick}>
      <Video autoPlay playsInline ref={videoRef} />
      <UserInfo>{`${username}(${loginID})${isScreen ? ' 님의 화면' : ''}`}</UserInfo>
      {isScreen || (
        <>
          <DeviceStatus>
            {mic || <MicOffIcon />}
            {speaker || <SpeakerOffIcon />}
          </DeviceStatus>
          <ThumbnailWrapper>
            {cam || (
              <Thumbnail src={thumbnail || '/images/default_profile.png'} alt="profile"></Thumbnail>
            )}
          </ThumbnailWrapper>
        </>
      )}
    </VideoWrapper>
  );
}

export default FocusedVideo;
