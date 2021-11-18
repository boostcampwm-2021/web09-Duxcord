import { MicOffIcon } from '@components/common/Icons';
import { useRef, useEffect } from 'react';
import { IMeetingUser } from '..';
import { VideoItemWrapper, VideoItem } from '../style';

function OtherVideo({ member }: { member: IMeetingUser }) {
  const camRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!camRef.current || !member.stream) return;
    camRef.current.srcObject = member.stream;
  }, [member.stream]);

  useEffect(() => {
    if (!screenRef.current || !member.screen) return;
    screenRef.current.srcObject = member.screen;
  }, [member.screen]);

  useEffect(() => {
    const interval = setInterval(() => {
      const receiver = member?.pc?.getReceivers().find((r: { track: { kind: string } }) => {
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
  }, [member]);

  return (
    <>
      <VideoItemWrapper>
        <VideoItem key={member.socketID} autoPlay playsInline ref={camRef} />
        <p>{member?.username}</p>
        {member.mic || <MicOffIcon />}
        {member.cam || (
          <img src={member?.thumbnail || '/images/default_profile.png'} alt="profile"></img>
        )}
      </VideoItemWrapper>
      {member.screen && (
        <VideoItemWrapper>
          <VideoItem key={member.socketID} autoPlay playsInline ref={screenRef} />
          <p>{member?.username + '님의 화면'}</p>
        </VideoItemWrapper>
      )}
    </>
  );
}
export default OtherVideo;
