import { useCallback } from 'react';

import { SOCKET } from '@constants/index';
import { socket } from '@utils/index';

const ICE_SERVER_URL = 'stun:stun.l.google.com:19302';

const PEER_CONNECTION_CONFIG = {
  iceServers: [
    {
      urls: ICE_SERVER_URL,
    },
  ],
};

export const useCreatePeerConnection = (
  peerConnections: React.MutableRefObject<{ [socketID: string]: RTCPeerConnection }>,
  myStreamRef: React.MutableRefObject<MediaStream | undefined>,
  myScreenStreamRef: React.MutableRefObject<MediaStream | undefined>,
  setMeetingMembers: React.Dispatch<React.SetStateAction<MeetingMember[]>>,
  streamIDMetaData: React.MutableRefObject<{ [socketID: string]: StreamIDMetaData }>,
  setSelectedVideo: React.Dispatch<React.SetStateAction<SelectedVideo | null>>,
) =>
  useCallback((socketID: string) => {
    if (peerConnections.current[socketID]) return peerConnections.current[socketID];
    const peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG);

    peerConnection.onicecandidate = ({ candidate }) => {
      if (!candidate) return;

      socket.emit(SOCKET.MEET_EVENT.CANDIDATE, {
        candidate: candidate,
        receiverID: socketID,
      });
    };

    peerConnection.onnegotiationneeded = async () => {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit(SOCKET.MEET_EVENT.OFFER, {
          offer,
          receiverID: socketID,
          streamID: {
            camera: myStreamRef.current?.id,
            screen: myScreenStreamRef.current?.id,
          },
        });
      } catch (e) {
        console.error(e);
      }
    };

    peerConnection.ontrack = ({ streams }) => {
      setMeetingMembers((members): MeetingMember[] => {
        const member = members.find((member) => member.socketID === socketID);
        if (!member) return members;

        const newStream = streams[0];
        const { camera, screen } = streamIDMetaData.current[member.socketID];

        if (camera === newStream.id) {
          member.stream = newStream;
        } else if (screen === newStream.id) {
          newStream.onremovetrack = () => {
            setSelectedVideo((selectedVideo) =>
              selectedVideo?.socketID === member?.socketID ? null : selectedVideo,
            );
            setMeetingMembers((members) => {
              const member = members.find((member) => member.socketID === socketID);
              if (!member) return members;
              delete member.screen;
              return [...members];
            });
          };
          member.screen = newStream;
        }

        return [...members];
      });
    };

    myStreamRef.current?.getTracks().forEach((track) => {
      if (myStreamRef.current) peerConnection.addTrack(track, myStreamRef.current);
    });

    myScreenStreamRef.current?.getTracks().forEach((track) => {
      if (myScreenStreamRef.current) peerConnection.addTrack(track, myScreenStreamRef.current);
    });

    return peerConnection;
  }, []);
