import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import { initORM, sessionRepository } from './db';
import session from 'express-session';
import { TypeormStore } from 'typeorm-store';
import { apiRouter } from './router/api.router';

const appInit = async () => {
  await initORM();
  const app = express();
  app.set('port', process.env.PORT || 8000);
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.listen(app.get('port'), () => {
    console.log('Express server has started on port', app.get('port'));
  });
  app.use(
    session({
      secret: process.env.SESSION_COOKIE_SECRET,
      store: new TypeormStore({ repository: sessionRepository }),
      cookie: { secure: true },
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

appInit().catch((error) => console.log(error));
