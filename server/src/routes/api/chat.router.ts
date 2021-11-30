import { Router } from 'express';
import chatController from '../../controllers/chat.controller';
import { accessControl } from '../../utils';
import {
  createThreadValidator,
  getThreadValidator,
  reactionValidator,
} from '../../utils/validators';

export const chatRouter = Router();

chatRouter.post(
  '/:chatID/thread/create',
  accessControl({ signIn: true }),
  createThreadValidator,
  chatController.createThread,
);
chatRouter.post(
  '/:chatID/reaction',
  accessControl({ signIn: true }),
  reactionValidator,
  chatController.handleReaction,
);
chatRouter.get(
  '/:chatID/thread',
  accessControl({ signIn: true }),
  getThreadValidator,
  chatController.getThread,
);
