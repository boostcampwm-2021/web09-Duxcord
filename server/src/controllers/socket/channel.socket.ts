function SocketChannelController(socket) {
  this.joinChannel = (channelID) => {
    socket.join(channelID);
  };

  this.leaveChannel = (channelID) => {
    socket.leave(channelID);
  };
}

export default SocketChannelController;
