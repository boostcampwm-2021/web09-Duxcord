import { Router } from 'express';
import channelController from '../../controllers/channel.controller';
import { accessControl } from '../../utils';
import { channelValidator } from '../../utils/validators';

export const channelRouter = Router();

channelRouter.post(
  '/:chattingChannelID/create',
  accessControl({ signIn: true }),
  channelValidator.createChatValidator,
  channelController.createChat,
);
channelRouter.get(
  '/:chattingChannelID',
  accessControl({ signIn: true }),
  channelController.getChat,
);
