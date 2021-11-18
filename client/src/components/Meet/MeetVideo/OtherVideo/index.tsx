import { MicOffIcon } from '@components/common/Icons';
import { useRef, useEffect } from 'react';
import { IMeetingUser } from '..';
import { VideoItemWrapper, VideoItem } from '../style';

function OtherVideo({ member }: { member: IMeetingUser }) {
  const camRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!camRef.current || !member.stream) return;
    camRef.current.srcObject = member.stream;
  }, [member.stream]);

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
    <VideoItemWrapper>
        <VideoItem key={member.socketID} autoPlay playsInline ref={camRef} />
      <p>{member?.username}</p>
      {member.mic || <MicOffIcon />}
      {member.cam || (
        <img src={member?.thumbnail || '/images/default_profile.png'} alt="profile"></img>
      )}
    </VideoItemWrapper>
  );
}
export default OtherVideo;
