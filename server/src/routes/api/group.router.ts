import { Router } from 'express';
import groupController from '../../controllers/group.controller';
import { accessControl } from '../../utils';
import { groupValidator } from '../../utils/validators';

export const groupRouter = Router();

groupRouter.post(
  '/create',
  accessControl({ signIn: true }),
  groupValidator.createGroupValidator,
  groupController.createGroup,
);
groupRouter.get(
  '/:id/members',
  accessControl({ signIn: true }),
  groupValidator.groupIDValidator,
  groupController.getGroupMembers,
);
groupRouter.post(
  '/:id/channel/create',
  accessControl({ signIn: true }),
  groupValidator.groupIDValidator,
  groupValidator.createChannelValidator,
  groupController.createChannel,
);
groupRouter.post(
  '/join',
  accessControl({ signIn: true }),
  groupValidator.joinGroupValidator,
  groupController.joinGroup,
);
groupRouter.delete(
  '/:id',
  accessControl({ signIn: true }),
  groupValidator.deleteGroupValidator,
  groupController.deleteGroup,
);
groupRouter.delete(
  '/:groupID/:channelType/:channelID',
  accessControl({ signIn: true }),
  groupValidator.deleteChannelValidator,
  groupController.deleteChannel,
);
