import { Router } from 'express';
import userController from '../../controllers/user.controller';
import { accessControl } from '../../utils';

export const userRouter = Router();

userRouter.get('/', accessControl(), userController.getUserData);
userRouter.get('/groups', accessControl({ signIn: true }), userController.getUserGroups);
userRouter.get('/:id/profile', accessControl({ signIn: true }), userController.getOtherUserData);
userRouter.post('/signup', accessControl({ signIn: false }), userController.signUp);
userRouter.post('/signin', accessControl({ signIn: false }), userController.signIn);
userRouter.post('/signout', accessControl(), userController.signOut);
userRouter.post('/presignedurl', accessControl({ signIn: true }), userController.getPresignedUrl);
userRouter.patch('/profile', accessControl({ signIn: true }), userController.updateUserData);
