import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import { TypeormStore } from 'typeorm-store';
import { apiRouter } from '../routes/api.router';
import { sessionRepository } from './ormLoader';

export const appLoader = (app) => {
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
};
