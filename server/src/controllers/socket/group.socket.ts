import { io, userConnectionInfo } from '../../loaders/socket.loader';
import ConnectionEvent from '../../types/socket/ConnectionEvent';
import GroupEvent from '../../types/socket/GroupEvent';

function SocketGroupController(socket) {
  this.groupID = (groupID, user) => {
    if (!userConnectionInfo[groupID]) return;
    if (user && !userConnectionInfo[groupID]?.some((v) => v.loginID === user.loginID))
      userConnectionInfo[groupID] = [...userConnectionInfo[groupID], user];
    socket.emit(GroupEvent.groupUserConnection, userConnectionInfo[groupID]);
  };

  this.login = (groups, user) => {
    if (!user || !groups) return;
    groups?.forEach(({ code }) => {
      socket.join(`${code}`);
      io.to(`${code}`).emit(GroupEvent.userEnter, user, code);
      if (userConnectionInfo[code]) {
        if (!userConnectionInfo[code].map((v) => v.loginID).includes(user.loginID)) {
          userConnectionInfo[code].push(user);
        }
      } else {
        userConnectionInfo[code] = [user];
      }
    });

    const userDisconnect = () => {
      Object.keys(userConnectionInfo).forEach((v) => {
        userConnectionInfo[v] = userConnectionInfo[v].filter((a) => a.loginID !== user.loginID);
      });
      groups?.forEach(({ code }) => {
        io.to(`${code}`).emit(GroupEvent.userExit, user, code);
      });
    };

    socket.on(ConnectionEvent.disconnect, userDisconnect);
  };
}

export default SocketGroupController;
