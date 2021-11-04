import { Router } from 'express';

import { groupRouter } from './api/group.router';
import { userRouter } from './api/user.router';
import { channelRouter } from './api/channel.router';
import { textRouter } from './api/text.router';

export const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/group', groupRouter);
apiRouter.use('/channel', channelRouter);
apiRouter.use('/text', textRouter);
