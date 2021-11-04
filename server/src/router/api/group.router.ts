import { Router } from 'express';
import groupController from '../../controller/group.controller';
import { accessControl } from '../../util';
export const groupRouter = Router();

groupRouter.post('/create', accessControl({ signIn: true }), groupController.createGroup);
groupRouter.get('/:id/members', accessControl({ signIn: true }), groupController.getGroupMembers);
groupRouter.post('/:id/channel/create', accessControl({ signIn: true }), groupController.createChannel);
groupRouter.post('/join', accessControl({ signIn: true }), groupController.joinGroup);
