import { NextFunction, Request, Response } from 'express';

import { chatRepository, fileRepository } from '../loaders/orm.loader';

import { Chat } from '../db/entities';
import { File } from '../db/entities';
import { broadcast } from '../utils';
import { createChatMSG } from '../messages';

const getChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userID } = req.session;
    const { chattingChannelID } = req.params;
    const page = +req.query.page;
    const chats = await chatRepository.findChatsByPages(chattingChannelID, page, userID);

    return res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, files, user, chattingChannel } = req.body;

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

    return res.status(200).send(createChatMSG.success);
  } catch (error) {
    next(error);
  }
};

export default { getChat, createChat };
