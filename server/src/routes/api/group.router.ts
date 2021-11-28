import { Router } from 'express';
import groupController from '../../controllers/group.controller';
import { accessControl } from '../../utils';
import { createGroupValidator } from '../../utils/validators/group.validator';

export const groupRouter = Router();

groupRouter.post(
  '/create',
  accessControl({ signIn: true }),
  createGroupValidator,
  groupController.createGroup,
);
groupRouter.get('/:id/members', accessControl({ signIn: true }), groupController.getGroupMembers);
groupRouter.post(
  '/:id/channel/create',
  accessControl({ signIn: true }),
  groupController.createChannel,
);
groupRouter.post('/join', accessControl({ signIn: true }), groupController.joinGroup);
groupRouter.delete('/:id', accessControl({ signIn: true }), groupController.deleteGroup);
groupRouter.delete(
  '/:groupID/:channelType/:channelID',
  accessControl({ signIn: true }),
  groupController.deleteChannel,
);
