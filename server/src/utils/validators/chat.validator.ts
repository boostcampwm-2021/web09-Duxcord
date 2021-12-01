import { NextFunction, Request, Response } from 'express';
import { userRepository, chatRepository } from '../../loaders/orm.loader';
import { CREATE_CHAT_MSG, HANDLE_REACTION_MSG } from '../../messages';
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
    if (!user) throw new CustomError({ message: HANDLE_REACTION_MSG.USER_NOT_FOUND, status: 400 });
    if (!chat) throw new CustomError({ message: HANDLE_REACTION_MSG.CHAT_NOT_FOUND, status: 400 });

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

    if (!user) throw new CustomError({ message: CREATE_CHAT_MSG.USER_NOT_FOUND, status: 400 });
    if (!chat) throw new CustomError({ message: CREATE_CHAT_MSG.CHAT_NOT_FOUND, status: 400 });
    if (!content || !content.trim())
      throw new CustomError({ message: CREATE_CHAT_MSG.EMPTY_CHAT, status: 400 });

    req.body.user = user;
    req.body.chat = chat;
    next();
  }

  @CatchError
  async getThreadValidator(req: Request, res: Response, next: NextFunction) {
    const { chatID } = req.params;
    const chat = await chatRepository.findOne({ where: { id: chatID } });
    if (!chat) throw new CustomError({ message: CREATE_CHAT_MSG.CHAT_NOT_FOUND, status: 400 });
    next();
  }
}

const chatValidator = new ChatValidator();

export { chatValidator };
