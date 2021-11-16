import { io } from '../loaders/socket.loader';
import ChatEvent from '../types/socket/ChatEvent';
import LikeEvent from '../types/socket/LikeEvent';
import RoomPrefix from '../types/socket/RoomPrefix';
import ThreadEvent from '../types/socket/ThreadEvent';

const newChat = ({ newChat, channelID }) => {
  io.to(RoomPrefix.chatting + channelID).emit(ChatEvent.chat, newChat);
};

const newThread = ({ newThread, chatID }) => {
  io.to(RoomPrefix.thread + chatID).emit(ThreadEvent.threadUpdate, newThread);
};

const threadInfo = ({ threadInfo, channelID }) => {
  io.to(RoomPrefix.chatting + channelID).emit(ThreadEvent.thread, threadInfo);
};

const reactionInfo = ({ reactionInfo, channelID }) => {
  io.to(RoomPrefix.chatting + channelID).emit(LikeEvent.like, reactionInfo);
};

export const broadcast = { newChat, newThread, threadInfo, reactionInfo };
