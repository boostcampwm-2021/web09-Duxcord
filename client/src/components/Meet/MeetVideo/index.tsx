import React, { useState, useEffect, useRef } from 'react';
import { useUserDevice } from '../../../hooks/useUserDevice';
import { VideoItem } from './style';

function MeetButton() {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const { mic, cam } = useUserDevice();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function getMedia() {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(currentStream);
        if (myVideoRef.current) myVideoRef.current.srcObject = currentStream;
      } catch (e) {
        console.log(e);
      }
    }
    getMedia();
  }, []);

  useEffect(() => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = mic;
      });
      myStream.getVideoTracks().forEach((track) => {
        track.enabled = cam;
      });
    }
  }, [myStream, mic, cam]);

  return (
    <div>
      <VideoItem autoPlay playsInline ref={myVideoRef}></VideoItem>
    </div>
  );
}

export default MeetButton;
