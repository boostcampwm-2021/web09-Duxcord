import { NextFunction, Request, Response } from 'express';
import { userRepository, chatRepository } from '../../loaders/orm.loader';
import { createChatMSG, handleReactionMSG } from '../../messages';

export const reactionValidator = async (req: Request, res: Response, next: NextFunction) => {
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

    req.body.user = user;
    req.body.chat = chat;
    next();
  } catch (e) {
    next(e);
  }
};

export const createThreadValidator = async (req: Request, res: Response, next: NextFunction) => {
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

    req.body.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

export const getThreadValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatID } = req.params;
    const chat = await chatRepository.findOne({ where: { id: chatID } });
    if (!chat) return res.status(400).send(createChatMSG.chatNotFound);
    next();
  } catch (e) {
    next(e);
  }
};
