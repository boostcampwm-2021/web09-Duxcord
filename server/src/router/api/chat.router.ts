import { Router } from 'express';
import chatController from '../../controller/chat.controller';
import { accessControl } from '../../util';
export const chatRouter = Router();

chatRouter.post('/:id/thread/create', accessControl({ signIn: true }), chatController.createThread);
