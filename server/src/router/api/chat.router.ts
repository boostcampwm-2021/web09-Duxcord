import { Router } from 'express';
import chatController from '../../controller/chat.controller';
import { accessControl } from '../../util';
export const chatRouter = Router();

chatRouter.post(
  '/:chatID/thread/create',
  accessControl({ signIn: true }),
  chatController.createThread,
);
chatRouter.post(
  '/:chatID/reaction',
  accessControl({ signIn: true }),
  chatController.handleReaction,
);
