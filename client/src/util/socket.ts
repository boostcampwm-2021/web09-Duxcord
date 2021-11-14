import { io } from 'socket.io-client';
import ChannelEvent from '../types/socket/ChannelEvent';

export const socket = io('/');
socket.connect();

const joinChannel = ({ channelType, id }: { channelType: 'chatting' | 'meeting'; id: number }) =>
  socket.emit(ChannelEvent.joinChannel, channelType + id);

const leaveChannel = ({ channelType, id }: { channelType: 'chatting' | 'meeting'; id: number }) =>
  socket.emit(ChannelEvent.leaveChannel, channelType + id);

const Socket = { socket, joinChannel, leaveChannel };

export default Socket;
