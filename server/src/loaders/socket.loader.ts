import { Server } from 'socket.io';
import SocketGroupController from '../controllers/socket/group.socket';
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
    const groupController = new SocketGroupController(socket);
    socket.on(GroupEvent.groupID, groupController.groupID);
    socket.on(GroupEvent.login, groupController.login);

    const channelController = new SocketChannelController(socket);

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
