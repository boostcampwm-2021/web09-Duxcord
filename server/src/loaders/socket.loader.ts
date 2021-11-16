import { Server } from 'socket.io';
import SocketMeetController from '../controllers/socket/meet.socket';
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
      const meetingUserList = checkMeetingUserList(meetingchannelList);
      io.to(code).emit(MeetEvent.MeetingUserList, meetingUserList);
    });

    socket.on(ChannelEvent.joinChannel, (channelID) => {
      socket.join(channelID);
    });

    socket.on(ChannelEvent.leaveChannel, (channelID) => {
      socket.leave(channelID);
    });

    const meetController = new SocketMeetController(socket);
    socket.on(MeetEvent.meetChat, meetController.meetChat);
    socket.on(MeetEvent.joinMeeting, meetController.joinMeeting);
    socket.on(MeetEvent.offer, meetController.offer);
    socket.on(MeetEvent.answer, meetController.answer);
    socket.on(MeetEvent.candidate, meetController.candidate);
    socket.on(MeetEvent.leaveMeeting, meetController.leaveMeeting);
    socket.on(ConnectionEvent.disconnect, meetController.leaveMeeting);
  });
}
