import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelectedChannel } from '../../../hooks/useSelectedChannel';
import { useUserdata } from '../../../hooks/useUserdata';
import { useUserDevice } from '../../../hooks/useUserDevice';
import Socket, { socket } from '../../../util/socket';
import { MeetVideoWrapper, VideoItem } from './style';

const ICE_SERVER_URL = 'stun:stun.l.google.com:19302';

const pcConfig = {
  iceServers: [
    {
      urls: ICE_SERVER_URL,
    },
  ],
};

enum ChannelType {
  CHATTING = 'chatting',
  MEETING = 'meeting',
}

enum MeetingEvent {
  JOIN_MEETING = 'joinMeeting',
  ALL_MEETING_MEMBERS = 'allMeetingMembers',
  CANDIDATE = 'candidate',
  OFFER = 'offer',
  ANSWER = 'answer',
  LEAVE_MEMBER = 'leaveMember',
  LEAVE_MEETING = 'leaveMeeting',
}

const GET_MY_STREAM = 'getMyStream';
const CREATE_PEER_CONNECTION = 'createPeerConnection';

interface IMeetingUser {
  socketID: string;
  loginID: string;
  username: string;
  thumbnail: string | null;
  stream?: MediaStream;
}

function MeetVideo() {
  const { userdata } = useUserdata();
  const { id } = useSelectedChannel();
  const { mic, cam } = useUserDevice();
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [meetingMembers, setMeetingMembers] = useState<IMeetingUser[]>([]);
  const pcs = useRef<{ [socketID: string]: RTCPeerConnection }>({});

  const videoCount = videoWrapperRef.current && videoWrapperRef.current.childElementCount;

  const getMyStream = async () => {
    try {
      const myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (myVideoRef.current) myVideoRef.current.srcObject = myStream;
      setMyStream(myStream);
    } catch (e) {
      console.error(GET_MY_STREAM, e);
    }
  };

  const createPeerConnection = useCallback(
    async (member: IMeetingUser) => {
      try {
        const pc = new RTCPeerConnection(pcConfig);

        pc.onicecandidate = (data) => {
          if (!data.candidate) return;

          socket.emit(MeetingEvent.CANDIDATE, {
            candidate: data.candidate,
            receiverID: member.socketID,
          });
        };

        pc.ontrack = (data) => {
          setMeetingMembers((members): IMeetingUser[] => [
            ...members.filter((m: IMeetingUser) => m.socketID !== member.socketID),
            {
              ...member,
              stream: data.streams[0],
            },
          ]);
        };

        if (myStream) {
          myStream.getTracks().forEach((track) => {
            if (myStream) pc.addTrack(track, myStream);
          });
        }

        return pc;
      } catch (e) {
        console.error(CREATE_PEER_CONNECTION, e);
      }
    },
    [myStream],
  );

  useEffect(() => {
    getMyStream();
  }, []);

  useEffect(() => {
    if (id === null || userdata === undefined || myStream === null) return;
    const { loginID, username, thumbnail } = userdata;

    Socket.joinChannel({ channelType: ChannelType.MEETING, id });
    socket.on(MeetingEvent.ALL_MEETING_MEMBERS, async (members) => {
      members.forEach(async (member: IMeetingUser) => {
        try {
          if (!(await myStream)) return;
          const pc = await createPeerConnection(member);
          if (!pc) return;
          pcs.current = { ...pcs.current, [member.socketID]: pc };
          const offer = await pc.createOffer();
          await pc.setLocalDescription(new RTCSessionDescription(offer));

          socket.emit(MeetingEvent.OFFER, {
            offer,
            receiverID: member.socketID,
            member: { socketID: socket.id, loginID, username, thumbnail },
          });
        } catch (e) {
          console.error(MeetingEvent.ALL_MEETING_MEMBERS, e);
        }
      });
    });

    socket.on(MeetingEvent.OFFER, async ({ offer, member }) => {
      const pc = await createPeerConnection(member);
      if (!pc) return;
      pcs.current[member.socketID] = pc;
      pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      pc.setLocalDescription(new RTCSessionDescription(answer));
      socket.emit(MeetingEvent.ANSWER, { answer, receiverID: member.socketID });
    });

    socket.on(MeetingEvent.ANSWER, ({ answer, senderID }) => {
      const pc = pcs.current[senderID];
      if (!pc) return;
      pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on(MeetingEvent.CANDIDATE, async ({ candidate, senderID }) => {
      const pc = pcs.current[senderID];
      if (!pc) return;
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on(MeetingEvent.LEAVE_MEMBER, (memberID) => {
      if (!pcs.current[memberID]) return;
      pcs.current[memberID].close();
      delete pcs.current[memberID];
      setMeetingMembers((members) => members.filter((member) => member.socketID !== memberID));
    });

    socket.emit(MeetingEvent.JOIN_MEETING, id, { loginID, username, thumbnail });

    return () => {
      Socket.leaveChannel({ channelType: ChannelType.MEETING, id });
      socket.off(MeetingEvent.ALL_MEETING_MEMBERS);
      socket.off(MeetingEvent.OFFER);
      socket.off(MeetingEvent.ANSWER);
      socket.off(MeetingEvent.CANDIDATE);
      socket.off(MeetingEvent.LEAVE_MEMBER);
      socket.emit(MeetingEvent.LEAVE_MEETING);

      Object.values(pcs.current).forEach((pc) => pc.close());
    };
  }, [id, userdata, myStream, createPeerConnection]);

  useEffect(() => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = mic;
      });
      myStream.getVideoTracks().forEach((track) => {
        track.enabled = cam;
      });
    }
  }, [mic, cam, myStream]);

  return (
    <MeetVideoWrapper ref={videoWrapperRef} videoCount={videoCount || 0}>
      <VideoItem autoPlay playsInline ref={myVideoRef}></VideoItem>
      {meetingMembers.map((member) => (
        <OtherVideo key={member.socketID} member={member} />
      ))}
    </MeetVideoWrapper>
  );
}

function OtherVideo({ member }: { member: IMeetingUser }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current || !member.stream) return;
    ref.current.srcObject = member.stream;
  });

  return <VideoItem key={member.socketID} autoPlay playsInline ref={ref} />;
}

export default MeetVideo;
