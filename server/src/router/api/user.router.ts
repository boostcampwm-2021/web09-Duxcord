import { Router } from 'express';
import userController from '../../controller/user.controller';
import { accessControl } from '../../util';
export const userRouter = Router();

userRouter.post('/signup', accessControl({ signIn: false }), userController.signUp);
userRouter.post('/signin', accessControl({ signIn: false }), userController.signIn);
userRouter.post('/signout', accessControl(), userController.signOut);
