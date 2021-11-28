import { Router } from 'express';
import channelController from '../../controllers/channel.controller';
import { accessControl } from '../../utils';
import { createChatValidator } from '../../utils/validators';

export const channelRouter = Router();

channelRouter.post(
  '/:chattingChannelID/create',
  accessControl({ signIn: true }),
  createChatValidator,
  channelController.createChat,
);
channelRouter.get(
  '/:chattingChannelID',
  accessControl({ signIn: true }),
  channelController.getChat,
);
