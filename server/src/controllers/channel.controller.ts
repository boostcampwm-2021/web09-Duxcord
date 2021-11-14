import { NextFunction, Request, Response } from 'express';

import { chattingChannelRepository, userRepository, chatRepository } from '../loaders/ormLoader';

import { Chat } from '../db/entities';
import { io } from '../loaders/socketLoader';

export const createChatMSG = {
  userNotFound: '존재하지 않는 사용자 입니다.',
  emptyChat: '채팅을 입력해 주세요.',
  success: '메시지 전송 성공!',
};

const getChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userID } = req.session;
    const { chattingChannelID } = req.params;
    const page = Number(req.query.page);
    const chats = await chatRepository.findChatsByPages(chattingChannelID, page, userID);

    return res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const { chattingChannelID } = req.params;
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const chattingChannel = await chattingChannelRepository.findOne({
      where: { id: chattingChannelID },
    });

    if (!user) return res.status(400).send(createChatMSG.userNotFound);
    if (!content.trim()) return res.status(400).send(createChatMSG.emptyChat);

    const newChat = new Chat();
    newChat.content = content;
    newChat.user = user;
    newChat.chattingChannel = chattingChannel;

    await chatRepository.save(newChat);

    io.to(`chatting${chattingChannelID}`).emit('chat', {
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
    });

    return res.status(200).send(createChatMSG.success);
  } catch (error) {
    next(error);
  }
};

export default { getChat, createChat };
