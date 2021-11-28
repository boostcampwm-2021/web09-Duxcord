import { Router } from 'express';
import groupController from '../../controllers/group.controller';
import { accessControl } from '../../utils';
import {
  createChannelValidator,
  createGroupValidator,
  deleteChannelValidator,
  deleteGroupValidator,
  groupIDValidator,
  joinGroupValidator,
} from '../../utils/validators';

export const groupRouter = Router();

groupRouter.post(
  '/create',
  accessControl({ signIn: true }),
  createGroupValidator,
  groupController.createGroup,
);
groupRouter.get(
  '/:id/members',
  accessControl({ signIn: true }),
  groupIDValidator,
  groupController.getGroupMembers,
);
groupRouter.post(
  '/:id/channel/create',
  accessControl({ signIn: true }),
  groupIDValidator,
  createChannelValidator,
  groupController.createChannel,
);
groupRouter.post(
  '/join',
  accessControl({ signIn: true }),
  joinGroupValidator,
  groupController.joinGroup,
);
groupRouter.delete(
  '/:id',
  accessControl({ signIn: true }),
  deleteGroupValidator,
  groupController.deleteGroup,
);
groupRouter.delete(
  '/:groupID/:channelType/:channelID',
  accessControl({ signIn: true }),
  deleteChannelValidator,
  groupController.deleteChannel,
);
