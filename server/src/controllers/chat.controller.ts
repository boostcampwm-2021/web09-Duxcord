import { NextFunction, Request, Response } from 'express';

import {
  userRepository,
  chatRepository,
  threadRepository,
  reactionRepository,
} from '../loaders/orm.loader';

import { Thread } from '../db/entities';
import { broadcast } from '../utils';
import { handleReactionMSG, createChatMSG } from '../messages';

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

    let message;
    if (!reaction) {
      await reactionRepository.insert({ user: user, chat: chat });
      chat.reactionsCount += 1;
      message = handleReactionMSG.addReactionSuccess;
      res.status(201);
    } else {
      await reactionRepository.remove(reaction);
      chat.reactionsCount -= 1;
      message = handleReactionMSG.deleteReactionSuccess;
      res.status(204);
    }
    await chatRepository.save(chat);
    broadcast.reactionInfo({
      reactionInfo: {
        chatID: chat.id,
        reactionsCount: chat.reactionsCount,
      },
      channelID: chat.chattingChannel.id,
    });
    return res.json({ chat, message });
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
