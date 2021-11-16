import { Server } from 'socket.io';
import ChannelEvent from '../types/socket/ChannelEvent';
import ConnectionEvent from '../types/socket/ConnectionEvent';
import GroupEvent from '../types/socket/GroupEvent';
import MeetEvent from '../types/socket/MeetEvent';
import RoomPrefix from '../types/socket/RoomPrefix';

export let io: Server;
export const userConnectionInfo = {};
export const meetingMembers = {};
export const socketToMeeting = {};

export async function socketLoader(httpServer) {
  io = new Server(httpServer);
  io.on(ConnectionEvent.connection, (socket) => {
    socket.on(GroupEvent.groupID, (groupID, user) => {
      if (!userConnectionInfo[groupID]) return;
      if (user && !userConnectionInfo[groupID].some((v) => v.loginID === user.loginID))
        userConnectionInfo[groupID] = [...userConnectionInfo[groupID], user];
      socket.emit(GroupEvent.groupUserConnection, userConnectionInfo[groupID]);
    });

    socket.on(GroupEvent.login, (groups, user) => {
      if (!user || !groups) return;
      groups?.forEach(({ code }) => {
        socket.join(`${code}`);
        io.to(`${code}`).emit(GroupEvent.userEnter, user, code);
        if (userConnectionInfo[code]) {
          if (!userConnectionInfo[code].map((v) => v.loginID).includes(user.loginID)) {
            userConnectionInfo[code].push(user);
          }
        } else {
          userConnectionInfo[code] = [user];
        }
      });
      socket.on(ConnectionEvent.disconnect, () => {
        Object.keys(userConnectionInfo).forEach((v) => {
          userConnectionInfo[v] = userConnectionInfo[v].filter((a) => a.loginID !== user.loginID);
        });
        groups?.forEach(({ code }) => {
          io.to(`${code}`).emit(GroupEvent.userExit, user, code);
        });
      });
    });

    socket.on(GroupEvent.groupDelete, (code) => {
      delete userConnectionInfo[code];
      io.to(code).emit(GroupEvent.groupDelete, code);
      socket.leave(code);
    });

    const checkMeetingUserList = (meetingchannelList) => {
      const meetingUserList = {};
      Object.entries(meetingMembers).forEach(([channel, user]) => {
        const channelID = Number(channel);
        if (!meetingchannelList.includes(channelID)) return;
        if (meetingUserList[channelID]) {
          meetingUserList[channelID].push(user);
        } else {
          meetingUserList[channelID] = [user];
        }
      });
      return meetingUserList;
    };

    socket.on(MeetEvent.MeetingChannelList, (code, meetingchannelList) => {
      if (!meetingchannelList) return;
      const meetingUserList = checkMeetingUserList(meetingchannelList);
      io.to(code).emit(MeetEvent.MeetingUserList, meetingUserList);
    });

    socket.on(ChannelEvent.joinChannel, (channelID) => {
      socket.join(channelID);
    });

    socket.on(ChannelEvent.leaveChannel, (channelID) => {
      socket.leave(channelID);
    });

    socket.on(MeetEvent.meetChat, ({ channelID, chat }) => {
      io.to(RoomPrefix.meeting + channelID).emit(MeetEvent.meetChat, chat);
    });

    socket.on(MeetEvent.joinMeeting, (meetingID, { loginID, username, thumbnail }) => {
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
    });

    socket.on(MeetEvent.candidate, ({ candidate, receiverID }) => {
      io.to(receiverID).emit(MeetEvent.candidate, { candidate, senderID: socket.id });
    });

    socket.on(MeetEvent.offer, ({ offer, receiverID, member }) => {
      io.to(receiverID).emit(MeetEvent.offer, { offer, member });
    });

    socket.on(MeetEvent.answer, ({ answer, receiverID }) => {
      io.to(receiverID).emit(MeetEvent.answer, { answer, senderID: socket.id });
    });

    socket.on('mute', (meetingID, muted, who) => {
      console.log('asd');
      const meetingChannel = Object.keys(meetingMembers).find((v) => v === meetingID.toString());
      console.log(meetingMembers, meetingID);
      if (!meetingChannel) return;
      io.to(RoomPrefix.RTC + meetingID).emit('setMuted', who, muted);
    });

    const leaveMeeting = () => {
      const meetingID = socketToMeeting[socket.id];
      if (meetingMembers[meetingID])
        meetingMembers[meetingID] = meetingMembers[meetingID].filter(
          (member) => member.socketID !== socket.id,
        );
      console.log(RoomPrefix.RTC + meetingID);
      io.to(RoomPrefix.RTC + meetingID).emit(MeetEvent.leaveMember, socket.id);
    };
    socket.on(MeetEvent.leaveMeeting, leaveMeeting);
    socket.on(ConnectionEvent.disconnect, leaveMeeting);
  });
}
