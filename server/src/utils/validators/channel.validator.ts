import { NextFunction, Request, Response } from 'express';
import { userRepository, chattingChannelRepository } from '../../loaders/orm.loader';
import { CREATE_CHAT_MSG } from '../../messages';
import { CatchError, CustomError } from '../CatchError';

class ChannelValidator {
  @CatchError
  async createChatValidator(req: Request, res: Response, next: NextFunction) {
    const { content, files } = req.body;
    const { chattingChannelID } = req.params;
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const chattingChannel = await chattingChannelRepository.findOne({
      where: { id: chattingChannelID },
    });

    if (!user) throw new CustomError({ message: CREATE_CHAT_MSG.USER_NOT_FOUND, status: 400 });
    if (!content.trim() && !files.length)
      throw new CustomError({ message: CREATE_CHAT_MSG.EMPTY_CHAT, status: 400 });
    if (!chattingChannel)
      throw new CustomError({ message: CREATE_CHAT_MSG.CHANNEL_NOT_FOUND, status: 400 });

    req.body.user = user;
    req.body.chattingChannel = chattingChannel;
    next();
  }
}

const channelValidator = new ChannelValidator();

export { channelValidator };
