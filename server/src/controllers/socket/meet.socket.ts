import { io, meetingMembers, socketToMeeting } from '../../loaders/socket.loader';
import MeetEvent from '../../types/socket/MeetEvent';
import RoomPrefix from '../../types/socket/RoomPrefix';

function SocketMeetController(socket) {
  this.meetChat = ({ channelID, chat }) => {
    io.to(RoomPrefix.meeting + channelID).emit(MeetEvent.meetChat, chat);
  };

  this.joinMeeting = (meetingID, { loginID, username, thumbnail }) => {
    socket.join(RoomPrefix.RTC + meetingID);
    socketToMeeting[socket.id] = meetingID;
    const newMember = {
      socketID: socket.id,
      loginID,
      username,
      thumbnail,
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

    io.to(socket.id).emit(MeetEvent.allMeetingMembers, membersInMeeting);
  };

  this.answer = ({ answer, receiverID }) => {
    io.to(receiverID).emit(MeetEvent.answer, { answer, senderID: socket.id });
  };

  this.offer = ({ offer, receiverID, member }) => {
    io.to(receiverID).emit(MeetEvent.offer, { offer, member: { socketID: socket.id, ...member } });
  };

  this.candidate = ({ candidate, receiverID }) => {
    io.to(receiverID).emit(MeetEvent.candidate, { candidate, senderID: socket.id });
  };

  this.leaveMeeting = () => {
    const meetingID = socketToMeeting[socket.id];
    if (meetingMembers[meetingID])
      meetingMembers[meetingID] = meetingMembers[meetingID].filter(
        (member) => member.socketID !== socket.id,
      );
    io.to(RoomPrefix.RTC + meetingID).emit(MeetEvent.leaveMember, socket.id);
  };
}

export default SocketMeetController;
