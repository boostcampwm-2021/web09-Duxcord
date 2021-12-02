import { Server } from 'socket.io';
import SocketChannelController from '../controllers/socket/channel.socket';
import SocketChatController from '../controllers/socket/chat.socket';
import SocketGroupController from '../controllers/socket/group.socket';
import SocketMeetController from '../controllers/socket/meet.socket';
import ChannelEvent from '../types/socket/ChannelEvent';
import ChatEvent from '../types/socket/ChatEvent';
import ConnectionEvent from '../types/socket/ConnectionEvent';
import GroupEvent from '../types/socket/GroupEvent';
import { InitEvent } from '../types/socket/InitEvent';
import MeetEvent from '../types/socket/MeetEvent';
import LikeEvent from '../types/socket/LikeEvent';
import ThreadEvent from '../types/socket/ThreadEvent';

export let io: Server;
export const userConnectionInfo = {};
export const meetingMembers = {};
export const socketToMeeting = {};

export async function socketLoader(httpServer, sessionMiddleware) {
  io = new Server(httpServer);
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });
  io.on(ConnectionEvent.connection, (socket) => {
    const groupController = new SocketGroupController(socket);
    socket.on(GroupEvent.groupID, groupController.groupID);
    socket.on(GroupEvent.login, groupController.login);
    socket.on(GroupEvent.groupDelete, (code) => {
      delete userConnectionInfo[code];
      io.to(code).emit(GroupEvent.groupDelete, code);
      socket.leave(code);
    });
    socket.on(GroupEvent.channelDelete, ({ id, type, code }) => {
      io.to(code).emit(GroupEvent.channelDelete, { id, type, code });
    });

    const chatController = new SocketChatController(socket);
    socket.on(ChatEvent.chat, chatController.onChat);
    socket.on(ThreadEvent.thread, chatController.onThread);

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
    socket.on(MeetEvent.setDeviceState, meetController.setDeviceState);

    io.to(socket.id).emit(InitEvent.INIT_END);
  });
}
