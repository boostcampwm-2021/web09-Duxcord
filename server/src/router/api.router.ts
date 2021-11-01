import { Router } from 'express';
import { userRouter } from './api/user.router';
export const apiRouter = Router();

apiRouter.use('/user', userRouter);
