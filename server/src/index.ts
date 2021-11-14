import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { ormLoader } from './loaders/ormLoader';
import { createServer } from 'http';
import { socketLoader } from './loaders/socketLoader';
import { appLoader } from './loaders/appLoader';

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
