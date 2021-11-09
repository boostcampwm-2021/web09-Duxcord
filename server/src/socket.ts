import { Server } from 'socket.io';

export let io: Server;

export async function socketInit(httpServer) {
  const userConnectionInfo = {};
  io = new Server(httpServer);
  io.on('connection', (socket) => {
    //
    socket.on('GroupID', (groupID) => {
      // console.log(userConnectionInfo, groupID);
      socket.emit('GroupUserConnection', userConnectionInfo[groupID]);
    });

    socket.on('logIn', (groups, user) => {
      if (!user || !groups) return;

      groups?.forEach(({ code }) => {
        socket.join(`${code}`);
        io.to(`${code}`).emit('userEnter', user, code);
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
          userConnectionInfo[v] = userConnectionInfo[v].filter((a) => a.loginID !== user.loginID);
        });
        // console.log(userConnectionInfo);
        groups?.forEach(({ code }) => {
          socket.leave(code);
          io.to(`${code}`).emit('userExit', user, code);
        });
      });
    });

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
