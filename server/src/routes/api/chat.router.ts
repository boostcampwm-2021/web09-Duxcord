import { Router } from 'express';
import chatController from '../../controllers/chat.controller';
import { accessControl } from '../../utils';
import { chatValidator } from '../../utils/validators';

export const chatRouter = Router();

chatRouter.post(
  '/:chatID/thread/create',
  accessControl({ signIn: true }),
  chatValidator.createThreadValidator,
  chatController.createThread,
);
chatRouter.post(
  '/:chatID/reaction',
  accessControl({ signIn: true }),
  chatValidator.reactionValidator,
  chatController.handleReaction,
);
chatRouter.get(
  '/:chatID/thread',
  accessControl({ signIn: true }),
  chatValidator.getThreadValidator,
  chatController.getThread,
);
