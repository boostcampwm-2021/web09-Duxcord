import { io, userConnectionInfo } from '../../loaders/socket.loader';
import ConnectionEvent from '../../types/socket/ConnectionEvent';
import GroupEvent from '../../types/socket/GroupEvent';

function SocketGroupController(socket) {
  this.groupID = (groupID, user) => {
    if (!userConnectionInfo[groupID]) return;
    if (user && !userConnectionInfo[groupID]?.some((v) => v.loginID === user.loginID))
      userConnectionInfo[groupID] = [
        ...userConnectionInfo[groupID],
        { ...user, socketID: socket.id },
      ];
    socket.emit(GroupEvent.groupUserConnection, userConnectionInfo[groupID]);
  };

  this.login = (groups, user) => {
    if (!user || !groups) return;
    groups?.forEach(({ code }) => {
      socket.join(`${code}`);
      io.to(`${code}`).emit(GroupEvent.userEnter, user, code);
      if (userConnectionInfo[code]) {
        const currentUserIndex = userConnectionInfo[code].findIndex(
          (v) => v.loginID === user.loginID,
        );
        if (currentUserIndex === -1) {
          userConnectionInfo[code].push({ ...user, socketID: [socket.id] });
        } else {
          userConnectionInfo[code][currentUserIndex].socketID.push(socket.id);
        }
      } else {
        userConnectionInfo[code] = [{ ...user, socketID: [socket.id] }];
      }
    });

    const userDisconnect = () => {
      Object.keys(userConnectionInfo).forEach((v) => {
        let isCompleteDisconnect = false;
        userConnectionInfo[v].forEach((oneUser) => {
          if (oneUser.loginID === user.loginID) {
            oneUser.socketID = oneUser.socketID.filter((socketID) => socketID !== socket.id);
          }
          if (oneUser.socketID.length === 0) isCompleteDisconnect = true;
        });
        if (isCompleteDisconnect) {
          userConnectionInfo[v] = userConnectionInfo[v].filter((a) => a.loginID !== user.loginID);
          groups?.forEach(({ code }) => {
            io.to(`${code}`).emit(GroupEvent.userExit, user, code);
          });
        }
      });
    };

    socket.on(ConnectionEvent.disconnect, userDisconnect);
  };
}

export default SocketGroupController;
