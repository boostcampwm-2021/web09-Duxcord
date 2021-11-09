import { io } from 'socket.io-client';

export const socket = io('/');
socket.connect();

const joinChannel = ({ channelType, id }: { channelType: 'chatting' | 'meeting'; id: number }) =>
  socket.emit('joinChannel', channelType + id);

const leaveChannel = ({ channelType, id }: { channelType: 'chatting' | 'meeting'; id: number }) =>
  socket.emit('leaveChannel', channelType + id);

const Socket = { socket, joinChannel, leaveChannel };

export default Socket;
