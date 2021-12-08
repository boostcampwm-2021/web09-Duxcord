import { Chat, File, Thread } from '../../db/entities';
import {
  userRepository,
  chattingChannelRepository,
  chatRepository,
  fileRepository,
  threadRepository,
} from '../../loaders/orm.loader';
import { io } from '../../loaders/socket.loader';
import { CREATE_CHAT_MSG, HANDLE_REACTION_MSG } from '../../messages';
import { broadcast } from '../../utils';
import { CustomError } from '../../utils/CatchError';

function SocketChatController(socket) {
  this.onChat = async ({ content, files, chattingChannelID }) => {
    try {
      const { userID } = socket.request.session;
      const user = await userRepository.findOne({ where: { id: userID } });
      const chattingChannel = await chattingChannelRepository.findOne({
        where: { id: chattingChannelID },
      });

      if (!user) throw new CustomError({ message: CREATE_CHAT_MSG.USER_NOT_FOUND, status: 400 });
      if (!content.trim() && !files.length)
        throw new CustomError({ message: CREATE_CHAT_MSG.EMPTY_CHAT, status: 400 });
      if (!chattingChannel)
        throw new CustomError({ message: CREATE_CHAT_MSG.CHANNEL_NOT_FOUND, status: 400 });

      const newChat = new Chat();
      newChat.content = content;
      newChat.user = user;
      newChat.chattingChannel = chattingChannel;

      await chatRepository.save(newChat);

      files.forEach(async (file) => {
        const newFile = new File();
        newFile.src = file;
        newFile.chat = newChat;

        await fileRepository.save(newFile);
      });

      const sendFiles = files.map((file) => ({ src: file }));

      broadcast.newChat({
        newChat: {
          id: newChat.id,
          createdAt: newChat.createdAt,
          updatedAt: newChat.updatedAt,
          content: newChat.content,
          reactionsCount: newChat.reactionsCount,
          reactions: [],
          threadsCount: newChat.threadsCount,
          threadWriter: null,
          user: {
            id: user.id,
            thumbnail: user.thumbnail,
            username: user.username,
          },
          files: sendFiles,
        },
        channelID: `${chattingChannel.id}`,
      });
    } catch (e) {
      console.error(e.message);
      io.to(socket.id).emit('chatFail');
    }
  };

  this.onThread = async ({ content, chatID }) => {
    try {
      const { userID } = socket.request.session;
      const user = await userRepository.findOne({ where: { id: userID } });
      const chat = await chatRepository.findOne({
        where: { id: chatID },
        relations: ['chattingChannel'],
      });
      if (!user)
        throw new CustomError({ message: HANDLE_REACTION_MSG.USER_NOT_FOUND, status: 400 });
      if (!chat)
        throw new CustomError({ message: HANDLE_REACTION_MSG.CHAT_NOT_FOUND, status: 400 });
      const newThread = new Thread();
      newThread.content = content;
      newThread.user = user;
      newThread.chat = chat;

      await threadRepository.save(newThread);

      chat.threadsCount += 1;
      chat.threadWriter = user;
      chat.threadLastTime = newThread.createdAt;
      await chatRepository.save(chat);

      broadcast.threadInfo({
        threadInfo: {
          chatID: chat.id,
          threadsCount: chat.threadsCount,
          threadWriter: chat.threadWriter,
          threadLastTime: chat.threadLastTime,
        },
        channelID: chat.chattingChannel.id,
      });

      broadcast.newThread({
        newThread: {
          id: newThread.id,
          threadWriter: chat.threadWriter,
          content: newThread.content,
          createdAt: newThread.createdAt,
        },
        chatID: chat.id,
      });
    } catch (e) {
      io.to(socket.id).emit('threadFail');
    }
  };
}

export default SocketChatController;
