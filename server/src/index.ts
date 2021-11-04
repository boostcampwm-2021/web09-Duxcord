import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import { TypeormStore } from 'typeorm-store';
import dotenv from 'dotenv';
dotenv.config();

import { initORM, sessionRepository } from './db';
import { apiRouter } from './router/api.router';
import { createServer } from 'http';
import { socketInit } from './socket';

export const appInit = async () => {
  await initORM();
  const app = express();
  const httpServer = createServer(app);
  socketInit(httpServer);
  app.set('port', process.env.PORT || 8000);
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      secret: process.env.SESSION_COOKIE_SECRET,
      store: new TypeormStore({ repository: sessionRepository }),
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use('/api', apiRouter);

  // 에러 핸들러
  app.use(function (error, req, res, next) {
    console.error(error);
    res.status(500).send(error.message);
  });

  if (process.env.NODE_ENV === 'test') return app;

  httpServer.listen(app.get('port'), () => {
    console.log('Express server has started on port', app.get('port'));
  });
};

appInit().catch((error) => console.log(error));
