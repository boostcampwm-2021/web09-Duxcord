import { Server } from 'socket.io';

export let io: Server;

export async function socketInit(httpServer) {
  const userConnectionInfo = {};
  io = new Server(httpServer);
  io.on('connection', (socket) => {
    socket.on('logIn', (groups, user) => {
      if (!user || !groups) return;
      groups?.forEach(({ code }) => {
        socket.join(`${code}`);
        io.to(`${code}`).emit('userEnter', user);
        if (userConnectionInfo[code]) {
          if (!userConnectionInfo[code].map((v) => v.loginID).includes(user.loginID)) {
            userConnectionInfo[code].push(user);
          }
        } else {
          userConnectionInfo[code] = [user];
        }
      });
      const myFriendsConnectionInfo = {};
      groups
        .map((v) => v.code)
        .forEach((code) => {
          myFriendsConnectionInfo[code] = userConnectionInfo[code];
        });
      io.to(socket.id).emit('userConnectionInfo', myFriendsConnectionInfo);
      socket.on('disconnecting', () => {
        Object.keys(userConnectionInfo).forEach((v) => {
          userConnectionInfo[v] = userConnectionInfo[v].filter((a) => a.loginID === user.loginID);
        });
        groups?.forEach(({ code }) => {
          io.to(`${code}`).emit('userExit', user);
        });
      });
    });

    socket.on('joinChannel', (channelID) => {
      socket.join(`${channelID}`);
    });

    socket.on('leaveChannel', (channelID) => {
      socket.leave(`${channelID}`);
    });
  });
}
