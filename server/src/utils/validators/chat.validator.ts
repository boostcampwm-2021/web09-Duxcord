import { NextFunction, Request, Response } from 'express';
import { userRepository, chatRepository } from '../../loaders/orm.loader';
import { createChatMSG, handleReactionMSG } from '../../messages';
import { CatchError, CustomError } from '../CatchError';

class ChatValidator {
  @CatchError
  async reactionValidator(req: Request, res: Response, next: NextFunction) {
    const { chatID } = req.params;
    const { userID } = req.session;

    const user = await userRepository.findOne({ where: { id: userID } });
    const chat = await chatRepository.findOne({
      where: { id: chatID },
      relations: ['chattingChannel'],
    });
    if (!user) throw new CustomError({ message: handleReactionMSG.userNotFound, status: 400 });
    if (!chat) throw new CustomError({ message: handleReactionMSG.chatNotFound, status: 400 });

    req.body.user = user;
    req.body.chat = chat;
    next();
  }

  @CatchError
  async createThreadValidator(req: Request, res: Response, next: NextFunction) {
    const { content } = req.body;
    const { chatID } = req.params;
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const chat = await chatRepository.findOne({
      where: { id: chatID },
      relations: ['chattingChannel'],
    });

    if (!user) throw new CustomError({ message: createChatMSG.userNotFound, status: 400 });
    if (!chat) throw new CustomError({ message: createChatMSG.chatNotFound, status: 400 });
    if (!content || !content.trim())
      throw new CustomError({ message: createChatMSG.emptyChat, status: 400 });

    req.body.user = user;
    req.body.chat = chat;
    next();
  }

  async getThreadValidator(req: Request, res: Response, next: NextFunction) {
    const { chatID } = req.params;
    const chat = await chatRepository.findOne({ where: { id: chatID } });
    if (!chat) throw new CustomError({ message: createChatMSG.chatNotFound, status: 400 });
    next();
  }
}

const chatValidator = new ChatValidator();

export { chatValidator };
