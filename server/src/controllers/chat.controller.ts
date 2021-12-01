import { NextFunction, Request, Response } from 'express';

import { chatRepository, threadRepository, reactionRepository } from '../loaders/orm.loader';

import { Thread } from '../db/entities';
import { broadcast } from '../utils';
import { handleReactionMSG, createChatMSG } from '../messages';
import { CatchError } from '../utils/CatchError';

class ChatController {
  @CatchError
  async handleReaction(req: Request, res: Response, next: NextFunction) {
    const { user, chat } = req.body;

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
  }

  @CatchError
  async createThread(req: Request, res: Response, next: NextFunction) {
    const { chat, user, content } = req.body;
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
  }

  @CatchError
  async getThread(req: Request, res: Response, next: NextFunction) {
    const { chatID } = req.params;
    const threads = await threadRepository.findThreadsByChatID(chatID);

    return res.status(200).send(threads);
  }
}

export default new ChatController();
