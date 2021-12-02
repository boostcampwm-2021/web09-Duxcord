import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import morgan from 'morgan';
import { TypeormStore } from 'typeorm-store';
import { apiRouter } from '../routes/api.router';
import { CustomError } from '../utils/CatchError';
import { sessionRepository } from './orm.loader';

export const expressLoader = (app) => {
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

  app.use((error, req: Request, res: Response, next: NextFunction) => {
    !(error instanceof CustomError) && console.error(error);
    res.status(error.status || 500).send(error.message);
  });
};
