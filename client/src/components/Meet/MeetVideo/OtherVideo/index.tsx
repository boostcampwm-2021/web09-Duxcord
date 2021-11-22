import React, { useRef, useEffect } from 'react';

import { MicOffIcon, SpeakerOffIcon } from '@components/common/Icons';
import { IMeetingUser, SelectedVideo } from '..';
import { VideoWrapper, Video, Thumbnail } from '../style';

function OtherVideo({
  member: { socketID, loginID, username, thumbnail, cam, speaker, mic, stream, screen, pc },
  muted,
  selectVideo,
}: {
  member: IMeetingUser;
  muted: boolean;
  selectVideo: (videoInfo: SelectedVideo) => (e: any) => void;
}) {
  const camRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const videoInfo = {
    socketID,
    loginID,
    username,
    thumbnail,
    stream,
    mic,
    cam,
    speaker,
  };

  useEffect(() => {
    if (!camRef.current || !stream) return;
    camRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    if (!screenRef.current || !screen) return;
    screenRef.current.srcObject = screen;
  }, [screen]);

  useEffect(() => {
    const interval = setInterval(() => {
      const receiver = pc?.getReceivers().find((r: { track: { kind: string } }) => {
        return r.track.kind === 'audio';
      });
      const source = receiver?.getSynchronizationSources()[0];
      if (source?.audioLevel && source?.audioLevel > 0.001) {
        camRef.current?.classList.add('saying');
      } else {
        camRef.current?.classList.remove('saying');
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [pc]);

  return (
    <>
      <VideoWrapper>
        <Video
          muted={muted}
          autoPlay
          playsInline
          ref={camRef}
          onClick={selectVideo({
            ...videoInfo,
            stream: stream,
            isScreen: true,
          })}
        />
        <p>{`${username}(${loginID})`}</p>
        {mic || <MicOffIcon />}
        {speaker || <SpeakerOffIcon />}
        {cam || (
          <Thumbnail src={thumbnail || '/images/default_profile.png'} alt="profile"></Thumbnail>
        )}
      </VideoWrapper>
      {screen && (
        <VideoWrapper>
          <Video
            key={socketID}
            muted={muted}
            autoPlay
            playsInline
            ref={screenRef}
            onClick={selectVideo({
              ...videoInfo,
              stream: screen,
              isScreen: true,
            })}
          />
          <p>{`${username}(${loginID})님의 화면`}</p>
        </VideoWrapper>
      )}
    </>
  );
}
export default OtherVideo;
