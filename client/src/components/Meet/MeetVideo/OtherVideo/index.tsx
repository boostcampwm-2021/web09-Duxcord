import { MicOffIcon, SpeakerOffIcon } from '@components/common/Icons';
import { useRef, useEffect } from 'react';
import { IMeetingUser } from '..';
import { VideoItemWrapper, VideoItem } from '../style';

function OtherVideo({ member }: { member: IMeetingUser }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current || !member.stream) return;
    ref.current.srcObject = member.stream;
  }, [member.stream]);

  useEffect(() => {
    const interval = setInterval(() => {
      const receiver = member?.pc?.getReceivers().find((r: { track: { kind: string } }) => {
        return r.track.kind === 'audio';
      });
      const source = receiver?.getSynchronizationSources()[0];
      if (source?.audioLevel && source?.audioLevel > 0.001) {
        ref.current?.classList.add('saying');
      } else {
        ref.current?.classList.remove('saying');
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [member]);

  return (
    <VideoItemWrapper>
      <VideoItem muted={!member.speaker} autoPlay playsInline ref={ref} />
      <p>{member?.username}</p>
      {member.mic || <MicOffIcon />}
      {member.speaker || <SpeakerOffIcon />}
      {member.cam || (
        <img src={member?.thumbnail || '/images/default_profile.png'} alt="profile"></img>
      )}
    </VideoItemWrapper>
  );
}
export default OtherVideo;
