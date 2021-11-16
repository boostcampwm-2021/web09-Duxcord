import { expressLoader } from './express.loader';
import { ormLoader } from './orm.loader';
import { socketLoader } from './socket.loader';

export const rootLoader = async (app, httpServer) => {
  await ormLoader();
  socketLoader(httpServer);
  expressLoader(app);
};
