import React, { useState, useEffect, useRef } from 'react';
import { useSelectedChannel } from '../../../hooks/useSelectedChannel';
import { useUserdata } from '../../../hooks/useUserdata';
import { useUserDevice } from '../../../hooks/useUserDevice';
import Socket, { socket } from '../../../util/socket';
import { VideoItem } from './style';

const pcConfig = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

enum MeetingEvent {
  JOIN_MEETING = 'joinMeeting',
  ALL_MEETING_MEMBERS = 'allMeetingMembers',
  CANDIDATE = 'candidate',
  OFFER = 'offer',
  ANSWER = 'answer',
  LEAVE_MEMBER = 'leaveMember',
  LEAVE_MEETING = 'leaveMeeting',
}

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
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const myStreamRef = useRef<MediaStream | null>(null);
  const [meetingMembers, setMeetingMembers] = useState<IMeetingUser[]>([]);
  const pcs = useRef<{ [socketID: string]: RTCPeerConnection }>({});

  const getMyStream = async () => {
    try {
      const myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      myStreamRef.current = myStream;
      if (myVideoRef.current) myVideoRef.current.srcObject = myStream;
    } catch (e) {
      console.error('getMyStream: ', e);
    }
  };

  const createPeerConnection = async (member: IMeetingUser) => {
    try {
      const pc = new RTCPeerConnection(pcConfig);

      pc.onicecandidate = (data) => {
        if (!data.candidate) return;

        socket.emit('candidate', {
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

      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach((track) => {
          if (myStreamRef.current) pc.addTrack(track, myStreamRef.current);
        });
      }

      return pc;
    } catch (e) {
      console.error('getMyStream: ', e);
    }
  };

  useEffect(() => {
    if (id === null || userdata === undefined) return;
    const { loginID, username, thumbnail } = userdata;

    Socket.joinChannel({ channelType: 'meeting', id });
    socket.on(MeetingEvent.ALL_MEETING_MEMBERS, async (members) => {
      members.forEach(async (member: IMeetingUser) => {
        try {
          if (!(await myStreamRef.current)) return;
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

    socket.on('offer', async ({ offer, member }) => {
      const pc = await createPeerConnection(member);
      if (!pc) return;
      pcs.current[member.socketID] = pc;
      pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      pc.setLocalDescription(new RTCSessionDescription(answer));
      socket.emit('answer', { answer, receiverID: member.socketID });
    });

    socket.on('answer', ({ answer, senderID }) => {
      const pc = pcs.current[senderID];
      if (!pc) return;
      pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on(MeetingEvent.CANDIDATE, async ({ candidate, senderID }) => {
    socket.on(MeetingEvent.LEAVE_MEMBER, (memberID) => {
      if (!pcs.current[memberID]) return;
      pcs.current[memberID].close();
      delete pcs.current[memberID];
      setMeetingMembers((members) => members.filter((member) => member.socketID !== memberID));
    });

    socket.on('candidate', async ({ candidate, senderID }) => {
      const pc = pcs.current[senderID];
      if (!pc) return;
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.emit(JOIN_MEETING, id, { loginID, username, thumbnail });

    return () => {
      Socket.leaveChannel({ channelType: 'meeting', id });
      socket.off(MeetingEvent.ALL_MEETING_MEMBERS);
      socket.off(MeetingEvent.OFFER);
      socket.off(MeetingEvent.ANSWER);
      socket.off(MeetingEvent.CANDIDATE);
      socket.off(MeetingEvent.LEAVE_MEMBER);
      socket.emit(MeetingEvent.LEAVE_MEETING);

      meetingMembers.forEach((member) => {
        if (!pcs.current[member.socketID]) return;
        pcs.current[member.socketID].close();
      });
    };
  }, [id]);

  useEffect(() => {
    if (myStreamRef.current) {
      myStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = mic;
      });
      myStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = cam;
      });
    }
  }, [myStreamRef.current, mic, cam]);

  return (
    <div>
      <VideoItem autoPlay playsInline ref={myVideoRef}></VideoItem>
      {meetingMembers.map((member) => (
        <OtherVideo member={member} />
      ))}
    </div>
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
