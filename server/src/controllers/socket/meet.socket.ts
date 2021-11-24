import {
  io,
  meetingMembers,
  socketToMeeting,
  userConnectionInfo,
} from '../../loaders/socket.loader';
import ConnectionEvent from '../../types/socket/ConnectionEvent';
import MeetEvent from '../../types/socket/MeetEvent';
import RoomPrefix from '../../types/socket/RoomPrefix';

function SocketMeetController(socket) {
  const checkMeetingUserList = (meetingchannelList) => {
    const meetingUserList = {};
    Object.entries(meetingMembers).forEach(([channel, user]) => {
      const channelID = Number(channel);
      if (!meetingchannelList?.includes(channelID)) return;
      meetingUserList[channelID] = user;
    });
    return meetingUserList;
  };

  this.meetChat = ({ channelID, chat }) => {
    io.to(RoomPrefix.meeting + channelID).emit(MeetEvent.meetChat, chat);
  };

  this.joinMeeting = (meetingID, code, { loginID, username, thumbnail, mic, cam, speaker }) => {
    socket.join(RoomPrefix.RTC + meetingID);
    socketToMeeting[socket.id] = meetingID;
    const newMember = {
      socketID: socket.id,
      loginID,
      username,
      thumbnail,
      mic,
      cam,
      speaker,
    };

    if (meetingID in meetingMembers) {
      const memberList = meetingMembers[meetingID].map((member) => member.socketID);
      if (memberList.includes(newMember.socketID)) return;
      meetingMembers[meetingID].push(newMember);
    } else {
      meetingMembers[meetingID] = [newMember];
    }

    const membersInMeeting = meetingMembers[meetingID].filter(
      (user) => user.socketID !== socket.id,
    );
    io.to(code).emit(MeetEvent.someoneIn, meetingMembers[meetingID], meetingID);
    io.to(socket.id).emit(MeetEvent.allMeetingMembers, membersInMeeting);
  };

  this.offer = ({ offer, receiverID, member, streamID }) => {
    io.to(receiverID).emit(MeetEvent.offer, {
      offer,
      member: { socketID: socket.id, ...member },
      streamID,
    });
  };

  this.answer = ({ answer, receiverID, streamID }) => {
    io.to(receiverID).emit(MeetEvent.answer, { answer, senderID: socket.id, streamID });
  };

  this.candidate = ({ candidate, receiverID }) => {
    io.to(receiverID).emit(MeetEvent.candidate, { candidate, senderID: socket.id });
  };

  this.mute = (meetingID, muted) => {
    const meetingChannel = Object.keys(meetingMembers).find((v) => v === meetingID?.toString());
    if (!meetingChannel) return;
    const index = meetingMembers[meetingID.toString()].findIndex(
      (oneMember) => oneMember.socketID === socket.id,
    );
    if (index === -1) return;
    meetingMembers[meetingID.toString()][index].mic = muted;
    io.to(RoomPrefix.RTC + meetingID).emit(MeetEvent.setMuted, muted, socket.id);
  };

  this.toggleCam = (meetingID, toggleCam) => {
    const meetingChannel = Object.keys(meetingMembers).find((v) => v === meetingID?.toString());
    if (!meetingChannel) return;
    const index = meetingMembers[meetingID.toString()].findIndex(
      (oneMember) => oneMember.socketID === socket.id,
    );
    if (index === -1) return;
    meetingMembers[meetingID.toString()][index].cam = toggleCam;
    io.to(RoomPrefix.RTC + meetingID).emit(MeetEvent.setToggleCam, toggleCam, socket.id);
  };

  this.speaker = (meetingID, speaker) => {
    const meetingChannel = Object.keys(meetingMembers).find((v) => v === meetingID?.toString());
    if (!meetingChannel) return;
    const index = meetingMembers[meetingID.toString()].findIndex(
      (oneMember) => oneMember.socketID === socket.id,
    );
    if (index === -1) return;

    meetingMembers[meetingID.toString()][index].speaker = speaker;
    io.to(RoomPrefix.RTC + meetingID).emit(MeetEvent.setSpeaker, speaker, socket.id);
  };

  this.leaveMeeting = (groupCode) => {
    const meetingID = socketToMeeting[socket.id];
    if (meetingMembers[meetingID])
      meetingMembers[meetingID] = meetingMembers[meetingID].filter(
        (member) => member.socketID !== socket.id,
      );

    if (groupCode === ConnectionEvent.close) {
      const groupCodes = Object.keys(userConnectionInfo).filter((key) =>
        userConnectionInfo[key].some((v) => v.socketID.includes(socket.id)),
      );
      groupCodes.forEach((groupCode) => {
        io.to(groupCode).emit(MeetEvent.someoneOut, meetingMembers[meetingID], meetingID);
      });
    } else {
      io.to(groupCode).emit(MeetEvent.someoneOut, meetingMembers[meetingID], meetingID);
    }
    io.to(RoomPrefix.RTC + meetingID).emit(MeetEvent.leaveMember, socket.id);
  };

  this.meetingChannelUserList = (code, meetingchannelList) => {
    const meetingUserList = checkMeetingUserList(meetingchannelList);
    io.to(socket.id).emit(MeetEvent.MeetingUserList, meetingUserList);
  };
}

export default SocketMeetController;
