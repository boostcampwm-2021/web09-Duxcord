import { Server } from 'socket.io';

export let io: Server;

export async function socketInit(httpServer) {
  io = new Server(httpServer);

  io.on('connection', (socket) => {
    socket.on('joinChannel', (channelID) => {
      socket.join(`${channelID}`);
      if (channelID.startsWith('meeting')) socket.to(channelID).emit('joinMeetingChannel');
    });
    socket.on('leaveChannel', (channelID) => {
      socket.leave(`${channelID}`);
    });
    socket.on('offer', (offer, channelID) => {
      socket.to(channelID).emit('offer', offer);
    });
    socket.on('answer', (answer, channelID) => {
      socket.to(channelID).emit('answer', answer);
    });
    socket.on('ice', (ice, channelID) => {
      socket.to(channelID).emit('ice', ice);
    });
  });
}
