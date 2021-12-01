import { useState, useRef, useEffect } from 'react';

import { SOCKET } from '@utils/constants/SOCKET_EVENT';
import {
  Socket,
  socket,
  highlightMyVolume,
  playSoundEffect,
  SoundEffect,
  getMyStream,
  applyDeviceStatus,
} from '@utils/index';

import {
  useUserdata,
  useSelectedChannel,
  useUserDevice,
  useSelectedGroup,
  useSelectVideo,
  useScreenShare,
  useCreatePeerConnection,
  useControlMyStream,
  useUpdateMembersDeviceState,
} from '.';

export const useMeeting = () => {
  const { userdata } = useUserdata({ suspense: true });
  const { id } = useSelectedChannel();
  const { mic, cam, speaker } = useUserDevice();
  const { code } = useSelectedGroup();
  const [meetingMembers, setMeetingMembers] = useState<MeetingMember[]>([]);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const myStreamRef = useRef<MediaStream>();
  const peerConnections = useRef<{ [socketID: string]: RTCPeerConnection }>({});
  const streamIDMetaData = useRef<{ [socketID: string]: StreamIDMetaData }>({});

  const { selectVideo, deselectVideo, selectedVideo, setSelectedVideo } = useSelectVideo();

  const { screenShare, myScreenRef, myScreenStreamRef, onScreenShareClick } =
    useScreenShare(peerConnections);

  const createPeerConnection = useCreatePeerConnection(
    peerConnections,
    myStreamRef,
    myScreenStreamRef,
    setMeetingMembers,
    streamIDMetaData,
    setSelectedVideo,
  );

  useEffect(() => {
    if (id === null || userdata === undefined) return;
    const { loginID, username, thumbnail } = userdata;

    Socket.joinChannel({ channelType: 'meeting', id });
    socket.on(SOCKET.MEET_EVENT.ALL_MEETING_MEMBERS, async (members) => {
      myStreamRef.current = await getMyStream();
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = myStreamRef.current;
        highlightMyVolume(myStreamRef.current, myVideoRef.current);
      }
      if (!myStreamRef.current) return;
      applyDeviceStatus({ stream: myStreamRef.current, video: cam, audio: mic });

      members.forEach(async (member: MeetingMember) => {
        try {
          const pc = createPeerConnection(member.socketID);
          if (!pc) return;
          setMeetingMembers((members) => [...members, { ...member, pc }]);
          peerConnections.current = { ...peerConnections.current, [member.socketID]: pc };
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socket.emit(SOCKET.MEET_EVENT.OFFER, {
            offer,
            receiverID: member.socketID,
            member: { loginID, username, thumbnail, deviceState: { mic, cam, speaker } },
            streamID: {
              camera: myStreamRef.current?.id,
              screen: myScreenStreamRef.current?.id,
            },
          });
        } catch (e) {
          console.error(SOCKET.MEET_EVENT.ALL_MEETING_MEMBERS, e);
        }
      });
    });

    socket.on(SOCKET.MEET_EVENT.OFFER, async ({ offer, member, streamID, senderID }) => {
      try {
        const pc = createPeerConnection(senderID);
        if (!pc) return;
        setMeetingMembers((members) => {
          if (members.some((existingMember) => existingMember.socketID === senderID))
            return members;
          else {
            playSoundEffect(SoundEffect.JoinMeeting);
            return [...members, { ...member, socketID: senderID, pc }];
          }
        });
        streamIDMetaData.current[senderID] = streamID;
        peerConnections.current[senderID] = pc;
        pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        pc.setLocalDescription(answer);
        socket.emit(SOCKET.MEET_EVENT.ANSWER, {
          answer,
          receiverID: senderID,
          streamID: {
            camera: myStreamRef.current?.id,
            screen: myScreenStreamRef.current?.id,
          },
        });
      } catch (e) {
        console.error(e);
      }
    });

    socket.on(SOCKET.MEET_EVENT.ANSWER, async ({ answer, senderID, streamID }) => {
      try {
        const pc = peerConnections.current[senderID];
        if (!pc) return;
        streamIDMetaData.current[senderID] = streamID;
        await pc.setRemoteDescription(answer);
      } catch (e) {
        console.error(e);
      }
    });

    socket.on(SOCKET.MEET_EVENT.CANDIDATE, async ({ candidate, senderID }) => {
      try {
        const pc = peerConnections.current[senderID];
        if (!pc) return;
        await pc.addIceCandidate(candidate);
      } catch (e) {
        console.error(e);
      }
    });

    socket.on(SOCKET.MEET_EVENT.LEAVE_MEMBER, (memberID) => {
      if (!peerConnections.current[memberID]) return;
      peerConnections.current[memberID].close();
      delete peerConnections.current[memberID];
      setSelectedVideo((selectedVideo) =>
        selectedVideo?.socketID === memberID ? null : selectedVideo,
      );
      setMeetingMembers((members) => members.filter((member) => member.socketID !== memberID));
      playSoundEffect(SoundEffect.LeaveMeeting);
    });

    socket.emit(SOCKET.MEET_EVENT.JOIN_MEETING, id, code, {
      loginID,
      username,
      thumbnail,
      deviceState: { mic, cam, speaker },
    });

    return () => {
      Socket.leaveChannel({ channelType: 'meeting', id });
      socket.off(SOCKET.MEET_EVENT.ALL_MEETING_MEMBERS);
      socket.off(SOCKET.MEET_EVENT.OFFER);
      socket.off(SOCKET.MEET_EVENT.ANSWER);
      socket.off(SOCKET.MEET_EVENT.CANDIDATE);
      socket.off(SOCKET.MEET_EVENT.LEAVE_MEMBER);
      socket.emit(SOCKET.MEET_EVENT.LEAVE_MEETING, code);

      Object.values(peerConnections.current).forEach((pc) => pc.close());
      myStreamRef.current?.getTracks().forEach((track) => track.stop());
      myScreenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [id, userdata]);

  useControlMyStream(myStreamRef);

  useUpdateMembersDeviceState(setMeetingMembers, setSelectedVideo);

  return {
    selectedVideo,
    deselectVideo,
    myVideoRef,
    myScreenRef,
    screenShare,
    onScreenShareClick,
    meetingMembers,
    selectVideo,
  };
};
