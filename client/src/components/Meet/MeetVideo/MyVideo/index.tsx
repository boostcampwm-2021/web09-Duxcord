import React, { RefObject } from 'react';

import { MicOffIcon, SpeakerOffIcon } from '@components/common/Icons';
import { useUserdata } from '@hooks/index';
import { VideoWrapper, Video, ThumbnailWrapper, Thumbnail, DeviceStatus } from '../style';

interface MyVideoProps {
  myVideoRef: RefObject<HTMLVideoElement>;
  myScreenRef: RefObject<HTMLVideoElement>;
  cam: boolean;
  mic: boolean;
  speaker: boolean;
  screenShare: boolean;
}

function MyVideo({ myVideoRef, myScreenRef, cam, mic, speaker, screenShare }: MyVideoProps) {
  const { userdata } = useUserdata();
  return (
    <>
      <VideoWrapper>
        <Video autoPlay playsInline muted ref={myVideoRef} className={cam ? 'user-video' : ''} />
        <ThumbnailWrapper>
          {cam || (
            <Thumbnail src={userdata?.thumbnail || '/images/default_profile.png'} alt="profile" />
          )}
        </ThumbnailWrapper>
        <p>{`${userdata?.username}(${userdata?.loginID})`}</p>
        <DeviceStatus>
          {mic || <MicOffIcon />}
          {speaker || <SpeakerOffIcon />}
        </DeviceStatus>
      </VideoWrapper>
      {screenShare && (
        <VideoWrapper>
          <Video autoPlay playsInline muted ref={myScreenRef} />
          <p>{`${userdata?.username}(${userdata?.loginID}) 님의 화면`}</p>
        </VideoWrapper>
      )}
    </>
  );
}

export default MyVideo;
