import { NextFunction, Request, Response } from 'express';
import { userRepository, chattingChannelRepository } from '../../loaders/orm.loader';
import { createChatMSG } from '../../messages';
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

    if (!user) throw new CustomError({ message: createChatMSG.userNotFound, status: 400 });
    if (!content.trim() && !files.length)
      throw new CustomError({ message: createChatMSG.emptyChat, status: 400 });
    if (!chattingChannel)
      throw new CustomError({ message: createChatMSG.channelNotFound, status: 400 });

    req.body.user = user;
    req.body.chattingChannel = chattingChannel;
    next();
  }
}

const channelValidator = new ChannelValidator();

export { channelValidator };
