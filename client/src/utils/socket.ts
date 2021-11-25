import { io } from 'socket.io-client';
import ChannelEvent from '@customTypes/socket/ChannelEvent';

export const socket = io('/');

const joinChannel = ({ channelType, id }: { channelType: 'chatting' | 'meeting'; id: number }) =>
  socket.emit(ChannelEvent.joinChannel, channelType + id);

const leaveChannel = ({ channelType, id }: { channelType: 'chatting' | 'meeting'; id: number }) =>
  socket.emit(ChannelEvent.leaveChannel, channelType + id);

const Socket = { socket, joinChannel, leaveChannel };

export default Socket;
