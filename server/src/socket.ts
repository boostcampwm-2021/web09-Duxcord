import { Server } from 'socket.io';

export let io: Server;

export async function socketInit(httpServer) {
  const userConnectionInfo = {};
  const meetingMembers = {};
  const socketToMeeting = {};

  io = new Server(httpServer);
  io.on('connection', (socket) => {
    socket.on('GroupID', (groupID, user) => {
      if (user && !userConnectionInfo[groupID].map((v) => v.loginID).includes(user.loginID))
        userConnectionInfo[groupID] = [...userConnectionInfo[groupID], user];
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
        groups?.forEach(({ code }) => {
          socket.leave(code);
          io.to(`${code}`).emit('userExit', user, code);
        });
      });
    });

    const checkMeetingUserList = (meetingchannelList) => {
      const meetingUserList = {};
      Object.entries(meetingMembers).forEach(([channel, user]) => {
        const channelID = Number(channel);
        if (!meetingchannelList.includes(channelID)) return;
        if (meetingUserList[channelID]) {
          meetingUserList[channelID].push(user);
        } else {
          meetingUserList[channelID] = [user];
        }
      });
      return meetingUserList;
    };

    socket.on('MeetingChannelList', (code, meetingchannelList) => {
      const meetingUserList = checkMeetingUserList(meetingchannelList);
      io.to(code).emit('MeetingUserList', meetingUserList);
    });

    socket.on('joinChannel', (channelID) => {
      socket.join(channelID);
    });

    socket.on('leaveChannel', (channelID) => {
      socket.leave(channelID);
    });

    socket.on('meetChat', ({ channelID, chat }) => {
      io.to('meeting' + channelID).emit('meetChat', chat);
    });

    socket.on('joinMeeting', (meetingID, { loginID, username, thumbnail }) => {
      socket.join('rtc' + meetingID);
      socketToMeeting[socket.id] = meetingID;
      const newMember = {
        socketID: socket.id,
        loginID,
        username,
        thumbnail,
      };

      if (meetingID in meetingMembers) {
        const memberList = meetingMembers[meetingID].map((member) => member.socketID);
        if (memberList.includes(newMember.socketID)) return;
        meetingMembers[meetingID].push(newMember);
      } else {
        meetingMembers[meetingID] = [newMember];
      }

      const membersInMeeting = meetingMembers[meetingID].filter(
        (user) => user.socketID !== socket.id,
      );

      io.to(socket.id).emit('allMeetingMembers', membersInMeeting);
    });

    socket.on('candidate', ({ candidate, receiverID }) => {
      io.to(receiverID).emit('candidate', { candidate, senderID: socket.id });
    });

    socket.on('offer', ({ offer, receiverID, member }) => {
      io.to(receiverID).emit('offer', { offer, member });
    });

    socket.on('answer', ({ answer, receiverID }) => {
      io.to(receiverID).emit('answer', { answer, senderID: socket.id });
    });

    const leaveMeeting = () => {
      const meetingID = socketToMeeting[socket.id];
      if (meetingMembers[meetingID])
        meetingMembers[meetingID] = meetingMembers[meetingID].filter(
          (member) => member.socketID !== socket.id,
        );
      io.to('rtc' + meetingID).emit('leaveMember', socket.id);
    };
    socket.on('leaveMeeting', leaveMeeting);
    socket.on('disconnect', leaveMeeting);
  });
}
