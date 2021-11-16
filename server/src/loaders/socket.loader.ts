import { Server } from 'socket.io';
import SocketChannelController from '../controllers/socket/channel.socket';
import SocketGroupController from '../controllers/socket/group.socket';
import SocketMeetController from '../controllers/socket/meet.socket';
import ChannelEvent from '../types/socket/ChannelEvent';
import ConnectionEvent from '../types/socket/ConnectionEvent';
import GroupEvent from '../types/socket/GroupEvent';
import MeetEvent from '../types/socket/MeetEvent';

export let io: Server;
export const userConnectionInfo = {};
export const meetingMembers = {};
export const socketToMeeting = {};

export async function socketLoader(httpServer) {
  io = new Server(httpServer);
  io.on(ConnectionEvent.connection, (socket) => {
    const groupController = new SocketGroupController(socket);
    socket.on(GroupEvent.groupID, groupController.groupID);
    socket.on(GroupEvent.login, groupController.login);
    socket.on(GroupEvent.groupDelete, (code) => {
      delete userConnectionInfo[code];
      io.to(code).emit(GroupEvent.groupDelete, code);
      socket.leave(code);
    });

    const channelController = new SocketChannelController(socket);
    socket.on(ChannelEvent.joinChannel, channelController.joinChannel);
    socket.on(ChannelEvent.leaveChannel, channelController.leaveChannel);

    const meetController = new SocketMeetController(socket);
    socket.on(MeetEvent.meetChat, meetController.meetChat);
    socket.on(MeetEvent.joinMeeting, meetController.joinMeeting);
    socket.on(MeetEvent.offer, meetController.offer);
    socket.on(MeetEvent.answer, meetController.answer);
    socket.on(MeetEvent.candidate, meetController.candidate);
    socket.on(MeetEvent.leaveMeeting, meetController.leaveMeeting);
    socket.on(ConnectionEvent.disconnect, meetController.leaveMeeting);
    socket.on(MeetEvent.MeetingChannelList, meetController.meetingChannelUserList);
  });
}
