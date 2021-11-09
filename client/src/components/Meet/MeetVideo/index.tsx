import React, { useState, useEffect, useRef } from 'react';
import { useSelectedChannel } from '../../../hooks/useSelectedChannel';
import { useUserDevice } from '../../../hooks/useUserDevice';
import { socket } from '../../../util/socket';
import { VideoItem } from './style';

function MeetVideo() {
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const { type, id } = useSelectedChannel();
  const { mic, cam } = useUserDevice();
  const channelID = type + id;
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const myPeerConnnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
  });

  useEffect(() => {
    function handleIce(data: any) {
      socket.emit('ice', data.candidate, channelID);
    }

    function handleAddStream(data: any) {
      if (peerVideoRef.current) {
        if (peerVideoRef.current.srcObject) return;
        peerVideoRef.current.srcObject = data.streams[0];
      }
    }

    function showConnectionState(data: any) {
      console.log(myPeerConnnection.connectionState);
    }

    async function getMedia() {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
        setMyStream(currentStream);
        if (myVideoRef.current) myVideoRef.current.srcObject = currentStream;

        myPeerConnnection.addEventListener('icecandidate', handleIce);
        myPeerConnnection.addEventListener('track', handleAddStream);
        myPeerConnnection.addEventListener('connectionstatechange', showConnectionState);

        currentStream
          .getTracks()
          .forEach((track) => myPeerConnnection.addTrack(track, currentStream));
      } catch (e) {
        console.log(e);
      }
    }
    getMedia();

    socket.on('joinMeetingChannel', async () => {
      if (myPeerConnnection.signalingState !== 'stable') return;
      const offer = await myPeerConnnection.createOffer();
      myPeerConnnection.setLocalDescription(offer);
      socket.emit('offer', offer, channelID);
    });

    socket.on('offer', async (offer) => {
      if (myPeerConnnection.signalingState !== 'stable') return;
      myPeerConnnection.setRemoteDescription(offer);
      const answer = await myPeerConnnection.createAnswer();
      myPeerConnnection.setLocalDescription(answer);
      socket.emit('answer', answer, channelID);
    });

    socket.on('answer', (answer) => {
      if (myPeerConnnection.signalingState !== 'stable') return;
      myPeerConnnection.setRemoteDescription(answer);
    });

    socket.on('ice', (ice) => {
      if (myPeerConnnection.signalingState !== 'stable') return;
      myPeerConnnection.addIceCandidate(ice);
    });
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
      <VideoItem autoPlay playsInline muted ref={myVideoRef}></VideoItem>
      <VideoItem autoPlay playsInline muted ref={peerVideoRef}></VideoItem>
    </div>
  );
}

export default MeetVideo;
