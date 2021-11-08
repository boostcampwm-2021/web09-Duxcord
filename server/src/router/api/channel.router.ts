import { Router } from 'express';
import channelController from '../../controller/channel.controller';
import { accessControl } from '../../util';
export const channelRouter = Router();

channelRouter.post(
  '/:chattingChannelID/create',
  accessControl({ signIn: true }),
  channelController.createChat,
);
channelRouter.get(
  '/:chattingChannelID',
  accessControl({ signIn: true }),
  channelController.getChat,
);
