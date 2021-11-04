import { Router } from 'express';
import channelController from '../../controller/channel.controller';
import { accessControl } from '../../util';
export const channelRouter = Router();

channelRouter.post(
  '/:textChannelId/create',
  accessControl({ signIn: true }),
  channelController.createText,
);
channelRouter.get('/:textChannelId', accessControl({ signIn: true }), channelController.getText);
