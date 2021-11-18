import { MicOffIcon, SpeakerOffIcon } from '@components/common/Icons';
import { useRef, useEffect } from 'react';
import { IMeetingUser } from '..';
import { VideoItemWrapper, VideoItem } from '../style';

function OtherVideo({
  member: { socketID, loginID, username, thumbnail, cam, speaker, mic, stream, screen, pc },
  muted,
}: {
  member: IMeetingUser;
  muted: boolean;
}) {
  const camRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

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
      <VideoItemWrapper>
        <VideoItem muted={muted} autoPlay playsInline ref={camRef} />
        <p>{`${username}(${loginID})`}</p>
        {mic || <MicOffIcon />}
        {speaker || <SpeakerOffIcon />}
        {cam || <img src={thumbnail || '/images/default_profile.png'} alt="profile"></img>}
      </VideoItemWrapper>
      {screen && (
        <VideoItemWrapper>
          <VideoItem key={socketID} muted={muted} autoPlay playsInline ref={screenRef} />
          <p>{`${username}(${loginID})님의 화면`}</p>
        </VideoItemWrapper>
      )}
    </>
  );
}
export default OtherVideo;
