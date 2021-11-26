import { NextFunction, Request, Response } from 'express';

import {
  chattingChannelRepository,
  userRepository,
  chatRepository,
  fileRepository,
} from '../loaders/orm.loader';

import { Chat } from '../db/entities';
import { File } from '../db/entities';
import { broadcast } from '../utils';
import { createChatMSG } from '../messages';

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
    const { files } = req.body;
    const { chattingChannelID } = req.params;
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const chattingChannel = await chattingChannelRepository.findOne({
      where: { id: chattingChannelID },
    });

    if (!user) return res.status(400).send(createChatMSG.userNotFound);
    if (!content.trim() && !files.length) return res.status(400).send(createChatMSG.emptyChat);

    const newChat = new Chat();
    newChat.content = content;
    newChat.user = user;
    newChat.chattingChannel = chattingChannel;

    await chatRepository.save(newChat);

    const chat = await chatRepository.findOne({
      where: { id: newChat.id },
    });

    files.forEach(async (file) => {
      const newFile = new File();
      newFile.src = file;
      newFile.chat = chat;

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
      channelID: chattingChannelID,
    });

    return res.status(200).send(createChatMSG.success);
  } catch (error) {
    next(error);
  }
};

export default { getChat, createChat };
