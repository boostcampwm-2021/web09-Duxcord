import { Router } from 'express';

import { groupRouter } from './api/group.router';
import { userRouter } from './api/user.router';
export const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/group', groupRouter);
