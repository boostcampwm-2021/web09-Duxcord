import React, { useRef, useEffect } from 'react';

import { CameraOnIcon, MicOffIcon, SpeakerOffIcon } from '@components/common/Icons';

import {
  VideoWrapper,
  Video,
  Thumbnail,
  DeviceStatus,
  ThumbnailWrapper,
  SelectVideoIndicator,
} from '../style';
import { MeetingMember, SelectedVideo } from '@customTypes/meet';

function OtherVideo({
  member: { socketID, loginID, username, thumbnail, cam, speaker, mic, stream, screen, pc },
  muted,
  selectVideo,
  selectedVideo,
}: {
  member: MeetingMember;
  muted: boolean;
  selectVideo: (videoInfo: SelectedVideo) => () => void;
  selectedVideo: SelectedVideo | null;
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
      <VideoWrapper
        onClick={selectVideo({
          ...videoInfo,
          stream: stream,
          isScreen: false,
        })}
      >
        <Video muted={muted} autoPlay playsInline ref={camRef} />
        <ThumbnailWrapper>
          {cam || (
            <Thumbnail src={thumbnail || '/images/default_profile.png'} alt="profile"></Thumbnail>
          )}
        </ThumbnailWrapper>
        <p>{`${username}(${loginID})`}</p>
        <DeviceStatus>
          {mic || <MicOffIcon />}
          {speaker || <SpeakerOffIcon />}
        </DeviceStatus>
        {stream && selectedVideo?.stream?.id === stream?.id && (
          <SelectVideoIndicator>
            <CameraOnIcon />
          </SelectVideoIndicator>
        )}
      </VideoWrapper>
      {screen && (
        <VideoWrapper
          onClick={selectVideo({
            ...videoInfo,
            stream: screen,
            isScreen: true,
          })}
        >
          <Video key={socketID} muted={muted} autoPlay playsInline ref={screenRef} />
          <p>{`${username}(${loginID}) 님의 화면`}</p>
          {screen && selectedVideo?.stream?.id === screen?.id && (
            <SelectVideoIndicator>
              <CameraOnIcon />
            </SelectVideoIndicator>
          )}
        </VideoWrapper>
      )}
    </>
  );
}
export default OtherVideo;
