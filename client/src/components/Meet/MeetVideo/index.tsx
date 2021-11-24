import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  useSelectedChannel,
  useSelectedGroup,
  useSelectVideo,
  useUserdata,
  useUserDevice,
} from '@hooks/index';
import MeetEvent from '@customTypes/socket/MeetEvent';
import Socket, { socket } from 'src/utils/socket';
import { highlightMyVolume } from 'src/utils/audio';
import OtherVideo from './OtherVideo';
import MeetButton from './MeetButton';
import { MicOffIcon, SpeakerOffIcon } from '@components/common/Icons';
import {
  Videos,
  VideoWrapper,
  Video,
  Thumbnail,
  VideoSection,
  DeviceStatus,
  ThumbnailWrapper,
  SoundEffect,
} from './style';
import FocusedVideo from './FocusedVideo';

const ICE_SERVER_URL = 'stun:stun.l.google.com:19302';

const pcConfig = {
  iceServers: [
    {
      urls: ICE_SERVER_URL,
    },
  ],
};

const applyDeviceStatus = ({
  stream,
  video,
  audio,
}: {
  stream: MediaStream;
  video: boolean;
  audio: boolean;
}) => {
  stream?.getVideoTracks().forEach((track) => {
    track.enabled = video;
  });
  stream?.getAudioTracks().forEach((track) => {
    track.enabled = audio;
  });
};

export interface IMeetingUser {
  socketID: string;
  loginID: string;
  username: string;
  thumbnail: string | null;
  mic: boolean;
  cam: boolean;
  speaker: boolean;
  stream?: MediaStream;
  screen?: MediaStream;
  pc?: RTCPeerConnection;
}

export interface SelectedVideo {
  socketID: string;
  loginID: string;
  username: string;
  thumbnail: null | string;
  stream?: MediaStream;
  mic: boolean;
  cam: boolean;
  speaker: boolean;
  isScreen: boolean;
}

interface StreamIDMetaData {
  camera: string;
  screen: string;
}

function MeetVideo() {
  const { userdata } = useUserdata();
  const { id } = useSelectedChannel();
  const { mic, cam, speaker } = useUserDevice();
  const { code } = useSelectedGroup();
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const myStreamRef = useRef<MediaStream>();
  const myScreenRef = useRef<HTMLVideoElement>(null);
  const myScreenStreamRef = useRef<MediaStream>();
  const [screenShare, setScreenShare] = useState(false);
  const [meetingMembers, setMeetingMembers] = useState<IMeetingUser[]>([]);
  const pcs = useRef<{ [socketID: string]: RTCPeerConnection }>({});
  const videoCount = videoWrapperRef.current && videoWrapperRef.current.childElementCount;
  const { selectVideo, deselectVideo, selectedVideo, setSelectedVideo } = useSelectVideo();
  const streamIDMetaData = useRef<{ [socketID: string]: StreamIDMetaData }>({});
  const joinSoundEffectRef = useRef<HTMLAudioElement>(null);
  const leaveSoundEffectRef = useRef<HTMLAudioElement>(null);

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
    applyDeviceStatus({ stream: myStream, video: cam, audio: mic });
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
          streamID: {
            camera: myStreamRef.current?.id,
            screen: myScreenStreamRef.current?.id,
          },
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
          try {
            joinSoundEffectRef.current?.play();
          } catch (e) {
            console.error(e);
          }
        }

        const newStream = e.streams[0];
        const { camera, screen } = streamIDMetaData.current[mem.socketID];

        if (camera === newStream.id) {
          mem.stream = newStream;
        } else if (screen === newStream.id) {
          newStream.onremovetrack = () => {
            setSelectedVideo((selectedVideo) =>
              selectedVideo?.socketID === mem?.socketID ? null : selectedVideo,
            );
            setMeetingMembers((members) => {
              const m = members.find((m) => m.socketID === member.socketID);
              if (!m) return members;
              delete m.screen;
              return [...members];
            });
          };
          mem.screen = newStream;
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
      myScreenStreamRef.current = undefined;
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
            member: { loginID, username, thumbnail, mic, cam, speaker },
            streamID: {
              camera: myStreamRef.current?.id,
              screen: myScreenStreamRef.current?.id,
            },
          });
        } catch (e) {
          console.error(MeetEvent.allMeetingMembers, e);
        }
      });
    });

    socket.on(MeetEvent.offer, async ({ offer, member, streamID }) => {
      try {
        const pc = createPeerConnection(member);
        if (!pc) return;
        streamIDMetaData.current[member.socketID] = streamID;
        pcs.current[member.socketID] = pc;
        pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        pc.setLocalDescription(new RTCSessionDescription(answer));
        socket.emit(MeetEvent.answer, {
          answer,
          receiverID: member.socketID,
          streamID: {
            camera: myStreamRef.current?.id,
            screen: myScreenStreamRef.current?.id,
          },
        });
      } catch (e) {
        console.error(e);
      }
    });

    socket.on(MeetEvent.answer, async ({ answer, senderID, streamID }) => {
      try {
        const pc = pcs.current[senderID];
        if (!pc) return;
        streamIDMetaData.current[senderID] = streamID;
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
      setSelectedVideo((selectedVideo) =>
        selectedVideo?.socketID === memberID ? null : selectedVideo,
      );
      setMeetingMembers((members) => members.filter((member) => member.socketID !== memberID));
      try {
        leaveSoundEffectRef.current?.play();
      } catch (e) {
        console.error(e);
      }
    });

    socket.emit(MeetEvent.joinMeeting, id, code, {
      loginID,
      username,
      thumbnail,
      mic,
      cam,
      speaker,
    });

    return () => {
      Socket.leaveChannel({ channelType: MeetEvent.meeting, id });
      socket.off(MeetEvent.allMeetingMembers);
      socket.off(MeetEvent.offer);
      socket.off(MeetEvent.answer);
      socket.off(MeetEvent.candidate);
      socket.off(MeetEvent.leaveMember);
      socket.emit(MeetEvent.leaveMeeting, code);

      Object.values(pcs.current).forEach((pc) => pc.close());
      myStreamRef.current?.getTracks().forEach((track) => track.stop());
      myScreenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [id]);

  useEffect(() => {
    if (myStreamRef.current)
      applyDeviceStatus({ stream: myStreamRef.current, video: cam, audio: mic });
  }, [mic, cam]);

  useEffect(() => {
    socket.on(MeetEvent.setMuted, (micStatus, socketID) => {
      setMeetingMembers((members) => {
        const member = members.find((member) => member.socketID === socketID);
        if (!member) return members;
        setSelectedVideo((selectedVideo) => {
          if (selectedVideo?.socketID === member.socketID)
            return { ...selectedVideo, mic: micStatus };
          else return selectedVideo;
        });
        member.mic = micStatus;
        return [...members];
      });
    });

    socket.on(MeetEvent.setToggleCam, (camStatus, socketID) => {
      setMeetingMembers((members) => {
        const member = members.find((member) => member.socketID === socketID);
        if (!member) return members;
        setSelectedVideo((selectedVideo) => {
          if (selectedVideo?.socketID === member.socketID)
            return { ...selectedVideo, cam: camStatus };
          else return selectedVideo;
        });
        member.cam = camStatus;
        return [...members];
      });
    });

    socket.on(MeetEvent.setSpeaker, (speakerStatus, socketID) => {
      setMeetingMembers((members) => {
        const member = members.find((member) => member.socketID === socketID);
        if (!member) return members;
        setSelectedVideo((selectedVideo) => {
          if (selectedVideo?.socketID === member.socketID)
            return { ...selectedVideo, speaker: speakerStatus };
          else return selectedVideo;
        });
        member.speaker = speakerStatus;
        return [...members];
      });
    });

    return () => {
      socket.off(MeetEvent.setMuted);
      socket.off(MeetEvent.setToggleCam);
      socket.off(MeetEvent.setSpeaker);
    };
  }, []);

  return (
    <VideoSection>
      {selectedVideo && <FocusedVideo selectedVideo={selectedVideo} onClick={deselectVideo} />}
      <Videos ref={videoWrapperRef} videoCount={videoCount || 0} focused={selectedVideo !== null}>
        <VideoWrapper>
          <Video autoPlay playsInline muted ref={myVideoRef} />
          <ThumbnailWrapper>
            {cam || (
              <Thumbnail src={userdata?.thumbnail || '/images/default_profile.png'} alt="profile" />
            )}
          </ThumbnailWrapper>
          <p>{`${userdata?.username}(${userdata?.loginID})`}</p>
          <DeviceStatus>
            {mic || <MicOffIcon />}
            {speaker || <SpeakerOffIcon />}
          </DeviceStatus>
        </VideoWrapper>
        {screenShare && (
          <VideoWrapper>
            <Video autoPlay playsInline muted ref={myScreenRef} />
            <p>{`${userdata?.username}(${userdata?.loginID}) 님의 화면`}</p>
          </VideoWrapper>
        )}
        {meetingMembers.map((member) => (
          <OtherVideo
            key={member.socketID}
            member={member}
            muted={!speaker}
            selectVideo={selectVideo}
            selectedVideo={selectedVideo}
          />
        ))}
      </Videos>
      <MeetButton
        onScreenShareClick={() => {
          if (screenShare) {
            const tracks = myScreenStreamRef.current?.getTracks();
            tracks?.forEach((track) => track.stop());
            setScreenShare(false);
          } else {
            setScreenShare(true);
          }
        }}
      />
      <SoundEffect ref={joinSoundEffectRef} src="/audios/meet_join.wav" />
      <SoundEffect ref={leaveSoundEffectRef} src="/audios/meet_leave.wav" />
    </VideoSection>
  );
}

export default MeetVideo;
