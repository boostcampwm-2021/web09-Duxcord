import { Router } from 'express';
import channelController from '../../controller/channel.controller';
import { accessControl } from '../../util';
export const channelRouter = Router();

channelRouter.use(
  '/:textChannelId/create',
  accessControl({ signIn: true }),
  channelController.createText,
);
