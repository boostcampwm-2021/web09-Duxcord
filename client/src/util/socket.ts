import { io } from 'socket.io-client';

export const socket = io('/');
socket.connect();
