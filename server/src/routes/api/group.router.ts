import { Router } from 'express';
import groupController from '../../controllers/group.controller';
import { accessControl } from '../../utils';

export const groupRouter = Router();

groupRouter.post('/create', accessControl({ signIn: true }), groupController.createGroup);
groupRouter.get('/:id/members', accessControl({ signIn: true }), groupController.getGroupMembers);
groupRouter.post(
  '/:id/channel/create',
  accessControl({ signIn: true }),
  groupController.createChannel,
);
groupRouter.post('/join', accessControl({ signIn: true }), groupController.joinGroup);
groupRouter.delete('/:id', accessControl({ signIn: true }), groupController.deleteGroup);
