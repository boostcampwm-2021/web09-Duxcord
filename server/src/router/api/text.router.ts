import { Router } from 'express';
import textController from '../../controller/text.controller';
import { accessControl } from '../../util';
export const textRouter = Router();

textRouter.post('/:id/thread/create', accessControl({ signIn: true }), textController.createThread);
