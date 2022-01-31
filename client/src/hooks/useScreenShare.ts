import { useState, useRef, useCallback, useEffect } from 'react';

export const useScreenShare = (
  peerConnections: React.MutableRefObject<{ [socketID: string]: RTCPeerConnection }>,
) => {
  const [screenShare, setScreenShare] = useState(false);
  const myScreenRef = useRef<HTMLVideoElement>(null);
  const myScreenStreamRef = useRef<MediaStream>();
  const getMyScreen = useCallback(async () => {
    try {
      const myScreen = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });

      if (myScreenRef.current) myScreenRef.current.srcObject = myScreen;

      myScreen.getTracks().forEach((track: MediaStreamTrack) => {
        track.onended = () => setScreenShare(false);
        Object.values(peerConnections.current).forEach((pc) => pc.addTrack(track, myScreen));
      });

      myScreenStreamRef.current = myScreen;
    } catch (e) {
      console.error(e);
      setScreenShare(false);
    }
  }, []);

  const onScreenShareClick = useCallback(
    () =>
      setScreenShare((screenShare) => {
        if (screenShare) {
          const tracks = myScreenStreamRef.current?.getTracks();
          tracks?.forEach((track) => track.stop());
          return false;
        } else {
          return true;
        }
      }),
    [],
  );

  useEffect(() => {
    if (screenShare) getMyScreen();
    else {
      Object.values(peerConnections.current).forEach((peerConnection) => {
        const senders = peerConnection.getSenders();
        const tracks = myScreenStreamRef.current?.getTracks();
        const screenSenders = senders.filter((sender) =>
          tracks?.some((track) => track.id === sender.track?.id),
        );
        screenSenders.forEach((sender) => peerConnection.removeTrack(sender));
      });
      myScreenStreamRef.current = undefined;
    }
  }, [screenShare, getMyScreen]);
  return { screenShare, setScreenShare, myScreenRef, myScreenStreamRef, onScreenShareClick };
};
