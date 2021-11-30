import { NextFunction, Request, Response } from 'express';
import { userRepository, chattingChannelRepository } from '../../loaders/orm.loader';
import { createChatMSG } from '../../messages';

export const createChatValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, files } = req.body;
    const { chattingChannelID } = req.params;
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const chattingChannel = await chattingChannelRepository.findOne({
      where: { id: chattingChannelID },
    });

    if (!user) return res.status(400).send(createChatMSG.userNotFound);
    if (!content.trim() && !files.length) return res.status(400).send(createChatMSG.emptyChat);
    if (!chattingChannel) return res.status(400).send(createChatMSG.channelNotFound);

    req.body.user = user;
    req.body.chattingChannel = chattingChannel;
    next();
  } catch (e) {
    next(e);
  }
};
