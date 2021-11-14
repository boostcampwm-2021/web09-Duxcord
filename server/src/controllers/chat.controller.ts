import { NextFunction, Request, Response } from 'express';

import {
  userRepository,
  chatRepository,
  threadRepository,
  reactionRepository,
} from '../loaders/ormLoader';

import { Thread } from '../db/entities';
import { io } from '../loaders/socketLoader';

export const createChatMSG = {
  userNotFound: '존재하지 않는 사용자 입니다.',
  chatNotFound: '존재하지 않는 텍스트 입니다.',
  emptyChat: '채팅을 입력해 주세요.',
  success: '스레드 전송 성공!',
};

const handleReactionMSG = {
  userNotFound: '존재하지 않는 사용자 입니다.',
  chatNotFound: '존재하지 않는 텍스트 입니다.',
  deleteReactionSuccess: '좋아요 지우기 성공!',
  addReactionSuccess: '좋아요 만들기 성공!',
};

const handleReaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatID } = req.params;
    const { userID } = req.session;

    const user = await userRepository.findOne({ where: { id: userID } });
    const chat = await chatRepository.findOne({
      where: { id: chatID },
      relations: ['chattingChannel'],
    });
    if (!user) return res.status(400).send(handleReactionMSG.userNotFound);
    if (!chat) return res.status(400).send(handleReactionMSG.chatNotFound);

    const reaction = await reactionRepository.findOne({ where: { user: user, chat: chat } });

    if (!reaction) {
      await reactionRepository.insert({ user: user, chat: chat });
      chat.reactionsCount += 1;
      await chatRepository.save(chat);
      io.to(`chatting${chat.chattingChannel.id}`).emit('like', {
        chatID: chat.id,
        reactionsCount: chat.reactionsCount,
      });
      return res.status(201).json({ chat, message: handleReactionMSG.addReactionSuccess });
    } else {
      await reactionRepository.remove(reaction);
      chat.reactionsCount -= 1;
      await chatRepository.save(chat);
      io.to(`chatting${chat.chattingChannel.id}`).emit('like', {
        chatID: chat.id,
        reactionsCount: chat.reactionsCount,
      });
      return res.status(204).json({ chat, message: handleReactionMSG.deleteReactionSuccess });
    }
  } catch (error) {
    next(error);
  }
};

const createThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const { chatID } = req.params;
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const chat = await chatRepository.findOne({
      where: { id: chatID },
      relations: ['chattingChannel'],
    });

    if (!user) return res.status(400).send(createChatMSG.userNotFound);
    if (!chat) return res.status(400).send(createChatMSG.chatNotFound);
    if (!content || !content.trim()) return res.status(400).send(createChatMSG.emptyChat);

    const newThread = new Thread();
    newThread.content = content;
    newThread.user = user;
    newThread.chat = chat;

    await threadRepository.save(newThread);

    chat.threadsCount += 1;
    chat.threadWriter = user;
    chat.threadLastTime = newThread.createdAt;
    await chatRepository.save(chat);

    io.to(`chatting${chat.chattingChannel.id}`).emit('thread', {
      chatID: chat.id,
      threadsCount: chat.threadsCount,
      threadWriter: chat.threadWriter,
      threadLastTime: chat.threadLastTime,
    });

    io.to(`thread${chatID}`).emit('threadUpdate', {
      id: newThread.id,
      threadWriter: chat.threadWriter,
      content: newThread.content,
      createdAt: newThread.createdAt,
    });

    return res.status(200).send(createChatMSG.success);
  } catch (error) {
    next(error);
  }
};

const getThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatID } = req.params;
    const chat = await chatRepository.findOne({ where: { id: chatID } });
    if (!chat) return res.status(400).send(createChatMSG.chatNotFound);

    const threads = await threadRepository.findThreadsByChatID(chatID);

    return res.status(200).send(threads);
  } catch (error) {
    next(error);
  }
};

export default { createThread, handleReaction, getThread };
