import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { ormLoader } from './loaders/orm.loader';
import { createServer } from 'http';
import { socketLoader } from './loaders/socket.loader';
import { appLoader } from './loaders/app.loader';

export const appInit = async () => {
  await ormLoader();
  const app = express();
  const httpServer = createServer(app);
  socketLoader(httpServer);
  appLoader(app);

  if (process.env.NODE_ENV === 'test') return app;

  httpServer.listen(app.get('port'), () => {
    console.log('Express server has started on port', app.get('port'));
  });
};

appInit().catch((error) => console.log(error));
