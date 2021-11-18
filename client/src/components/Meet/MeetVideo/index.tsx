import { useState, useEffect, useRef, useCallback } from 'react';
import MeetEvent from '@customTypes/socket/MeetEvent';
import { useSelectedChannel, useUserdata, useUserDevice } from '@hooks/index';
import Socket, { socket } from '../../../utils/socket';
import { MeetVideoWrapper, VideoItemWrapper, VideoItem, MyImage } from './style';
import { highlightMyVolume } from '../../../utils/audio';
import { MicOffIcon } from '@components/common/Icons';
import OtherVideo from './OtherVideo';
import MeetButton from './MeetButton';

const ICE_SERVER_URL = 'stun:stun.l.google.com:19302';

const pcConfig = {
  iceServers: [
    {
      urls: ICE_SERVER_URL,
    },
  ],
};

export interface IMeetingUser {
  socketID: string;
  loginID: string;
  username: string;
  thumbnail: string | null;
  mic: boolean;
  cam: boolean;
  stream?: MediaStream;
  screen?: MediaStream;
  pc?: RTCPeerConnection;
}

function MeetVideo() {
  const { userdata } = useUserdata();
  const { id } = useSelectedChannel();
  const { mic, cam } = useUserDevice();
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const myStreamRef = useRef<MediaStream | null>(null);
  const myScreenRef = useRef<HTMLVideoElement>(null);
  const myScreenStreamRef = useRef<MediaStream | null>(null);
  const [screenShare, setScreenShare] = useState(false);
  const [meetingMembers, setMeetingMembers] = useState<IMeetingUser[]>([]);
  const pcs = useRef<{ [socketID: string]: RTCPeerConnection }>({});
  const videoCount = videoWrapperRef.current && videoWrapperRef.current.childElementCount;

  const getMyStream = async () => {
    let myStream;
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    } catch (e) {
      const canvas = document.createElement('canvas');
      myStream = canvas.captureStream(0);
    }
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = myStream;
      highlightMyVolume(myStream, myVideoRef.current);
    }
    myStreamRef.current = myStream;
  };

  const createPeerConnection = useCallback((member: IMeetingUser) => {
    if (pcs.current[member.socketID]) return pcs.current[member.socketID];
    const pc = new RTCPeerConnection(pcConfig);

    pc.onicecandidate = (data) => {
      if (!data.candidate) return;

      socket.emit(MeetEvent.candidate, {
        candidate: data.candidate,
        receiverID: member.socketID,
      });
    };

    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(new RTCSessionDescription(offer));
        socket.emit(MeetEvent.offer, {
          offer,
          receiverID: member.socketID,
          member: {},
        });
      } catch (e) {
        console.error(e);
      }
    };

    pc.ontrack = (e) => {
      setMeetingMembers((members): IMeetingUser[] => {
        let mem = members.find((m) => m.socketID === member.socketID);
        if (!mem) {
          mem = { ...member, pc };
          members.push(mem);
        }

        const newStream = e.streams[0];

        if (mem.stream && mem.stream.id !== e.streams[0].id) {
          newStream.onremovetrack = () => {
            setMeetingMembers((members) => {
              const m = members.find((m) => m.socketID === member.socketID);
              if (!m) return members;
              delete m.screen;
              return [...members];
            });
          };
          mem.screen = newStream;
        } else {
          mem.stream = newStream;
        }

        return [...members];
      });
    };

    myStreamRef.current?.getTracks().forEach((track) => {
      if (myStreamRef.current) pc.addTrack(track, myStreamRef.current);
    });

    myScreenStreamRef.current?.getTracks().forEach((track) => {
      if (myScreenStreamRef.current) pc.addTrack(track, myScreenStreamRef.current);
    });

    return pc;
  }, []);

  const getMyScreen = async () => {
    try {
      const myScreen = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });

      if (myScreenRef.current) myScreenRef.current.srcObject = myScreen;

      myScreen.getTracks().forEach((track) => {
        track.onended = () => setScreenShare(false);
        Object.values(pcs.current).forEach((pc) => pc.addTrack(track, myScreen));
      });

      myScreenStreamRef.current = myScreen;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (screenShare) getMyScreen();
    else {
      Object.values(pcs.current).forEach((pc) => {
        const senders = pc.getSenders();
        const tracks = myScreenStreamRef.current?.getTracks();
        const screenSenders = senders.filter((sender) =>
          tracks?.some((track) => track.id === sender.track?.id),
        );
        screenSenders.forEach((sender) => pc.removeTrack(sender));
      });
      myScreenStreamRef.current = null;
    }
  }, [screenShare]);

  useEffect(() => {
    if (id === null || userdata === undefined) return;
    const { loginID, username, thumbnail } = userdata;

    Socket.joinChannel({ channelType: MeetEvent.meeting, id });
    socket.on(MeetEvent.allMeetingMembers, async (members) => {
      await getMyStream();
      members.forEach(async (member: IMeetingUser) => {
        try {
          const pc = createPeerConnection(member);
          if (!pc) return;
          pcs.current = { ...pcs.current, [member.socketID]: pc };
          const offer = await pc.createOffer();
          await pc.setLocalDescription(new RTCSessionDescription(offer));

          socket.emit(MeetEvent.offer, {
            offer,
            receiverID: member.socketID,
            member: { loginID, username, thumbnail, mic, cam },
          });
        } catch (e) {
          console.error(MeetEvent.allMeetingMembers, e);
        }
      });
    });

    socket.on(MeetEvent.offer, async ({ offer, member }) => {
      try {
        const pc = createPeerConnection(member);
        if (!pc) return;
        pcs.current[member.socketID] = pc;
        pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        pc.setLocalDescription(new RTCSessionDescription(answer));
        socket.emit(MeetEvent.answer, { answer, receiverID: member.socketID });
      } catch (e) {
        console.error(e);
      }
    });

    socket.on(MeetEvent.answer, async ({ answer, senderID }) => {
      try {
        const pc = pcs.current[senderID];
        if (!pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (e) {
        console.error(e);
      }
    });

    socket.on(MeetEvent.candidate, async ({ candidate, senderID }) => {
      try {
        const pc = pcs.current[senderID];
        if (!pc) return;
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error(e);
      }
    });

    socket.on(MeetEvent.leaveMember, (memberID) => {
      if (!pcs.current[memberID]) return;
      pcs.current[memberID].close();
      delete pcs.current[memberID];
      setMeetingMembers((members) => members.filter((member) => member.socketID !== memberID));
    });

    socket.emit(MeetEvent.joinMeeting, id, { loginID, username, thumbnail, mic, cam });

    return () => {
      Socket.leaveChannel({ channelType: MeetEvent.meeting, id });
      socket.off(MeetEvent.allMeetingMembers);
      socket.off(MeetEvent.offer);
      socket.off(MeetEvent.answer);
      socket.off(MeetEvent.candidate);
      socket.off(MeetEvent.leaveMember);
      socket.emit(MeetEvent.leaveMeeting);

      Object.values(pcs.current).forEach((pc) => pc.close());
      myStreamRef.current?.getTracks().forEach((track) => track.stop());
      myScreenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [id]);

  useEffect(() => {
    myStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = mic;
    });
    myStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = cam;
    });
  }, [mic, cam]);

  useEffect(() => {
    socket.on(MeetEvent.setMuted, (who, micStatus) => {
      setMeetingMembers((members) => {
        const member = members.find((member) => member.loginID === who);
        if (!member) return members;
        member.mic = micStatus;
        return [...members];
      });
    });

    socket.on(MeetEvent.setToggleCam, (who, camStatus) => {
      setMeetingMembers((members) => {
        const member = members.find((member) => member.loginID === who);
        if (!member) return members;
        member.cam = camStatus;
        return [...members];
      });
    });

    return () => {
      socket.off(MeetEvent.setMuted);
      socket.off(MeetEvent.setToggleCam);
    };
  }, []);

  return (
    <>
      <MeetVideoWrapper ref={videoWrapperRef} videoCount={videoCount || 0}>
        <VideoItemWrapper>
          <VideoItem autoPlay playsInline muted ref={myVideoRef} />
          {cam ? (
            ''
          ) : (
            <MyImage src={userdata?.thumbnail || '/images/default_profile.png'} alt="profile" />
          )}
          <p>{userdata?.username}</p>
          {mic ? '' : <MicOffIcon />}
        </VideoItemWrapper>
        {screenShare && (
          <VideoItemWrapper>
            <VideoItem autoPlay playsInline muted ref={myScreenRef} />
            <p>{userdata?.username + '님의 화면'}</p>
          </VideoItemWrapper>
        )}
        {meetingMembers.map((member) => (
          <OtherVideo key={member.socketID} member={member} />
        ))}
      </MeetVideoWrapper>
      <MeetButton
        onClick={() => {
          if (screenShare) {
            const tracks = myScreenStreamRef.current?.getTracks();
            tracks?.forEach((track) => track.stop());
            setScreenShare(false);
          } else {
            setScreenShare(true);
          }
        }}
      />
    </>
  );
}

export default MeetVideo;
