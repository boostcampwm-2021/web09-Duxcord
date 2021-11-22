import React, { useEffect, useRef } from 'react';
import { SelectedVideo } from '..';
import { Video, VideoWrapper } from './style';

function FocusedVideo({
  selectedVideo,
  onClick,
}: {
  selectedVideo: SelectedVideo;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && selectedVideo.stream) videoRef.current.srcObject = selectedVideo.stream;
  }, [selectedVideo]);

  return (
    <VideoWrapper onClick={onClick}>
      <Video autoPlay playsInline ref={videoRef}>
        <p>{selectedVideo?.username}</p>
      </Video>
    </VideoWrapper>
  );
}

export default FocusedVideo;
