import { Server } from 'socket.io';

export let io: Server;

export async function socketInit(httpServer) {
  io = new Server(httpServer);

  io.on('connection', (socket) => {
    socket.on('joinChannel', (channelID) => {
      socket.join(`${channelID}`);
    });
    socket.on('leaveChannel', (channelID) => {
      socket.leave(`${channelID}`);
    });
  });
}
