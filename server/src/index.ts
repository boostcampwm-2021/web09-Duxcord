import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { rootLoader } from './loaders/root.loader';

export const appInit = async () => {
  const app = express();
  const httpServer = createServer(app);
  await rootLoader(app, httpServer);

  if (process.env.NODE_ENV === 'test') return app;

  httpServer.listen(app.get('port'), () => {
    console.log('Express server has started on port', app.get('port'));
  });
};

appInit().catch((error) => console.log(error));
