import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  useSelectedChannel,
  useSelectedGroup,
  useSelectVideo,
  useUserdata,
  useUserDevice,
} from '@hooks/index';
import MeetEvent from '@customTypes/socket/MeetEvent';
import Socket, { socket } from '@utils/socket';
import { highlightMyVolume } from '@utils/audio';
import OtherVideo from './OtherVideo';
import MeetButton from './MeetButton';
import { Videos, VideoSection } from './style';
import FocusedVideo from './FocusedVideo';
import MyVideo from './MyVideo';
import { MeetingMember, StreamIDMetaData } from '@customTypes/meet';
import { playSoundEffect, SoundEffect } from '@utils/playSoundEffect';

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
  const [meetingMembers, setMeetingMembers] = useState<MeetingMember[]>([]);
  const pcs = useRef<{ [socketID: string]: RTCPeerConnection }>({});
  const videoCount = videoWrapperRef.current && videoWrapperRef.current.childElementCount;
  const { selectVideo, deselectVideo, selectedVideo, setSelectedVideo } = useSelectVideo();
  const streamIDMetaData = useRef<{ [socketID: string]: StreamIDMetaData }>({});

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

  const createPeerConnection = useCallback((socketID: string) => {
    if (pcs.current[socketID]) return pcs.current[socketID];
    const pc = new RTCPeerConnection(pcConfig);

    pc.onicecandidate = ({ candidate }) => {
      if (!candidate) return;

      socket.emit(MeetEvent.candidate, {
        candidate: candidate,
        receiverID: socketID,
      });
    };

    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(new RTCSessionDescription(offer));
        socket.emit(MeetEvent.offer, {
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

    pc.ontrack = ({ streams }) => {
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
      setScreenShare(false);
    }
  };

  const onScreenShareClick = () => {
    if (screenShare) {
      const tracks = myScreenStreamRef.current?.getTracks();
      tracks?.forEach((track) => track.stop());
      setScreenShare(false);
    } else {
      setScreenShare(true);
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
      members.forEach(async (member: MeetingMember) => {
        try {
          const pc = createPeerConnection(member.socketID);
          if (!pc) return;
          setMeetingMembers((members) => [...members, { ...member, pc }]);
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

    socket.on(MeetEvent.offer, async ({ offer, member, streamID, senderID }) => {
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
        pcs.current[senderID] = pc;
        pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        pc.setLocalDescription(new RTCSessionDescription(answer));
        socket.emit(MeetEvent.answer, {
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
      playSoundEffect(SoundEffect.LeaveMeeting);
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
  }, [id, userdata]);

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

  useEffect(() => {
    playSoundEffect(SoundEffect.JoinMeeting);

    return () => {
      playSoundEffect(SoundEffect.LeaveMeeting);
    };
  }, []);

  return (
    <VideoSection>
      {selectedVideo && <FocusedVideo selectedVideo={selectedVideo} onClick={deselectVideo} />}
      <Videos ref={videoWrapperRef} videoCount={videoCount || 0} focused={selectedVideo !== null}>
        <MyVideo
          myVideoRef={myVideoRef}
          myScreenRef={myScreenRef}
          cam={cam}
          mic={mic}
          speaker={speaker}
          screenShare={screenShare}
        />
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
      <MeetButton screenShare={screenShare} onScreenShareClick={onScreenShareClick} />
    </VideoSection>
  );
}

export default MeetVideo;
