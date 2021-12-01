import { Router } from 'express';
import userController from '../../controllers/user.controller';
import { accessControl } from '../../utils';
import { userValidator } from '../../utils/validators';

export const userRouter = Router();

userRouter.get('/', accessControl({ signIn: true }), userController.getUserData);
userRouter.get('/groups', accessControl({ signIn: true }), userController.getUserGroups);
userRouter.get('/:id/profile', accessControl({ signIn: true }), userController.getOtherUserData);
userRouter.post(
  '/signup',
  accessControl({ signIn: false }),
  userValidator.signUpValidator,
  userController.signUp,
);
userRouter.post(
  '/signin',
  accessControl({ signIn: false }),
  userValidator.signInValidator,
  userController.signIn,
);
userRouter.post('/signout', accessControl({ signIn: true }), userController.signOut);
userRouter.patch(
  '/profile',
  accessControl({ signIn: true }),
  userValidator.updateUserValidator,
  userController.updateUserData,
);
userRouter.post('/presignedurl', accessControl({ signIn: true }), userController.getPresignedUrl);
