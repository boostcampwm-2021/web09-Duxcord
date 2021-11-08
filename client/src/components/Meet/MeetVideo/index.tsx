import React, {useEffect, useRef} from 'react';
import { useUserDevice } from '../../../hooks/useUserDevice';
import { VideoItem } from './style';

function MeetButton() {
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const { mic, cam } = useUserDevice();

  useEffect(() => {
    let myStream;

    async function getMedia(audio: boolean, video: boolean) {  
      try {
        myStream = await navigator.mediaDevices.getUserMedia({ audio, video });
        if (myVideoRef.current) myVideoRef.current.srcObject = myStream;
      } catch(e) {
        console.log(e)
      }
    }
    getMedia(mic, cam)
  }, [mic, cam])
  

  return (
    <div>
      <VideoItem autoPlay playsInline ref={myVideoRef}></VideoItem>
    </div>
  )
}

export default MeetButton;
